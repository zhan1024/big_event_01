$(function () {
    //自定义验证规则
    let form = layui.form;
    form.verify({
        nickname: function (value) { //value：表单的值、item：表单的DOM对象
            if (value.trim().length > 6 || value.trim().length < 1) {
                return "昵称长度为2~6之间!"
            }
        }
    });




    // 展示用户信息(后面这个功能还要用,所以封装成函数)
    let layer = layui.layer;
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: "get",
            url: '/my/userinfo',
            success: (res) => {
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                // console.log(res);
                // 成功后渲染用户信息
                form.val("formUserInfo", res.data);
            }
        })
    }





    //3.重置
    $("#btnReset").on('click', function (e) {
        e.preventDefault()
        //用上面的用户渲染方式实现
        initUserInfo();
    })

    // 4.修改用户信息
    $("form").on('submit', function (e) {
        e.preventDefault();
        //发送ajax
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败！')
                }
                layer.msg("恭喜您,修改成功")
                // 因为本页面没有iframe,所以加window.parent,进行调用
                // 此处的window指的是user_info_html
                // 通过本页面window找父页面window上面的window上面挂载的全局函数

                window.parent.getUserInfo()
            }

        })
    })



})