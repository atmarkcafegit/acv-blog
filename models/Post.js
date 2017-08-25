const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const monguurl = require('monguurl');

const PostSchema = new Schema({
    title: {type: String, required: true},
    slug: {type: string, index: {unique: true}},
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
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

module.exports = mongoose.model('Post', PostSchema);