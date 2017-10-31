import {Controller, Data, Delete, Error, Get, Param, Post, Put, Result, Session} from "minmin";
import {PostModel} from "../models/PostModel";
import {UserModel} from "../models/UserModel";
import {IScoreModel, ScoreModel} from "../models/ScoreModel";
import {CommentModel} from '../models/CommentModel';
import * as moment from 'moment'
import * as _ from 'lodash'
import {auth, PAGE_LIMIT} from "../commons/utils";

@Controller('api')
class PostController {

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
                          @Data('tags') tags: [string],
                          @Session() session: any) {
        let userId = session.authUser._id;

        let post = await PostModel.create({
            title: title,
            content: content,
            tags: tags,
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
            .deepPopulate(['user', 'user.score', 'user.posts', 'comments', 'comments.user']);

        if (post) {
            if (!post.views)
                post.views = 0;

            post.views += 1;
            post.save();

            return new Result('post', post);
        } else {
            return new Error(404, "Post not found.");
        }
    }

    @Put('post', [auth])
    private async updatePost(@Param('slug') slug: string,
                             @Data('title') title: string,
                             @Data('content') content: string,
                             @Data('tags') tags: [string],
                             @Session() session: any) {
        let userId = session.authUser._id;

        let post = await PostModel.findOneAndUpdate({
            slug: slug,
            user: userId
        }, {
            $set: {
                title: title,
                content: content,
                tags: tags
            }
        }, {upsert: true});

        if (post)
            return new Result();
        else
            return new Error(500, "Internal server error.");
    }

    @Delete('post', [auth])
    private async deletePost(@Param('slug') slug: string,
                             @Session() session: any) {
        let userId = session.authUser._id;
        let post = await PostModel.findOneAndRemove({
            slug: slug,
            user: userId
        }).populate('user');

        if (post) {
            let user = post.user;
            if (user._id === userId) {
                user.posts.remove(post);
                await user.save();
            }
        }

        return new Result();
    }

    @Post('post/vote', [auth])
    private async vote(@Data('postId') postId: string,
                       @Session() session: any) {
        let userId = session.authUser._id;

        let [user, post] = await Promise.all([
            UserModel.findById(userId),
            (PostModel.findById(postId) as any).deepPopulate(['user', 'user.score'])
        ]);

        if (user && post) {
            let existUser = _.find(post.votes, user => {
                return user.toString() == userId;
            });

            if (!existUser) {
                post.votes.push(user);
                post.save().then();

                let month = moment(post.createdAt).format('YYYY-MM');
                let score: IScoreModel = _.find(post.user.score, score => {
                    return (score as IScoreModel).month === month;
                }) as IScoreModel;

                if (score) {
                    score.value += 100;
                    score.save().then();
                } else {
                    score = new ScoreModel({
                        month: month,
                        value: 100,
                        user: post.user
                    });

                    await score.save();

                    post.user.score.push(score);
                    post.user.save();
                }

                return new Result('score', score.value);
            }

            return new Result('score', 0);
        }

        return new Error(500, "Internal server error.");
    }

    @Post('post/unvote', [auth])
    private async unvote(@Data('postId') postId: string, @Session() session: any) {
        let userId = session.authUser._id;

        let [user, post] = await Promise.all([
            UserModel.findById(userId),
            (PostModel.findById(postId) as any).deepPopulate(['user', 'user.score'])
        ]);

        if (user && post) {
            let existUserIndex = post.votes.indexOf(user._id);
            if (existUserIndex !== -1) {
                post.votes.splice(existUserIndex, 1);
                post.save();

                let month = moment(post.createdAt).format('YYYY-MM');
                let score: IScoreModel = _.find(post.user.score, score => {
                    return (score as IScoreModel).month === month;
                }) as IScoreModel;

                if (score) {
                    score.value -= 100;
                    score.save().then();

                    return new Result('score', score.value);
                }
            }

            return new Result('score', 0);
        }

        return new Error(500, "Internal server error.");
    }

    @Post('post/comment', [auth])
    private async addComment(@Data('content') content: string,
                             @Data('postId') postId: string,
                             @Session() session: any) {
        let userId = session.authUser._id;

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
    private async deleteComment(@Param('commentId') commentId: string,
                                @Session() session: any) {
        let userId = session.authUser._id;

        await CommentModel.findOneAndRemove({
            _id: commentId,
            user: userId
        });

        await PostModel.update({comments: commentId}, {$pull: {comments: commentId}});

        return new Result()
    }
}