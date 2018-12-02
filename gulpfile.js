const gulp = require('gulp')
const browserSync = require('browser-sync')

gulp.task('browser-sync', () => {
  browserSync({
    notify: false,
    proxy: 'localhost:3333',
    files: ['app', 'resources', ],
    reloadDelay: 1500
  })
})
