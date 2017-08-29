const {Nuxt, Builder} = require('nuxt');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = require('express')();

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || '3000';

const SESSION_SECRET = '220183';

app.use(bodyParser.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}));

import * as api from './routes/api';
import {Post} from './models/Post';

app.use(api.getRouter());

let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

const mongoose = require('mongoose');
const Q = require('q');
const uri = 'mongodb://localhost:27017/acv_blog';
mongoose.Promise = Q.Promise;


mongoose.connect(uri).then(() => {

    // Post.findOne({
    //     _id: '59a3ca4740bad322183c454b'
    // })
    //     .populate({
    //         path: 'comments'
    //     })
    //     .exec((err, datas) => {
    //         console.log(datas);
    //     })

    let nuxt = new Nuxt(config);
    if (config.dev) {
        new Builder(nuxt).build().then(() => {
            app.use(nuxt.render);
            app.listen(port, host);
            console.log('Server listening on ' + host + ':' + port)
        });
    } else {
        app.use(nuxt.render);
        app.listen(port, host);
        console.log('Server listening on ' + host + ':' + port)
    }

}, e => {
    console.log(e)
});


