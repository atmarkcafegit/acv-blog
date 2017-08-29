import * as express from "express";
import {User} from '../models/User';
import {Post} from '../models/Post';

const router = express.Router();
const PAGE_LIMIT = 5;

router.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }).then(user => {
        if (user) {
            user.comparePassword(req.body.password, (error, r) => {
                if (error) {
                    console.log(r);
                    res.status(500).json({
                        ok: false,
                        message: 'Internal server error.'
                    })
                }

                if (r) {
                    let authUser = {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    };

                    req.session.authUser = authUser;

                    res.json({
                        ok: true,
                        user: authUser,
                    })
                } else {
                    res.status(401).json({
                        ok: false,
                        message: 'Invalid username or password.'
                    })
                }
            })
        } else {
            res.status(404).json({
                ok: false,
                message: 'User not found.'
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

router.post('/logout', (req, res) => {
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
        user: req.body.id
    }).then(() => res.json({ok: true})).catch(e => {
        console.log(e);
        res.status(500).json({
            ok: false,
            message: 'Internal server error.'
        })
    })
});

router.get('/api/post/:slug', (req, res) => {
    Post.findOne({
        slug: req.params.slug
    }).populate('user').then(post => {
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
                message: 'Post can\'t be found.'
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

router.post('/api/post/:slug/vote', (req, res) => {

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

export function getRouter() {
    return router;
}
