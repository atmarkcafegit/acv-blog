import {Controller} from "../core/decorators/controllers/Controller";
import {Get} from "../core/decorators/methods/Get";
import {PostModel} from "../models/PostModel";
import {UserModel} from "../models/UserModel";
import {Error, Result} from "../core/common/Response";
import {Data} from "../core/decorators/parameters/Data";
import {Param} from "../core/decorators/parameters/Param";
import {Post} from "../core/decorators/methods/Post";
import {Session} from "../core/decorators/parameters/Session";
import {CommentModel} from '../models/CommentModel';

const PAGE_LIMIT = 5;

@Controller('api')
class ApiController {

    @Get('posts')
    private async posts(@Param('page', true) page: number) {
        let posts = await PostModel.paginate({}, {
            page: page ? page : 1,
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

    @Post('post')
    private async post(@Data('title') title: string,
                       @Data('content') content: string,
                       @Session() session: any) {

        let post = await PostModel.create({
            title: title,
            content: content,
            user: session.authUser._id
        });

        if (post) {
            let user = await UserModel.findById(session.authUser._id);

            if (user) {
                user.posts.push(post);
                user.save();

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

    @Post('post/comment')
    private async addComment(@Data('content') content: string,
                             @Data('userId') userId: string,
                             @Data('postId') postId: string) {
        let comment = await CommentModel.create({
            content: content,
            user: userId,
            post: postId
        });

        let post = await (PostModel
            .findById(postId) as any)
            .deepPopulate(['comments']);

        if (comment && post) {
            post.comments.push(comment);
            await post.save();

            return new Result('comments', post.comments);
        } else {
            return new Error(500, "Internal server error.");
        }
    }

    @Get('author/hot')
    private async getHotAuthor() {
        let posts = await PostModel.aggregate(
            { $group: {_id: '$user', numberViews: {$sum: '$views'}}},
            { $sort: {numberViews: -1} },
            { $limit : 5 }
        )

        if (posts.length === 0) {
            return new Error(404, "No author.");
        }

        let user: string[] = [];

        for (let i = 0, len = posts.length; i < len; i++) {
            user.push(posts[i]['_id']);
        }

        let users = await UserModel.find({ _id: { "$in" : user} });

        if (users) {
            return new Result('authors', users);
        }
    }

    @Get('posts/hot')
    private async getHotPost() {
        let posts = await PostModel.find(
            { $sort: {views: -1} },
            { $limit : 5 }
        )

        if (posts) {
            return new Result('posts', posts);
        }
    }
}
