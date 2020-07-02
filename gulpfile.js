const { task, src, series, dest } = require('gulp');
const file = require('gulp-file');
const pkg = require('./package.json');
const del = require('del')


task('clean', async () => {
    return del.sync(['lib'])
})

task('copyToDist', async () => {
    // await src('./src/module/**/*').pipe(dest('./dist/'))
    await src('./README.md').pipe(dest('./lib/'))
})

task('makePackageJson', async () => {
    let distPkg = {
        name:pkg.name,
        version:pkg.version,
    }
    distPkg.dependencies = pkg.dependencies
    distPkg.description = pkg.description;
    distPkg.main = pkg.main;
    distPkg.keywords = pkg.keywords;
    distPkg.license = pkg.license;
    distPkg.bugs = pkg.bugs;
    distPkg.homepage = pkg.homepage;
    distPkg.repository = pkg.repository;
    distPkg.author = pkg.author;

    await file('package.json', JSON.stringify(distPkg, null, 2), { src: true })
        .pipe(dest('lib'));


})

task('build', series(
    // 'clean',
    'copyToDist',
    'makePackageJson'
)); 