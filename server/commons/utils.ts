import * as express from 'express'
import * as _ from 'lodash'

export const PAGE_LIMIT = 5;

export const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if ((req as any).session.authUser)
        return next();
    else {
        res.status(401).json({
            ok: false,
            message: 'Unauthorized'
        })
    }
};

export const calcScore = (user, month) => {
    let postViews = 0;

    _.each(user.posts, post => {
        postViews += (post as any).views;
    });

    let viewScore = Math.floor(postViews / 100);

    if (user.score.length === 0)
        return viewScore;

    let score = _.find(user.score, score => {
        return (score as any).month === month;
    });

    if (score) {
        return (score as any).value + viewScore;
    }

    return viewScore;
};