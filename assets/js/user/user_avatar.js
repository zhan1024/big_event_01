$(window).on('load', function () {



    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 2.选择文件
    $("#btnChooseImage").on('click', function () {
        $("#file").click()
    })


    // 需求关系




    // 3选择change事件
    let layer = layui.layer;
    $("#file").on("change", function (e) {
        // e.preventDault()
        let file = e.target.files[0];
        // let newImgURL= URL.createObjectURL(file);

        //销毁原有图片,设置新路径,
        if (file == undefined) {
            return layer.msg("请选择图片!")

        }
        //3.2根据选择的文件,创建一个对应的URL地址
        let newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')
            .attr('src', newImgURL)
            .cropper(options)

    })

    // 4.上传头像
    $("#btnUpload").on("click", function () {
        let dataURL = $image

            .cropper('getCroppedCanvas', {
                width: 100,
                height: 100,
            })
            .toDataURL('image/png')
        // console.log(dataURL);
        // console.log(typeof dataURL);
        //发送ajax
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('更换头像失败!')
                }
                layer.msg('更换头像成功!')
                window.parent.getUserInfo()

            }

        })
    })
})