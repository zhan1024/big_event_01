$(function () {
    //1.渲染文章分类列表(后面添加,删除,修改还要)
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',

            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //获取不用弹窗,直接展示
                //传递的是对象,遍历的是对象上的属性
                template()
            }
        })
    }
})