var gulp = require('gulp');

var server = require('gulp-webserver');

var sass = require('gulp-sass');

var url = require('url');

var path = require('path');

var fs = require('fs');

var list = require('./mock/list.json');

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
})

gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series('sass'));
})

gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 8989,
            middleware: function(req, res, next) {
                //要么接口  要么文件
                if (req.url === '/favicon.ico') {
                    res.end();
                    return;
                }

                var pathname = url.parse(req.url).pathname;

                if (pathname === '/api/list') {
                    var params = url.parse(req.url, true).query;
                    var pagenum = params.pagenum,
                        limit = params.limit,
                        type = params.type,
                        key = params.key;

                    var arr = list.slice(0);

                    if (type === 'sale') {
                        arr.sort(function(a, b) {
                            return b.sale - a.sale
                        })
                    }

                    var total = Math.ceil(arr.length / limit);

                    var start = (pagenum - 1) * limit,
                        end = pagenum * limit;
                    var target = arr.slice(start, end); // 0,5  5,10  10,15

                    res.end(JSON.stringify({ code: 1, data: target, total: total }))
                } else { //文件
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }

            }
        }))
})

gulp.task('dev', gulp.series('sass', 'server', 'watch'));