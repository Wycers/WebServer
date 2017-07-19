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


function Runfast() {
    $("#form").ajaxSubmit(function(message) {
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
            if (message > 0) {
                alert("请求已提交！我们会尽快与您取得联系");
            }
        },
        error: function (message) {
            $("#request-process-patent").html("提交数据失败！");
        }
    });
    return false;
}

$(document).ready(function(){
    $("#button").click(QvQ);
    $("#status").click(Querystatus);
});
