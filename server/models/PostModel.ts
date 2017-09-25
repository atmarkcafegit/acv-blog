import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {ICommentModel} from './CommentModel';
import {IUserModel} from "~/server/models/UserModel";

import * as mongoosePaginate from 'mongoose-paginate';

const mongooseDeepPopulate = require('mongoose-deep-populate')(mongoose);

export interface IPostModel extends mongoose.Document {
    title: string,
    slug: string,
    content: string,
    user: any,
    views: number,
    votes: Array<IUserModel>,
    comments: Array<ICommentModel>,
    tags: Array<string>,
    createdAt: Date,
    updatedAt: Date
}

const PostSchema = new Schema({
    title: {type: String, required: true},
    slug: {type: String, index: {unique: true}},
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    views: {type: Number},
    votes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    tags: [{type: String, index: true}],
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

PostSchema.pre('save', function (next) {
    let now = new Date();

    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }

    if (this.title) {
        if (!this.slug)
            this.slug = getSlug(this.title) + '-' + getRandomInt(1, 1000)
    }

    next();
});

function getSlug(title) {
    let slug;

    //Đổi chữ hoa thành chữ thường
    slug = title.toLowerCase();
    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');

    return slug
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

PostSchema.plugin(mongoosePaginate);
PostSchema.plugin(mongooseDeepPopulate);

export const PostModel = mongoose.model<IPostModel>("Post", PostSchema);