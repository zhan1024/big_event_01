$(function () {
    //初始化分类
    let form = layui.form;
    let layer = layui.layer;
    // 调用函数

    initCate();
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',

            success: (res) => {
                //校验
                if (res.status != 0) {
                    return layer.msg(res.message);
                }

                //赋值,渲染form
                let htmlStr = template('tpl-cate', { data: res.data })
                $("[name=cate_id").html(htmlStr);
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 3.1
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 4. 点击按钮,选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 5,监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length == 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //6.参数状态值处理
    let state = '已发布';

    $('#btnSave2').on('click', function () {
        state = '草稿'
    })


    // 7,发布文章
    $("#form-pub").on("submit", function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        //创建formdata对象,收集数据
        var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', state);




        // 4. 将封面裁剪过后的图片，输出为一个文件对象

        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                // console.log(...fd);
                publishArticle(fd);
            })


    })


    //封装,添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }

                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.querySelector('#pub_list').click()
                }, 1500)

            }
        })
    }



})