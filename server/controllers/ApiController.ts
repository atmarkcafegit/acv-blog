import {Controller} from "../core/decorators/controllers/Controller";
import {Get} from "../core/decorators/methods/Get";
import {PostModel} from "../models/PostModel";
import {UserModel} from "../models/UserModel";
import {Error, Result} from "../core/common/Response";
import {Data} from "../core/decorators/parameters/Data";
import {Param} from "../core/decorators/parameters/Param";
import {Post} from "../core/decorators/methods/Post";
import {CommentModel} from '../models/CommentModel';
import {Delete} from "../core/decorators/methods/Delete";
import * as express from 'express'

const PAGE_LIMIT = 5;

const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if ((req as any).session.authUser)
        return next();
    else {
        res.status(403).json({
            ok: false,
            message: 'Unauthorized'
        })
    }
};

@Controller('api')
class ApiController {

    @Get('posts')
    private async getPosts(@Param('page', true) page: number) {
        let posts = await PostModel.paginate({}, {
            page: page ? page : 1,
            sort: {
                createdAt: '-1'
            },
            populate: 'user',
            limit: PAGE_LIMIT
        });

        if (posts) {
            if (posts.docs.length === 0) {
                return new Error(404, "No post.");
            }

            return new Result('posts', posts);
        }
    }

    @Post('post', [auth])
    private async addPost(@Data('title') title: string,
                          @Data('content') content: string,
                          @Data('userId') userId: string) {

        let post = await PostModel.create({
            title: title,
            content: content,
            user: userId
        });

        if (post) {
            let user = await UserModel.findById(userId);

            if (user) {
                user.posts.push(post);
                await user.save();

                return new Result();
            } else {
                return new Error(404, "User not found.");
            }
        } else {
            return new Error(500, "Internal server error.");
        }
    }

    @Get('post')
    private async getPost(@Param('slug') slug: string) {
        let post = await (PostModel.findOne({slug: slug}) as any)
            .deepPopulate(['user', 'comments', 'comments.user']);

        if (post) {
            if (!post.views)
                post.views = 0;

            post.views += 1;
            await post.save();

            return new Result('post', post);
        } else {
            return new Error(404, "Post not found.");
        }
    }

    @Post('post/comment', [auth])
    private async addComment(@Data('content') content: string,
                             @Data('userId') userId: string,
                             @Data('postId') postId: string) {
        let comment = await CommentModel.create({
            content: content,
            user: userId,
            post: postId
        });

        let post = await PostModel.findById(postId);

        if (comment && post) {
            post.comments.push(comment);
            await post.save();

            return new Result('comment', comment);
        } else {
            return new Error(500, "Internal server error.");
        }
    }

    @Delete('post/comment', [auth])
    private async deleteComment(@Param('commentId') commentId: string) {
        await CommentModel.findOneAndRemove({
            _id: commentId
        });

        await PostModel.update({comments: commentId}, {$pull: {comments: commentId}});

        return new Result()
    }

    @Get('hot-authors')
    private async getHotAuthors() {
        let posts = await PostModel.aggregate(
            {$group: {_id: '$user', numberViews: {$sum: '$views'}}},
            {$sort: {numberViews: -1}},
            {$limit: 5}
        );

        if (posts.length === 0) {
            return new Error(404, "No author.");
        }

        let user: string[] = [];

        for (let i = 0, len = posts.length; i < len; i++) {
            user.push(posts[i]['_id']);
        }

        let users = await UserModel.find({_id: {"$in": user}});

        return new Result('authors', users);
    }

    @Get('hot-posts')
    private async getHotPosts() {
        let posts = await PostModel.find({},
            ['_id', 'slug', 'title', 'views', 'createdAt', 'updatedAt']).sort({views: -1}).limit(5);

        return new Result('posts', posts);
    }
}
