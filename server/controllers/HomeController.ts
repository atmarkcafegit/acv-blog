import {Controller, Error, Get, Param, Result} from "minmin";
import {PostModel} from "../models/PostModel";
import {UserModel} from "../models/UserModel";
import * as moment from 'moment'
import * as _ from 'lodash'
import {calcScore, PAGE_LIMIT} from "../commons/utils";

@Controller('api')
class HomeController {

    @Get('hot-authors')
    private async getHotAuthors() {
        let month = moment(new Date()).format('YYYY-MM');

        let users = await UserModel.find().populate({
            path: 'score',
            match: {month: month}
        }).populate('posts');

        users = _.take(_.sortBy(users.slice(), user => calcScore(user, month)).reverse(), 5);

        return new Result('authors', users);
    }

    @Get('hot-posts')
    private async getHotPosts() {
        let posts = await PostModel.find({},
            ['_id', 'slug', 'title', 'views', 'createdAt', 'updatedAt'])
            .sort({views: -1}).limit(5);

        return new Result('posts', posts);
    }

    @Get('hot-tags')
    private async getHotTags() {
        let tags = await PostModel.aggregate([
            {"$unwind": "$tags"},
            {
                "$group": {
                    "_id": "$tags",
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": -1}},
            {"$limit": 10}
        ]);

        return new Result('tags', tags);
    }

    @Get('tags')
    private async getTags() {
        let tags = await PostModel.aggregate([
            {"$unwind": "$tags"},
            {
                "$group": {
                    "_id": "$tags",
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": -1}}
        ]);

        return new Result('tags', tags);
    }

    @Get('tag-posts')
    private async getTagPosts(@Param('tag') tag: string, @Param('page', true) page: number) {
        let posts = await PostModel.paginate({tags: tag}, {
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
}
