var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var cache = {};




var server = http.createServer(function(req, res){
	var filePath = '';
	if(req.url === '/'){
		filePath = 'public/index.html';
	}else{
		filePath = 'public' + req.url;
	}

	var absPath = './' + filePath;

	serveStaticFile(res, cache, absPath);

});

server.listen(3000, function(){
	console.log('Server listening on 3000.');
});




function send404(res){
	res.writeHead(404, {'Content-Type':'text/plan'});
	res.write('Error 404, file not found!');
	res.end();
}


function sendFile(res, filePath, fileContents){
	res.writeHead(200, {
		'Content-Type': mime.lookup(path.basename(filePath))
	});

	res.end(fileContents);
}


function serveStaticFile(res, cache, absPath){
	if(cache[absPath]){
		sendFile(res, absPath, cache[absPath]);
	}else{
		fs.access(absPath, fs.R_OK,function(err){
			if(err) {
				send404(res);
			}else {
				fs.readFile(absPath, (err, data) => {
					if(err) {
						send404(res);
					}else{
						cache[absPath] = data;
						sendFile(res, absPath, data);
					}

				}) 
			}
		})
	}
}