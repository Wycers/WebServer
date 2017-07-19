var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer  = require('multer');

var packing = false, pause = true;
var first="", second="", third="";

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: __dirname + "/temp/"}).array('code'));

app.get('/', function(req, res) {
    res.sendFile( __dirname + "/" + "index.html");
});

app.get('/pro.zip', function(req, res) {
    res.end("No way~");
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

app.get('/status', function(req, res) {
    res.end(pause ? "off" : "on");
});

app.get('/download', function(req, res) {
    if (pause) {
	console.log(req.body.name + " wants to download but the server is pauing");
	res.end("pause");
	return;
    }
    res.sendFile(__dirname + "/pro.zip");
});

app.post('/upload', function(req, res) {
    if (pause) {
	console.log(req.body.name + " wants to upload but the server is pausing");
	res.end("pause");
	return;
    }
    if (packing) {
	console.log(req.body.name + " wants to upload but the server is packing now.");
	res.end("packing");
	return;
    }
    if (req.files.length == 0) {
	console.log(req.body.name + " wants to upload but failed. (No file)");
	res.end("failed");
	return;
    }
    var name = req.files[0].originalname;
    var filename = name.substring(name.lastIndexOf("\\") + 1, name.lastIndexOf(".")).toLowerCase();
    if (filename != first && filename != second && filename != third) {
	res.end("illegal");
	return;
    }

    
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
		if (err) {
		    throw err;
		    console.log("file uplpad failed: " + file_dir);
		    res.end("failed");
		}
		else {
		    console.log("file upload success: " + file_dir);
		    res.end("success");
		}
	    }); 
	});
    });
    
});



var server = app.listen(8000, function() {
    console.log("Frontstage is working.");
});






var tool = express();
tool.use(express.static(__dirname));
tool.use(multer({ dest: __dirname + "/temp/"}).array('zip'));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
tool.use(urlencodedParser);

var admin_server = tool.listen(8081, function() {
    console.log("Backstage is working.");
});

tool.get('/', function(req, res) {
    res.end("= =");
});
tool.get('/admin', function(req, res) {
    res.sendFile(__dirname + "/admin.html");
});

tool.post('/setname', urlencodedParser, function(req, res) {
    var response = {
	"first":req.body.first,
	"second":req.body.second,
	"third":req.body.third
    };
    console.log("Name changed:");
    console.log(response);
    first = response.first;
    second = response.second;
    third = response.third;
    res.end("success");
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
    var file_dir = __dirname + "/pro.zip";
    fs.readFile(req.files[0].path, function(err, data) {
	fs.writeFile(file_dir, data, function(err) {
	    if (err){
		console.log("pro file upload failed:" + file_dir);
		res.end("failed");
		throw err;
	    }
	    else {
		console.log("pro file upload success" + file_dir);
		res.end("success");
	    }
	}); 
    });
});

tool.get('/status', function(req, res) {
    pause = !pause;
    console.log(pause ? "status: lock" : "status: unlock");
    res.end(pause ? "off" : "on"); 
});
