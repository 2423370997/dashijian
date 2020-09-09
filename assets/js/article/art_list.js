$(function () {
    var layer = layui.layer
    var form = layui.form
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 1, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    // 初始时获取文章列表
    initTable()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderpage(res.total)
            }
        })
    }
    // 时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initcate()
    // 获取所有类别下拉选项
    function initcate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("")
                }
                var htmlstr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlstr)
                form.render()
            }
        })
    }
    // 筛选
    $(".layui-btn").on("submit", function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })
    var laypage = layui.laypage
    // 页码部分
    function renderpage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            curr: q.pagenum,
            limit: q.pagesize,
            limits: [1, 2, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 删除
    $('body').on('click', '.btn-del', function () {
        var length = $(".btn-del").length
        var id = $(this).attr('data-id')
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败")
                    }
                    layer.msg("删除成功")
                    if (length==1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        initTable()
                    }
                }
            })

            layer.close(index);
        });

    })

})