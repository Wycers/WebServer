var express = require('express');
var app = express();
var fs = require("fs");
 2
var bodyParser = require('body-parser');
var multer  = require('multer');
 
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: __dirname + "/temp/"}).array('code'));

app.get('/', function(req, res) {
    console.log(req.query);
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
    fs.mkdir(__dirname + "/files/" + req.body.name, 0777, function(err) {
	if (err)
	    console.log("Catalog " + req.body.name + " has created");
	else 
	    console.log("Catalog " + req.body.name + " created");
	var des_file = __dirname + "/files/" + req.body.name + "/" + req.files[0].originalname;
	fs.readFile(req.files[0].path, function(err, data) {
	    fs.writeFile(des_file, data, function(err) {
		if (err){
		    console.log(err);
		    res.end("failed");
		}
		else {
		    response = {

			usr: req.body.name,
			filename: req.files[0].originalname
		    };
		}
		console.log(response);
		res.end("success");
	    });
	}); 
    });
});


var server = app.listen(8000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log("%s:%s", host, port);
});

