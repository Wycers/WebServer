var express = require('express');
var app = express();
var fs = require("fs");
var name, code;


function input() {
    querying = true;
    fs.readFile(__dirname + "/ip.json", function (err, data) {
	name = [];
	console.log("开始持久化：读入文件");
	if (err) {
	    console.log("持久化失败。");
	    return;
	}
	var json = JSON.parse(data);
	for (var i in json) 
	    name[json[i].ip] = json[i].name;
	for (var i in name)
	    console.log(i + " " + name[i]);
	console.log("IP to name 持久化成功。");
	querying = false;
    });	
}
input();

function input2() {
    querying = true;
    fs.readFile(__dirname + "/num.json", function (err, data) {
	code = [];
	console.log("开始持久化：读入文件");
	if (err) {
	    console.log("持久化失败。");
	    return;
	}
	var json = JSON.parse(data);
	for (var i in json) 
	    code[json[i].code] = json[i].name;
	for (var i in code)
	    console.log(i + ":" + code[i]);
	console.log("Code to name 持久化成功。");
	querying = false;
    });	
}
input2();
   
var bodyParser = require('body-parser');
var multer = require('multer');

var pause = true, querying = false, permit = false;
var first="", second="", third="", fourth = "";

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: __dirname + "/temp/"}).array('code'));

function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

function getname(req) {
    var tmp = getClientIp(req);
    return name[tmp];
}

app.get('/', function(req, res) {
    var tmp = getClientIp(req);
    if (typeof(name[tmp]) == 'undefined') 
	res.sendFile(__dirname + "/login.html");
    else
	res.sendFile(__dirname + "/user.html");
});

app.get('/name', function(req, res) {
    var usr = getname(req);
    if (typeof(usr) == 'undefined') {
	res.end("nil");
	return;
    }
    res.end(usr);
});



app.post('/login', function(req, res) {
    var usr = getClientIp(req);
    if (typeof(name[usr]) != 'undefined') {
	console.log(usr + "has logined in.");
	res.end("success");
	return;
    }
    if (permit == false) {
	console.log(req.body.name + " wants to login but rejected.");
	res.end("close");
	return;
    }
    var value = req.body.name;
    if (value == "") {
	res.end("illegal");
        return;
    }
    if (value.indexOf(".") > -1 || value.indexOf("/") > -1  || value.indexOf("|") > -1  || value.indexOf("+") > -1) {
	res.end("illegal");
        return;
    }
    if (value[0] == " " || value[value.length - 1] == " ") {
	res.end("space");
	return;
    }
    if (value == "noip2017") {
	res.end("noip2017");
	return;
    }
    var num = req.body.num;
    if (typeof(code[num]) == 'undefined') {
	res.end("unknown");
	return;
    }
    if (req.body.name != code[num]) {
	res.end("uncop");
	return;
    }
    name[usr] = num;
    console.log("combine " + usr + " with " + num);
    res.end("success");
});

app.get('/pro.zip', function(req, res) {
    res.end("No way~");
	
});

app.get('user.html', function(req,res) {
    res.end("No way~");
});

app.get('admin.html', function(req, res) {
    res.end("No way~");
});

app.get('/files', function(req, res) {
    res.end("No way~");
});

app.get('/query', function(req, res) {
    var usr = getname(req);
    if (typeof(usr) == 'undefined') {
	console.log(req.body.name + "(" + getClientIp(req) +  ")" + " wants to query but has no name.");
	res.end("help");
	return;
    }
    var dir = __dirname + "/files/" + usr;
    fs.exists(dir, function(exists) {
	if (exists == false)
	    res.end("nil"); 
	else
	    fs.readdir(dir, function (err, files) {
		var str = "";
		for (var i = 0; i < files.length; ++i) {
		    if (files[i][0] == '.')
			continue;
		    str = str + files[i] + "|";
		}
		res.end(str);
	    });
    });  
});

app.get('/status', function(req, res) {
    res.end(pause ? "off" : "on");
});

app.get('/problem.zip', function(req, res) {
    if (pause) {
	    console.log("Someone wants to download the problemset but the server is pausing.");
	    res.end("");
    }
	    
    console.log("Someone downloads the problemset.");
    res.sendFile(__dirname + "/pro.zip");
});

app.post('/upload', function(req, res) {
    var usr = getname(req);
    if (typeof(usr) == 'undefined') {
	console.log(req.body.name + "(" + getClientIp(req) +  ")" + " wants to upload but has no name.");
	res.end("help");
	return;
    }
    if (pause) {
	console.log(usr + " wants to upload but the server is pausing");
	res.end("pause");
	return;
    }
    if (querying) {
	console.log(usr + " wants to upload but the server is querying.");
	res.end("query");
	return;
    }
    if (req.files.length == 0) {
	console.log(usr + " wants to upload but failed. (No file)");
	res.end("failed");
	return;
    }
    if (req.files[0].size > 1024 * 1024) {
	console.log(usr + " wants to upload a big file.");
	res.end("large");
	return;
    }
    var name = req.files[0].originalname;
    var type = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if (type != "cpp" && type != "c" && type != "pas") {
	console.log(usr + " wants to upload a illegal file.");
	res.end("illegal");
	return; 
    }
    var filename = name.substring(name.lastIndexOf("\\") + 1, name.lastIndexOf(".")).toLowerCase();
    if (filename != first && filename != second && filename != third && filename != fourth) {
	res.end("illegal");
	return;
    }
    
    var dir = __dirname + "/files/" + usr;
    fs.exists(dir, function(exists) {
	if (exists == false)
	    fs.mkdir(dir, 0777, function(err) {
		if (err) {
		    res.end("Failed to make dir." + usr + " Upload failed.");
		    return;
		}
		else
		    console.log(dir + " created");
	    });
	var file_dir = dir + "/" + name;
	fs.readFile(req.files[0].path, function(err, data) {
	    fs.writeFile(file_dir, data, function(err) {
		if (err) {
		    console.log("==>WARNING:  " + usr + " wants to upload " + name + " but failed."  );
		    res.end("failed");
		    return;
		}
		else {
		    console.log("Success:  " + usr + " uploaded " + name);
		    res.end("success|" + usr);
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

tool.get('/name', function(req, res) {
    var response = {
	"first": first,
	"second":second,
	"third": third,
	"fourth": fourth
    };
    res.end(JSON.stringify(response));
});

tool.get('/query', function(req, res) {
    querying = true;
    var root = __dirname + "/files";
    var response = {};
    fs.readdir(root, function (err, dirs) {
	var cnt = 0;
	for (var i = 0; i < dirs.length; ++i) {
	    var dir = root + "/" + dirs[i];
            var info = fs.statSync(dir);
	    if (info.isDirectory() == false)
		continue;
	    
	    var files = fs.readdirSync(dir);
	    
	    var val = "";
	    for (var j = 0; j < files.length; ++j) {
		var filename = files[j].substring(0, files[j].lastIndexOf("."));
		if (filename == first || filename == second || filename == third || filename == fourth)
		    val += files[j] + "|";
	    }
	    var temp = {
		name: dirs[i],
		file: val
	    };
	    response[cnt++] = temp;
	}
	console.log(response);
	res.end(JSON.stringify(response));
	querying = false;
    });
});

tool.post('/setname', urlencodedParser, function(req, res) {
    var response = {
	"first":req.body.first,
	"second":req.body.second,
	"third":req.body.third,
	"fourth":req.body.fourth
    };
    console.log("Name changed:");
    console.log(response);
    first = response.first;
    second = response.second;
    third = response.third;
    fourth = response.fourth;
    res.end("success");
});

tool.get('/packing', function(req, res) {
    if (querying)
	return;
    querying = true;
    console.log("Start packing!");
    var archiver = require('archiver');
    var output = fs.createWriteStream(__dirname + '/sources.zip');
    var archive = archiver('zip', {
	zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', function() {
	console.log(archive.pointer() + ' total bytes');
	console.log('End packing.');
	querying = false;
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

tool.post('/delete', function(req, res) {
    console.log(req.body.only);
    var files = [];
    var path = __dirname + "/files/" + req.body.only;
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index){
            var curPath = path + "/" + file;
	    fs.unlinkSync(curPath);
        });
        fs.rmdirSync(path);
    }
    console.log("Catalog " + path + " deleted");
    res.end("success");
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

tool.get('/permit', function(req, res) {
    permit = !permit;
    console.log(permit ? "允许新建用户" : "拒绝新建用户");
    res.end(permit ? "on" : "off");
});

tool.get('/writedown', function(req, res) {
    console.log("开始持久化: 写出文件");
    var result = [], cnt = 0;
    for (var i in name) {
	console.log(i);
	var temp = {
	    ip: i,
	    name: name[i]
	};
	result[cnt++] = temp;
    }
    var str = JSON.stringify(result);
    fs.writeFile(__dirname + "/ip.json", str, function(error) {
	if (error) {
	    res.end("failed");
	    console.log("持久化失败，写入文件时发生错误");
	    return;
	}
	res.end("success");
	console.log("持久化成功");
    });
});

tool.get('/rd', function(req, res) {
    input();
    res.end("success");
});
