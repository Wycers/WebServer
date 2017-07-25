function check(target) {
    var name = target.value;
    var filename = name.substring(name.lastIndexOf("\\") + 1, name.length).toLowerCase();
    $("#show").val(filename);
    return true;
}

function QvQ() {
    $.get("/query", function(data, status) {
        if (data == "nil") {
	    $("#files").show();
	    $("#files").html("没有该目录，目录将自动生成。");
	}
        else if (data == "") {
	    $("#files").show();
	    $("#files").html("没有文件");
	}
        else {
	    var str = new Array();
            str = data.split("|");
	    var sth = "";
	    for (var i = 0; i < str.length - 2; ++i) {
		sth = sth + str[i] + ", ";
	    }
	    sth = sth + str[str.length - 2];
	    $("#files").html(sth);
	    
        }
    });
}

function Runfast() {
    $("#form").ajaxSubmit(function(message) {
	if (message.substring(0, 7) == "success") {
	    alert("上传成功，您的文件保存在" + message.substring(8, message.length) + "目录下。");
	    if ($("#name").val() != message.substring(8, message.length)) {
		alert("已经将您的名字更新= =");
		$("#name").val(message.substring(8, message.length));
	    }
	    QvQ();
	}
	else if (message == "query")
	    alert("正在进行代码检查工作，暂停上传，请稍候。");
	else if (message == "illegal")
	    alert("文件名不合法，请按照题目规定的文件名上传。");
	else if (message == "packing")
	    alert("正在进行代码拷贝工作，暂停上传，请稍候。");
	else if (message == "pause")
	    alert("服务器停止了上传和下载。");
	else if (message == "help")
	    alert("服务器拒绝了您的请求，请联系机房老师。");
	else if (message == "large")
	    alert("文件大小超过1MB!");
	else
	    alert("上传失败");
    });
    $("#show").val("");
    $("#input").val("");
    return false; 
}

function download() {
    $.get("/status", function(data, status) {
	if (data == "off")
	    alert("服务器停止了上传和下载。");
	else if (data == "on")
	    window.location.href = '/problem.zip';
    });
}

$(document).ready(function(){
    $("#button").click(QvQ);
    $("#download").click(download);

    $.get("/name", function(data, status) {
	if (status == "success") {
	    if (data == "nil")
		alert("无法提供服务，请联系机房老师。");
	    else {
		$("#name").val(data);
		QvQ();
	    }
	}
	else
	    alert("无法提供服务，请联系机房老师。");
    });
});
