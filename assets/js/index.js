//入口函数
$(function () {
    //获取用于信息
    getUserInfo();

});
//退出
let layer = layui.layer;
$("#btnLogout").on('click', function () {
    // 框架提供的询问框
    layer.confirm('是否确认退出', { icon: 3, title: '提示' }, function (index) {
        //do something
        // 1.清空本地token
        localStorage.removeItem('token')
        //页面跳转
        location.href = "login.html"
        // 关闭询问框
        layer.close(index);
    });
})


//获取用于信息(封装到入口函数的外面了)
//原因,后面其他的页面要调用
function getUserInfo() {
    //发送ajax
    $.ajax({
        //   type:'',
        url: '/my/userinfo',

        // // 配置头信息,设置token,身份识别认证!
        // headers: {
        //     //重新登录:因为token过期事件12小时
        //     Authorization: localStorage.getItem("token") || ""
        // },

        success: (res) => {
            // console.log(res);
            if (res.status != 0) {
                return layui.layer.msg(res.message, { icon: 5 })
            }
            // 头像和文字渲染
            renderAvatar(res.data);
        },
        //无论成功还是失败,都会执行complete
        // complete:function (res) {
        //console.log();
        //  }
    })

}
//头像和文字渲染封装
function renderAvatar(user) {
    // console.log(user);
    // 渲染用户名,如果有昵称以昵称为准
    let name = user.nickname || user.username;
    $("#welcome").html('欢迎&nbsp;&nbsp' + name);
    //渲染头像,判断图片头像是否存在
    if (user.user_pic === null) {
        //隐藏图片头像,渲染文字头像
        $(".layui-nav-img").hide()
        $(".text-avatar").show().html(name[0].toUpperCase());
    } else {
        //渲染图片头像,隐藏文字头像
        $(".layui-nav-img").show().attr('src', user.user_pic);
        $('text-avatar').hide();
    }
}