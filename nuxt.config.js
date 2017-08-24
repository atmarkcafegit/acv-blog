module.exports = {
    head: {
        title: "Atmarkcafe's Blog",
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', content: "Atmarkcafe's Blog"}
        ],
        link: [
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'},
            {rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'},
            {rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'}
        ]
    },
    router: {
        linkActiveClass: 'active'
    },
    loading: {
        color: 'green',
        height: '2px'
    },
    plugins: ['~plugins/plugins.js'],
    build: {
        vendor: ['axios', 'vuetify']
    },
    css: [
        {src: '~assets/style/app.styl', lang: 'styl'}
    ]
};
