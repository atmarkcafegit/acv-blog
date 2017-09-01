import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {IPostModel} from './Post'

const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

export interface IUserModel extends mongoose.Document {
    username: string,
    password: string,
    email: string,
    posts: Array<IPostModel>,
    createdAt: Date,
    updatedAt: Date,

    comparePassword (candidatePassword: string);
}

export const UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    email: {type: String},
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
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

export const User = mongoose.model<IUserModel>("User", UserSchema);
