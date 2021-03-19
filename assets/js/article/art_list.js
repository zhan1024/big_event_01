$(function () {
    // 2. 向模板引擎中导入 变量/函数
    template.defaults.imports.dateFormat = function (dateStr) {
        let dt = new Date(dateStr);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
    function padZero(num) {
        return num < 10 ? "0" + num : num
    }

    // 文章列表和筛选和分页都要用到参数，所以提升为全局的
    let q = {
        pagenum: 1,   // 是	int	    页码值
        pagesize: 3,	// 是	int	    每页显示多少条数据
        cate_id: "",   // 否	string	文章分类的 Id
        state: "",   // 否	string	文章的状态，可选值有：已发布、草稿
    }


    // 1.初始化文章列表（后面还要用，封装成函数）
    let layer = layui.layer;
    initTable();
    // 封装
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 渲染到页面上
                console.log(res);
                let htmlStr = template("tpl-table", { data: res.data })
                $("tbody").html(htmlStr);
                // 文章列表初始化完毕做分页
                renderPage(res.total);
            }
        })
    }

    // 3.初始化文章分类
    let form = layui.form;
    initCate();
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 渲染
                let htmlStr = template("tpl-cate", { data: res.data })
                $("[name=cate_id]").html(htmlStr);
                // 对于 select 标签，赋值之后我们需要重新渲染
                // 单选 多选 下拉 赋值之后 需要重新渲染
                form.render();
            }
        })
    }

    // 4.筛选
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        // 获取
        let cate_id = $("[name=cate_id]").val();
        let state = $("[name=state]").val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 再次渲染文章列表
        initTable();
    })

    // 5.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', // 注意，这里的 test1 是 ID，不用加 # 号
            count: total, // 数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条
            curr: q.pagenum, // 初始化页面
            // 自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            limits: [2, 3, 5, 10],
            // 页面切换触发这个方法
            jump: function (obj, first) {
                // console.log(obj)
                // console.log(first)
                if (!first) {
                    // do something
                    // alert(obj.curr) 页码之赋值给q中的pagenum
                    q.pagenum = obj.curr;
                    // 每页显示多少条数，重新赋值
                    q.pagesize = obj.limit;
                    // 重新渲染页面
                    initTable();
                }
            }
        });
    }

    // 6.删除
    $("tbody").on("click", ".btn-delete", function () {
        let Id = $(this).attr("data-id");
        // 询问
        //eg1
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            // ajax
            $.ajax({
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    // 成功：提示，更新页面数据
                    layer.msg("恭喜您，删除文章成功！");
                    // 如果页面只剩最后一个元素了，当前页码还要大于1，当前页码减一
                    if ($(".btn-delete").length === 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    initTable();
                    layer.close(index);
                }
            })
        });
    })


})