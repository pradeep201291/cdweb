
'use strict';

let webpackNonProdConfig = require('./../webpack/webpack.nonprod.config'),
    webpackProdConfig = require('./../webpack/webpack.prod.config'),
    buildConfig = require('./../build.config.json'),
    gulpConfig = require('./gulp.config.json');

module.exports = {
    getWebPackConfig: (env) => {
        if (buildConfig.webPackBundle.nonProd.indexOf(env) >= 0)
            return webpackNonProdConfig({ env: env });
        else if (buildConfig.webPackBundle.prod.indexOf(env) >= 0)
            return webpackProdConfig({ env: env });
        else
            throw new error("invalid environment details!");
    },
    getBrandingConfig: (env) => {
        if (buildConfig.brandingConfig.nonProd.indexOf(env) >= 0)
            return "non-prod";
        else if (buildConfig.brandingConfig.prod.indexOf(env) >= 0)
            return "prod";
        else
            throw new error("invalid environment details!");
    },
    getVirtualPath: (env) => {
        return buildConfig.staticAsset.path[env];
    },
    getWebConfig: (env) => {
        if (buildConfig.webConfig.nonProd.indexOf(env) >= 0)
            return "non-prod";
        else if (buildConfig.webConfig.prod.indexOf(env) >= 0)
            return "prod";
        else
            throw new error("invalid environment details!");
    }
}
