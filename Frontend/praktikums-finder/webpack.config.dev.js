const webpack = require('webpack'); // remember to require this, because we DefinePlugin is a webpack plugin

module.exports = (env) => {
    // create a nice object from the env variable
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});

    return {
        plugins: [
            new webpack.DefinePlugin(envKeys)
        ]
    };
};