import * as mongoose from 'mongoose'
import * as Q from 'q'
import {WebServer} from "minmin"

import './controllers/AuthController'
import './controllers/HomeController'
import './controllers/PostController'
import './controllers/UserController'

let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

const uri = 'mongodb://localhost:27017/acv_blog';

require('mongoose').Promise = Q.Promise;
mongoose.connect(uri, {
    useMongoClient: true
}).then(() => {
    const server = new WebServer(config);
    server.setPort(3001);
    server.start();

}).catch(e => {
    console.log(e)
});
