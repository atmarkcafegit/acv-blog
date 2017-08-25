const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    email: {type: String},
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
    createdAt: {type: Date},
    updatedAt: {type: Date}
});

UserSchema.pre('save', next => {
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

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
        if (error)
            return cb(error);

        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);