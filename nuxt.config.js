module.exports = {
    head: {
        title: "Atmarkcafe's Blog",
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', content: "Atmarkcafe's Blog"}
        ],
        link: [
            {rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'},
            {rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'},
            {rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css'}
        ],
        script: [
            {src: 'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js'}
        ]
    },
    router: {},
    loading: {
        color: 'green',
        height: '2px'
    },
    plugins: ['~plugins/plugins.ts'],
    build: {
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
