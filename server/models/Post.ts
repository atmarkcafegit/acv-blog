import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {ICommentModel} from './Comment';
import * as mongoosePaginate from 'mongoose-paginate';

const monguurl = require('monguurl');
const mongooseDeepPopulate = require('mongoose-deep-populate')(mongoose);

export interface IPostModel extends mongoose.Document {
    title: string,
    slug: string,
    content: string,
    user: any,
    views: number,
    vote: number,
    comments: Array<ICommentModel>,
    createdAt: Date,
    updatedAt: Date
}

const PostSchema = new Schema({
    title: {type: String, required: true},
    slug: {type: String, index: {unique: true}},
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    views: {type: Number},
    vote: {type: Number},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

PostSchema.pre('save', next => {
    let now = new Date();

    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }

    next();
});

PostSchema.plugin(monguurl({source: 'title', target: 'slug'}));
PostSchema.plugin(mongoosePaginate);
PostSchema.plugin(mongooseDeepPopulate);

export const Post = mongoose.model<IPostModel>("Post", PostSchema);