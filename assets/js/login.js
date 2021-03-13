$(function () {
    //点击去注册账号,隐藏登陆区域,显示注册区域
    $("#link_reg").on('click', () => {
        $(".login-box").hide()
        $('.reg-box').show();
    })
    //2.点击去登陆,显示登陆区域,隐藏注册区域
    $("#link_login").on('click', () => {
        $(".login-box").show();
        $(".reg-box").hide();
    })
    // 3.自定义验证规则
    var form = layui.form;
    form.verify({
        //密码规则
        pwd: [
            /^[\S]{6,16}$/,
            '密码必须6到16位，且不能出现空格'
        ],

        //确认密码规则
        repwd: function (value) {
            //选择器必须带空格.选择器的后代中额input name属性值
            var pwd = $(".reg-box input[name=password]").val();
            //比较
            // console.log(pwd);
            if (value != pwd) {
                return '两次密码输入不一致'
            }
        }

    });



    //注册功能
    var layer = layui.layer;
    $("#form_reg").on("submit", function (e) {
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'post',
            url: 'http://api-breakingnews-web.itheima.net/api/reguser',
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val(),
            },
            success: (res) => {
                // console.log(res);
                //返回状态判断
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                //提交成功后处理
                alert(res.message, { icon: 6 });
                // layer.msg("注册成功,请登录!");
                //手动切换到登录表单
                $("#link_login").click();
                //重置form表单
                // 原生DOM方法
                $("#form_reg")[0].reset();
            }
        })
    })
    $("#form_login").on('submit', function (e) {
        e.preventDefault();
        console.log($("#form_login").serialize());
        $.ajax({
            type: 'post',
            // url: 'http://api-breakingnews-web.itheima.net/api/login',
            url: "/api/login",
            data: $("#form_login").serialize(),
            success: (res) => {
                console.log(res);
                // 登陆失败
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });

                }
                location.href = "/index.html"
                localStorage.setItem('token', res.token);
            }
        })
    })








})