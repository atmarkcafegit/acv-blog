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
    cookie: {maxAge: 60000}
}));

app.post('/api/logout', function (req, res) {
    delete req.session.authUser;
    res.json({ok: true})
});

let config = require('./nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

let nuxt = new Nuxt(config);
new Builder(nuxt).build().then(() => {
    app.use(nuxt.render);
    app.listen(port, host);
    console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
});


