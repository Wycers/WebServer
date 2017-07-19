var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer  = require('multer');

var packing = false;

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: __dirname + "/temp/"}).array('code'));

app.get('/', function(req, res) {
    res.sendFile( __dirname + "/" + "index.html");
});

app.get('/files', function(req, res) {
    res.end("No way~");
});

app.get('/query', function(req, res) {
    var dir = __dirname + "/files/" + req.query.usr;
    fs.exists(dir, function(exists) {
	if (exists == false)
	    res.end("nil"); 
	else
	    fs.readdir(dir, function (err, files) {
		var str = "";
		for (var i = 0; i < files.length; ++i) {
		    str = str + files[i] + "|";
		}
		res.end(str);
	    });
    });  
});

app.post('/upload', function(req, res) {

    if (packing) {
	console.log(req.body.name + " wants to upload but the server is packing now.");
	res.end("packing");
    } else {
	var dir = __dirname + "/files/" + req.body.name;
	fs.exists(dir, function(exists) {
	    if (exists == false)
		fs.mkdir(dir, 0777, function(err) {
		    if (err) 
			throw err;
		    else
			console.log(dir + "created");
		});
	    var file_dir = dir + "/" + req.files[0].originalname;
	    fs.readFile(req.files[0].path, function(err, data) {
		fs.writeFile(file_dir, data, function(err) {
		    if (err){
			throw err;
			console.log("file uplpad failed:" + file_dir);
			res.end("failed");
		    }
		    else {
			console.log("file upload success:" + file_dir);
			res.end("success");
		    }
		}); 
	    });
	});
    }
});



var server = app.listen(8000, function() {
    console.log("Frontstage is working.");
});



var tool = express();
tool.use(express.static(__dirname));
tool.use(bodyParser.urlencoded({ extended: false }));
tool.use(multer({ dest: __dirname + "/temp/"}).array('pdf'));

var admin_server = tool.listen(8081, function() {
    console.log("Backstage is working.");
});

tool.get('/', function(req, res) {
    res.end("= =");
});
tool.get('/admin', function(req, res) {
    res.sendFile(__dirname + "/admin.html");
});

tool.get('/packing', function(req, res) {
    if (packing)
	return;
    packing = true;
    console.log("Start packing!");
    var archiver = require('archiver');
    var output = fs.createWriteStream(__dirname + '/sources.zip');
    var archive = archiver('zip', {
	zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', function() {
	console.log(archive.pointer() + ' total bytes');
	console.log('End packing.');
	packing = false;
	res.end("success");
    });

    archive.on('warning', function(err) {
	if (err.code === 'ENOENT') {
	    // log warning
	} else {
	    // throw error
	    throw err;
	}
    });
    archive.on('error', function(err) {
	throw err;
    });
    archive.pipe(output);
    archive.directory('files/', 'sources');
    archive.finalize();
});


tool.post('/proupload', function(req, res) {
    var file_dir = __dirname + "/files/pro.pdf";
    fs.readFile(req.files[0].path, function(err, data) {
	fs.writeFile(file_dir, data, function(err) {
	    if (err){
		throw err;
		console.log("pro file upload failed:" + file_dir);
		res.end("failed");
	    }
	    else {
		console.log("pro file upload success" + file_dir);
		res.end("success");
	    }
	}); 
    });
});
