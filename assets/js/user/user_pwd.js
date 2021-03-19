$(function () {
    //1定义密码规则
    let form = layui.form

    form.verify({
        //密码
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6-12位,且不能位空格'
        ],
        //新密码(不能和原密码相同)
        samePwd: function (value) {
            //value是新密码,旧密码需要获取
            if (value == $('[name=oldPwd]').val()) {
                return "原密码不能和旧密码相同!";

            }
        },
        //1.3;两次新密码必须相同
        rePwd: function (value) {
            //value是再次输入的西密码,新密码需要重新获取
            if (value != $("[name=newPwd]").val()) {
                return "两次新密码输入不一样"
            }
        }


    })

    //2.表单提交
    $(".layui-form").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg("修改密码成功!")
                $(".layui-form")[0].reset()
            }
        })

    })


})