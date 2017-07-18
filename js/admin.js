function QvQ() {
    $("#board").html("<li>正在打包，请稍候。</li>");
    $.get("/packing", function(data, status) {
	if (data == "success")
            $("#board").html("<a href=\"/sources.zip\" download=\"sources.zip\">Download link</a>");
	else if (data == "packing")
	    alert("工作进行中。");
    });
}

function Runfast() {
	if ($("#input").val() == "")
		return false;
    $("#form").ajaxSubmit(function(message) {
	if (message == "success") 
		alert("上传成功");
	else
	    alert("上传失败");
    });
    return false; 
}

$(document).ready(function(){
    $("#button").click(QvQ);
});
