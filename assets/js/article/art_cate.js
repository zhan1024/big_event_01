$(function () {
    // 1.渲染文章分类列表(后面添加，删除，修改还要范霍夫调用，封装成函数)
    let layer = layui.layer;
    initArtCateList();

    // 函数封装
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                // 状态判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 获取不用弹窗，直接展示;
                //  传递的是对象，遍历的对象上面的属性
                let htmlStr = template("tpl-art-cate", { data: res.data });
                $("tbody").html(htmlStr)
            }
        })
    }

    // 2.添加文章分类 html结构
    let indexAdd = null;
    $("#btnAdd").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    })


    // 3.用事件代理完成 添加文章分类
    // 事件委托
    $("body").on("submit", "#form-add", function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 清空form，重构文章分类列表，关闭对话框
                $("#form-add")[0].reset();
                initArtCateList();
                layer.close(indexAdd);
                layer.msg("恭喜您，添加文章分类成功！")
            }
        })
    })

    // 4.修改文章分类 html结构 （事件代理）
    let indexEdit = null;
    let form = layui.form;
    $("tbody").on("click", ".btn-edit", function () {
        // 4.1 显示修改的 form
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });
        // 4.2 发送ajax，把数据渲染到 form
        let Id = $(this).attr("data-id");
        // 发送ajax，把数据渲染到 form 中
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染
                form.val("form-edit", res.data);
            }
        })

    });

    // 5.用事件代理完成 修改文章分类
    $("body").on("submit", "#form-edit", function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 清空form，重构文章分类列表，关闭对话框
                $("#form-edit")[0].reset();
                initArtCateList();
                layer.close(indexEdit);
                layer.msg("恭喜您，修改文章分类成功！")
            }
        })
    });

    // 6.删除
    $("tbody").on("click", ".btn-delete", function () {
        // 获取Id不能写到 弹出框里面，this改变了
        let Id = $(this).attr("data-id");
        // 弹出提示框
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            // 发送ajax
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 提示，关闭对话框，重新渲染数据
                    layer.msg("恭喜您，删除文章分类成功！")
                    layer.close(index);
                    initArtCateList();
                }
            })
        });
    });

})