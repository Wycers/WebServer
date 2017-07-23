function Submit() {
    $("#form").ajaxSubmit(function(message) {
	if (message == "success") {
	    window.location.reload(true);
	}
	else if (message == "close")
	    alert("服务器关闭了登陆通道。请联系老师。");
	else
	    alert("登录失败，请联系老师。");
    });
    return false;
}
