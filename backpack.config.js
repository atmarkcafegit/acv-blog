module.exports = {
    webpack: (config, options, webpack) => {
        config.resolve.extensions.push('.ts');

        config.module.rules.push({
            test: /\.ts$/,
            loader: 'ts-loader'
        });

        config.entry.main = './server.ts';
        return config
    }
};