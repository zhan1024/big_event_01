// $.ajaxPrefilter()可以在调用$.get() $.post() $.ajax()方法之后,立即触发
//接收到ajax响应以后,也会触发这个方法



//开发环境服务器路径地址
let baseURL = 'http://api-breakingnews-web.itheima.net';
//测试环境服务器路径地址
//let baseURL ='http://api-breakingnews-web.itheima.net';
//生产环境服务器路径地址
// let baseURL = 'http://api-breakingnews-web.itheima.net';


$.ajaxPrefilter(function (options) {
    //如果是index.html页面,不需要添加前缀
    if (options.url === 'http://127.0.0.1:5500/index.html') {
        return;
    }
    // console.log(options); 得到的是一个对象
    options.url = baseURL + options.url
    // 2.身份认证
    if (options.url.indexOf('/my/' != -1)) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ''
        }
    }

    //3.拦截所有响应,判断身份认证信息系
    options.complete = function (res) {
        console.log(res.responseJSON)
        let obj = res.responseJSON;
        if (obj.status == 1 && obj.message == '身份认证失败！') {
            //清空本地token
            localStorage.removeItem('token');
            //页面跳转
            location.href = "/login.html"
        }
    }



})
