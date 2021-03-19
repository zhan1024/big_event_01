$(function () {
    let layer = layui.layer
    let form = layui.form;

    function initForm() {
        let id = location.search.split("=")[1];
        $.ajax({
            type: 'get',
            url: '/my/article/' + id,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //渲染到form表单中
                form.val("form-edit", res.data)
                // ***.tinymce赋值 百度
                tinyMCE.activeEditor.setContent(res.data.content);
                // ***.图片
                if (!res.data.cover_img) {
                    return layer.msg("用户未曾上传头像!")
                }
                let newImgURL = baseURL + res.data.cover_img;
                // 为裁剪区域重新设置图片
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', newImgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })
    }

    //初始化文章分类
    initCate();
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //赋值,渲染form
                let htmlStr = template("tpl-cate", { data: res.data });
                $("[name=cate_id]").html(htmlStr)
                form.render()
                initForm();
            }

        })
    }

    //2,初始化富文本编辑器
    initEditor()
    //3初始化图片裁剪器

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }


    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击按钮,选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 5.设置图片
    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === undefined) {
            return layer.msg("请选择一张图片")
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 6.参数状态值处理
    let state = "已发布";
    // $("#btnSave1").on("click", function () {
    //     state = "已发布";
    // })
    $("#btnSave2").on("click", function () {
        state = "草稿";
    })

    // 7.发布文章
    $("#form-edit").on("submit", function (e) {
        e.preventDefault();
        // 发布文章是上传文件操作，要使用 FormData 类型的数据
        let fd = new FormData(this);
        // 以有三个，在添加一个
        fd.append("state", state);
        // 还剩最后一个属性
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append("cover_img", blob);
            // console.log(...fd);
            // 封装发布文章的ajax
            publishArticle(fd);
        });
    });


    // 封装
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 两个false
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功：提示，页面跳转
                layer.msg("恭喜您，修改文章成功！")
                // location.href = '/article/art_list.html';
                setTimeout(function () {
                    window.parent.document.querySelector("#art_list").click();
                }, 1000);
            }
        })
    }











})