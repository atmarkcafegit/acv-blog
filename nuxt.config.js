module.exports = {
    env: {
        baseUrl: 'http://blog.pgcafe.asia'
    },
    head: {
        title: "Atmarkcafe's Blog",
        meta: [
            {charset: 'utf-8'},
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui'
            },
            {name: 'robots', content: 'noindex, nofollow'},
            {name: 'googlebot', content: 'noindex, nofollow'},
            {hid: 'description', content: "Atmarkcafe's Blog"}
        ],
        link: [
            {rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'},
            {rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'},
            {
                rel: 'stylesheet',
                href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css'
            }
        ],
        script: [
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML-full'}
        ]
    },
    router: {
        mode: 'history'
    },
    loading: {
        color: 'green',
        height: '2px'
    },
    cache: true,
    plugins: ['~plugins/plugins.ts'],
    build: {
        extractCSS: true,
        vendor: ['axios'],
        extend(config, {isClient}) {
            config.module.rules.push({
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            });
        }
    },
    css: [
        {src: '~assets/style/theme.css', lang: 'css'},
        {src: '~assets/style/app.styl', lang: 'styl'}
    ]
};
