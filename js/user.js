function check(target) {
    if (target.files.length == 0)
	return false;
    fileSize = target.files[0].size; 
    if (fileSize > 1024 * 1024) {
	alert("文件大小超过1MB！");
	target.value = "";
	return false;
    }
    var name = target.files[0].originalname;
    var filename = name.substring(name.lastIndexOf("\\") + 1, name.length).toLowerCase();
    $("#show").val(filename);
    
    return true;
}

function QvQ() {
    var value = $("#name").val();
    if (value.indexOf(".") > -1 || value.indexOf("/") > -1  || value.indexOf("|") > -1  || value.indexOf("+") > -1) {
	$("#name").val("");
        $("#list").html("<li>请勿输入特殊字符。</li>");
        return;
    }
    if ($("#name").val() == "") {
        $("#list").html("<li>请勿留空。</li>");
        return;
    }
    $.get("/query?usr=" + $("#name").val(), function(data, status) {
        if (data == "nil") 
            $("#list").html("<li>该目录不存在。（目录将在上传文件时自动生成）</li>");
        else if (data == "")
            $("#list").html("<li>该目录下没有文件。</li>");
        else {
            var str = new Array();
            str = data.split("|");
            $("#list").html("");
            for (var i = 0; i < str.length ;i++ )
		if (str[i] != "")
                    $("#list").append("<li>" + str[i] + "</li>");
        }
    });
}

function Runfast() {
    $("#form").ajaxSubmit(function(message) {
	if (message == "success") {
	    alert("上传成功");
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
	    window.location.href = '/download';
    });
}

$(document).ready(function(){
    $("#button").click(QvQ);
    $("#download").click(download);
});
