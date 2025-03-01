var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var template = require('./lib/template.js');



var app = http.createServer(function (request, response) {
    var _url = request.url;
    console.log('_url ==' + _url);
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function (error, filelist) {
                console.log(filelist);
                var title = 'Welcome';
                var description = 'Hello Node.js';

                /* 
                var list = templateList(filelist);
                var template = templateHTML(title, list
                    , `<h2>${title}</h2>${description}`
                    , `<a href="/create">create</a>`
                );

                response.writeHead(200);
                response.end(template);
                */


                var list = template.list(filelist);
                var html = template.html(title, list
                    , `<h2>${title}</h2>${description}`
                    , `<a href="/create">create</a>`
                );

                response.writeHead(200);
                response.end(html);

            });

        } else {
            fs.readdir('./data', function (error, filelist) {
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
                    var title = queryData.id;
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizedDescription = sanitizeHtml(description, {
                        allowedTags : ['h1']
                    });
                    var list = template.list(filelist);
                    var html = template.html(sanitizedTitle, list
                        , `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`
                        , `<a href="/create">create</a>  
                           <a href="/update?id=${sanitizedTitle}">update</a>
                           <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="delete">
                           </form>`
                    );

                    response.writeHead(200);
                    response.end(html);
                });
            });
        }

    } else if (pathname === '/create') {
        fs.readdir('./data', function (error, filelist) {
            console.log(filelist);
            var title = 'Web - create';
            var list = template.list(filelist);
            var html = template.html(title, list, `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder ="title"></p>
                    <p>
                        <textarea name="description" placeholder ="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `
                , '');
            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            console.log("title >> " + title);
            console.log("description >>> " + description);

            fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end('success');
            });
        });

    } else if (pathname === `/update`) {
        fs.readdir('./data', function (error, filelist) {
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
                var title = queryData.id;
                var list = template.list(filelist);
                var html = template.html(title, list
                    , `
                    <form action="/update_process" method="post">
                    <input type="hidden" name="id" value=${title}>
                    <p><input type="text" name="title" placeholder ="title" value=${title}></p>
                    <p>
                        <textarea name="description" placeholder ="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                     </form>
                    `
                    , `<a href="/create">create</a>  <a href="/update?id=${title}">update</a>`);

                response.writeHead(200);
                response.end(html);
            });
        });
    } else if (pathname === `/update_process`) {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            console.log(post);
            fs.rename(`data/${id}`, `data/${title}`, function (err) {
                fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end('success');
                });
            });
        });
    } else if (pathname === `/delete_process`) {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            console.log(post);
            fs.unlink(`data/${filteredId}`, function (err) {
                response.writeHead(302, { Location: `/` });
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not found.');
    }

});
app.listen(3000); 