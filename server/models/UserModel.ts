import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {IPostModel} from './PostModel'
import {IScoreModel} from "../models/ScoreModel";

import * as mongoosePaginate from 'mongoose-paginate';

const mongooseDeepPopulate = require('mongoose-deep-populate')(mongoose);

const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

export enum USER_ROLE {
    MEMBER,
    LEADER,
    ADMIN
}

export interface IUserModel extends mongoose.Document {
    username: string,
    password: string,
    displayName: string,
    email: string,
    posts: Array<IPostModel>,
    score: Array<IScoreModel>,
    role: USER_ROLE,
    createdAt: Date,
    updatedAt: Date,

    comparePassword (candidatePassword: string);
}

export const UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    displayName: {type: String},
    email: {type: String},
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    score: [{type: Schema.Types.ObjectId, ref: 'Score'}],
    role: {type: Number},
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

UserSchema.pre('save', function (next) {
    let now = new Date();

    this.updatedAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }

    if (!this.isModified('password'))
        return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
        if (error)
            return next(error);

        bcrypt.hash(this.password, salt, (error, hash) => {
            if (error)
                return next(error);

            this.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.password;
    return obj
};

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(mongooseDeepPopulate);

export const UserModel = mongoose.model<IUserModel>("User", UserSchema);
