import * as mongoose from 'mongoose';
import {Schema} from 'mongoose';

export interface IScoreModel extends mongoose.Document {
    value: number,
    month: string,
    user: any
}

export const ScoreSchema = new Schema({
    value: {type: Number, required: true},
    month: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

export const ScoreModel = mongoose.model<IScoreModel>("Score", ScoreSchema);