'use strict';

let gulp = require('gulp'),
    gutil = require('gulp-util'),
    gulpHelper = require('./config/gulp/gulp-helper'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    tslint = require('gulp-tslint'),
    rimraf = require('rimraf'),
    less = require('gulp-less'),
    path = require('path'),
    gulpConfig = require('./config/gulp/gulp.config.json'),
    buildConfig = require('./config/build.config.json'),
    replace = require('gulp-string-replace'),
    runSequence = require('gulp-sequence'),
    argv = require('yargs').argv,
    dir = require('node-dir'),
    mergeStream = require('merge-stream'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    bump = require('gulp-bump');

/**
 * Replace string for asset location in private label json & web.config
 */
const virtualPath = gulpHelper.getVirtualPath(argv.env);
var isCertified = (argv.certified === undefined) ? false : true;
/**
 * Build task for generatingg build for different environments. Pass environment name to --env parameter
 * Supported environments are local,dev,dev2,test & prod
 * Example : >gulp build --env=dev
 */
gulp.task('build', function (callback) {
    console.log(`Selected environment: ${argv.env}`);
    runSequence(['tslint', 'clean-build'], 'incrementVersion', 'copyPrivateLabelConfig',
        'copyAppConfig', 'createBundle', ['updateWebConfig', 'updatePrivateLabelConfig'],
        'compilePrivateLabelStyles')(callback)
})

/**
 * Task for running web app locally inside webpack dev server
 */
gulp.task('serve', ['tslint'], (callback) => {
    let compiler = webpack(webpacklocalConfig());
    new WebpackDevServer(compiler, {
    }).listen(gulpConfig.dev.port, gulpConfig.dev.host, (error) => {
        if (error) {
            throw new gutil.PluginError('serve', err);
        }
    })
})

/**
 * Sets default gulp task
 */

gulp.task('default', ['serve']);


/**
 * Task for running ts lint
 */
gulp.task('tslint', () => {
    return gulp.src(gulpConfig.filePaths.typescriptFiles.src)
        .pipe(tslint({
        }))
        .pipe(tslint.report({
            emitError: true
        }));
});

/**
 * Gulp copy task
 */
gulp.task('copyAppConfig', () => {
    var sourceFiles = ['./config/app/' + argv.env + '.json'];
    var destination = './src/client/app/core/global-configuration/';
    gulp
        .src(sourceFiles)
        .pipe(rename('app-config.json'))
        .pipe(gulp.dest(destination));
});


/**
 * Gulp copy private label json
 */
gulp.task('copyPrivateLabelConfig', () => {
    var sourceFiles = ['./config/app/branding/' + gulpHelper.getBrandingConfig(argv.env) + '.json'];
    var destination = './src/assets/config/';
    gulp
        .src(sourceFiles)
        .pipe(rename('private-label.json'))
        .pipe(gulp.dest(destination));
});


/**
 * Task for deleting existing dist folder
 */
gulp.task('clean-build', (callback) => {
    return rimraf(gulpConfig.filePaths.default.dest, callback);
})


/**
 * Task for replacing variables in web.config file. This task also copy these files to dis folder
 */

gulp.task('updateWebConfig', () => {
    gulp.src([gulpConfig.filePaths.webConfig.src + '/' + gulpHelper.getWebConfig(argv.env) + '.config' ])
        .pipe(rename('web.config'))
        .pipe(replace(buildConfig.staticAsset.searchPattern.default, virtualPath))
        .pipe(gulp.dest(gulpConfig.filePaths.webConfig.dest))
});

/**
 * Task for replacing variables privatelabel json and eulajson file. This task also copy these files to dis folder
 */

gulp.task('updatePrivateLabelConfig', () => {
    gulp.src([gulpConfig.filePaths.privateLabel.src, gulpConfig.filePaths.eula.src])
        .pipe(replace(buildConfig.staticAsset.searchPattern.privateLabel, virtualPath + 'assets/'))
        .pipe(gulp.dest(gulpConfig.filePaths.privateLabel.dest))
});


/**
 * Task for packing and releasing to dist folder
 */
gulp.task('createBundle', (callback) => {
    webpack(gulpHelper.getWebPackConfig(argv.env), function (err, status) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', status.toString({

        }));
        callback();
    })
});

/**
 * task for updating version. Update version only for certified build.
 */
gulp.task('incrementVersion', () => {
    if (isCertified) {
        gulp.src(gulpConfig.filePaths.version.src)
            .pipe(bump({ type: argv.type }))
            .pipe(gulp.dest(gulpConfig.filePaths.version.dest));
    }
});
/**
 * task for compiling private label less files as separate css files.
 */
gulp.task('compilePrivateLabelStyles', function () {
    var tasks = [];
    buildConfig.jv.src.forEach(function (element) {
        tasks.push(
            gulp.src(element)
                .pipe(less({
                    paths: [path.join(__dirname, 'less', 'includes')]
                }))
                .pipe(replace(buildConfig.staticAsset.searchPattern.default, virtualPath))
                .pipe(cssmin())
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest(buildConfig.jv.dest))
        );
    }, this);
    return mergeStream(tasks);
});