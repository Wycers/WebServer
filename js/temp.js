function check(target) {
    fileSize = target.files[0].size; 
    if (fileSize > 1024 * 1024) {
	alert("文件大小超过1MB！");
	target.value = "";
	return false;
    }

    var name = target.value;
    var type = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
    if (type != "cpp" && type != "c" && type != "pas") {
	alert("请上传*.cpp/*.c/*.pas！");
	target.value = "";
	return false; 
    }

    var filename = name.substring(name.lastIndexOf("\\") + 1, name.indexOf(".")).toLowerCase();
    if (filename != "workteam" && filename != "" && filename != "") {
	alert("请按照题目规定的文件名上传！");
	target.value = "";
	return false;	
    }
    $("#show").val(filename + "." + type);
    
    return true;
}

function QvQ() {
    if ($("#name").val().indexOf(".") > -1 || $("#name").val().indexOf("/") > -1) {
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
                $("#list").append("<li>" + str[i] + "</li>");
        }
    });
}

function Runfast() {
    if ($("#input").val() == "")
	return false;
    $("#form").ajaxSubmit(function(message) {
	if (message == "success") {
	    alert("上传成功");
	    QvQ();
	}
	else if (message == "packing")
	    alert("正在进行代码拷贝工作，暂停上传，请稍候。");
	else
	    alert("上传失败");
    });
    $("#show").val("");
    $("#input").val("");
    return false; 
}

$(document).ready(function(){
    $("#button").click(QvQ);
});
