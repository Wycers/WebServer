function check(target) {
    if (target.files.length == 0)
	return false;

    var name = target.value;
    var type = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if (type != "zip") {
	alert("请上传*.zip");
	target.value = "";
	return false; 
    }

    var filename = name.substring(name.lastIndexOf("\\") + 1, name.length).toLowerCase();
    $("#show").val(filename);
    
    return true;
}

function QvQ() {
    $("#board").html("<li>正在打包，请稍候。</li>");
    $.get("/packing", function(data, status) {
	if (data == "success")
            $("#board").html("<a href=\"/sources.zip\" download=\"sources.zip\">Download link</a>");  
    });
}

function Querystatus() {
    $.get("/status", function(data, status) {
	if (data == "on") {
	    $("#status").html("当前：允许上传和下载");
	    $("#status").addClass("uk-icon-unlock-alt");
	    $("#status").removeClass("uk-icon-lock");
	}
	else if (data == "off") {
	    $("#status").html("当前：拒绝上传和下载");
	    $("#status").removeClass("uk-icon-unlock-alt");
	    $("#status").addClass("uk-icon-lock");
	}
    });
}

function Querypermit() {
    $.get("/permit", function(data, status) {
	if (data == "on") {
	    $("#permit").html("当前：允许新建用户");
	    $("#permit").addClass("uk-icon-unlock-alt");
	    $("#permit").removeClass("uk-icon-lock");
	}
	else if (data == "off") {
	    $("#permit").html("当前：拒绝新建用户");
	    $("#permit").removeClass("uk-icon-unlock-alt");
	    $("#permit").addClass("uk-icon-lock");
	}
    });
}


function Runfast() {
    $("#form_file").ajaxSubmit(function(message) {
	if (message == "success") 
	    alert("上传成功");
	else
	    alert("上传失败");
    });
    return false; 
}

function GetJsonData() {
    var json = {
	first: $("#first").val(),
	second: $("#second").val(),
	third: $("#third").val()
    };
    console.log(json);
    return json;
}
function Setname() {
    $.ajax({
        type: "POST",
        url: "/setname",
        data: GetJsonData(),
        success: function (message) {
            UIkit.notify("<i class='uk-icon-check'></i>文件名修改成功！", {status:'success'});
        },
        error: function (message) {
            UIkit.notify("文件名修改失败。", {status:'danger'});
        }
    });
    return false;
}
function Getname() {
    $.get('/name', function(data, status) {
	if (status == "success") {
	    var json = JSON.parse(data);
	    $("#first").val(json.first);
	    $("#second").val(json.second);
	    $("#third").val(json.third);
	}
	else {
	    UIkit.notify("文件名查询失败。", {status:'danger'});
	}
    });
}

function View() {
    $.get('/query', function(data, status) {
	if (status == "success") {
	    var json = JSON.parse(data);
            $("#tbody").html("");
            for (var i in json) {
		console.log(json[i]);
		$("#tbody").append("<tr id=\"" + i + "\"></tr");
		$("#" + i).append("<td>" + i + "</td>");
		$("#" + i).append("<td>" + json[i].name + "</td>");
		var file = json[i].file;
		file = file.substring(0, file.length - 1);
		$("#" + i).append("<td>" + file + "</td>");
		$("#" + i).append("<td><button id='delete' value='" + json[i].name + "'>删除</button></td>");
	    }
	    $(document).on('click', '#delete', function(data) {
		$.ajax({
		    type: "POST",
		    url: "/delete",
		    data: {
			only: data.target.value
		    },
		    success: function (message) {
			UIkit.notify("<i class='uk-icon-check'></i>删除成功！", {status:'success'});
		    },
		    error: function (message) {
			UIkit.notify("删除失败。", {status:'danger'});
		    }
		});
	    });
	}
    });
    
}

function writedown() {
    $.get('/writedown', function(data, status) {
	if (data == "success")
	    alert("持久化成功！");
	else
	    alert("持久化失败！");
    });
}

function read() {
    $.get('/rd', function(data, status) {
	if (data == "success")
	    alert("持久化成功");
	else
	    alert("持久化失败");
    });
}

$(document).ready(function(){
    Getname();
    $("#button").click(QvQ);
    $("#status").click(Querystatus);
    $("#view").click(View);
    $("#permit").click(Querypermit);
    $("#wd").click(writedown);
    $("#rd").click(read);
});
