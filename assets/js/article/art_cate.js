$(function () {
    var layer = layui.layer
    var form = layui.form
    artgetlist()
    function artgetlist() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                var htmlstr = template("tpl-table", res)
                $('tbody').html(htmlstr)
            }
        })
    }
    var indexadd = null
    $("#btngetart").on("click", function () {
        indexadd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '添加类别',
            content: $('#tpl-article').html()
        })
    })
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("添加失败")
                }
                artgetlist()
                layer.msg("添加成功")
                layer.close(indexadd)
            }
        })
    })
    var indexEdit = null
    $("body").on("click", ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("修改失败")
                }
                artgetlist()
                layer.msg("修改成功")
                layer.close(indexEdit)
            }
        })
    })
    $("body").on("click", ".btn-del", function () {
        var id = $(this).attr("data-id")
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    artgetlist()
                    layer.msg('删除分类成功！')
                    layer.close(index)

                }
            })
        })
    })

})