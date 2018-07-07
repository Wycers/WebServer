function Submit() {
    $("#form").ajaxSubmit(function(message) {
	if (message == "success") {
	    window.location.reload(true);
	}
	else if (message == "unknown")
	    alert("未知选手，请联系老师。");
	else if (message == "uncop")
	    alert("准考证号与名字不对应。");
	else if (message == "close")
	    alert("服务器关闭了登陆通道。请联系老师。");
	else if (message == "illegal")
	    alert("名字不合法，请重新输入。");
	else if (message == "noip2017")
	    alert("不要再输入noip2017了！！");
	else if (message == "space")
	    alert("请删除首尾空格");
	else
	    alert("登录失败，请联系老师。");
    });
    return false;
}
