import {WebServer} from "./core/WebServer"

import './controllers/IndexController'
import './controllers/ApiController'

import * as mongoose from 'mongoose';

let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

const uri = 'mongodb://localhost:27017/acv_blog';

mongoose.connect(uri).then(() => {
    const server = new WebServer(config);
    server.setPort(3001);
    server.start();

}).catch(e => {
    console.log(e)
});
