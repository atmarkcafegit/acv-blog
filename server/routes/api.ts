import * as express from "express";
import {User} from '../models/User';
import {Post} from '../models/Post';
import {Comment} from '../models/Comment';

const router = express.Router();
const PAGE_LIMIT = 5;

// router.post('/login', (req: any, res) => {
//     User.findOne({
//         username: req.body.username
//     }).then(user => {
//         if (user) {
//             user.comparePassword(req.body.password, (error, r) => {
//                 if (error) {
//                     console.log(r);
//                     res.status(500).json({
//                         ok: false,
//                         message: 'Internal server error.'
//                     })
//                 }
//
//                 if (r) {
//                     let authUser = {
//                         _id: user._id,
//                         username: user.username,
//                         email: user.email
//                     };
//
//                     req.session.authUser = authUser;
//
//                     res.json({
//                         ok: true,
//                         user: authUser,
//                     })
//                 } else {
//                     res.status(401).json({
//                         ok: false,
//                         message: 'Invalid username or password.'
//                     })
//                 }
//             })
//         } else {
//             res.status(404).json({
//                 ok: false,
//                 message: 'User not found.'
//             })
//         }
//     }).catch(e => {
//         console.log(e);
//         res.status(500).json({
//             ok: false,
//             message: 'Internal server error.'
//         })
//     })
// });

router.post('/logout', (req: any, res) => {
    delete req.session.authUser;
    res.json({ok: true})
});

router.post('/register', (req, res) => {
    User.findOne({
        username: req.body.username
    }).then(user => {
        if (!user) {
            User.create({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            }).then(() => res.json({ok: true})).catch(e => {
                console.log(e);
                res.status(500).json({
                    ok: false,
                    message: 'Internal server error.'
                })
            })
        } else {
            res.status(500).json({
                ok: false,
                message: 'User already exists.'
            })
        }
    }).catch(e => {
        console.log(e);
        res.status(500).json({
            ok: false,
            message: 'Internal server error.'
        })
    });
});

router.get('/api/posts/:page?', (req, res) => {
    Post.paginate({}, {
        page: req.params.page ? parseInt(req.params.page) : 1,
        populate: 'user',
        limit: PAGE_LIMIT
    }).then(result => {
        if (result.docs.length === 0)
            return res.status(404).json({
                ok: false,
                message: 'No post.'
            });

        res.json({
            ok: true,
            posts: result
        });
    }).catch(e => {
        console.log(e);
        res.status(500).json({
            ok: false,
            message: 'Internal server error.'
        })
    })
});

router.post('/api/post', (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user: req.body.userId
    }).then(post => {
        return User.findById(req.body.userId)
            .then(user => {
                if (user) {
                    user.posts.push(post);
                    user.save().then(() => {
                        res.json({ok: true});
                    });
                } else {
                    res.status(404).json({
                        ok: false,
                        message: 'User not found.'
                    })
                }
            })
    }).catch(e => {
        console.log(e);
        res.status(500).json({
            ok: false,
            message: 'Internal server error.'
        })
    })
});

router.get('/api/post/:slug', (req, res) => {
    (Post.findOne({
        slug: req.params.slug
    }) as any)
        .deepPopulate(['user', 'comments', 'comments.user'])
        .then(post => {
            if (post) {
                if (!post.views)
                    post.views = 0;

                post.views += 1;
                post.save();

                res.json({
                    ok: true,
                    post: post
                })
            } else {
                res.status(404).json({
                    ok: false,
                    message: 'Post not found.'
                })
            }
        }).catch(e => {
        console.log(e);
        res.status(500).json({
            ok: false,
            message: 'Internal server error.'
        })
    })
});

router.post('/api/post/vote', (req, res) => {

});

router.post('/api/post/comment', (req, res) => {
    Comment.create({
        content: req.body.content,
        user: req.body.userId,
        post: req.body.postId
    }).then(comment => {
        return (Post
            .findById(req.body.postId) as any)
            .deepPopulate(['comments'])
            .then(post => {
                if (post) {
                    post.comments.push(comment);
                    post.save().then(() => {
                        res.json({
                            ok: true,
                            comments: post.comments
                        })
                    })
                } else {
                    res.status(404).json({
                        ok: false,
                        message: 'Post not found.'
                    })
                }
            })
    }).catch(e => {
        console.log(e);
        res.status(500).json({
            ok: false,
            message: 'Internal server error.'
        })
    })
});

router.put('/api/post/:slug', (req, res) => {
    Post.findOneAndUpdate({
        slug: req.params.slug
    }, {
        $set: {
            title: req.body.title,
            content: req.body.content
        }
    }, {new: true})
        .then(() => {
            res.json({ok: true})
        })
        .catch(e => {
            console.log(e);
            res.status(500).json({
                ok: false,
                message: 'Internal server error.'
            })
        })
});

router.delete('/api/post/:slug', (req, res) => {
    Post.remove({
        slug: req.params.slug
    })
        .then(() => res.json({ok: true}))
        .catch(e => {
            console.log(e);
            res.status(500).json({
                ok: false,
                message: 'Internal server error.'
            })
        })
});

router.get('/api/author/hot', (req, res) => {
    Post.aggregate(
        { $group: {_id: '$user', numberViews: {$sum: '$views'}}},
        { $sort: {numberViews: -1} },
        { $limit : 5 }
    ).then(result => {
        if (result.length === 0)
            return res.status(404).json({
                ok: false,
                message: 'No author.'
            });

        let user: string[] = [];

        for (let i = 0, len = result.length; i < len; i++) {
            user.push(result[i]['_id']);
        }

        User.find({ _id: { "$in" : user} }).then(users => {
                res.json({
                    ok: true,
                    authors: users
                });
            }
        );
    }).catch(e => {
        console.log(e);
        res.status(500).json({
            ok: false,
            message: 'Internal server error.'
        })
    })
});

export function getRouter() {
    return router;
}
