$(function () {
    initPub()
    initEditor()
    var form = layui.form
    function initPub() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return
                }
                var htmlstr = template('tpl-pub', res)
                $("[name=cate_id]").html(htmlstr)
                form.render()
            }
        })
    }
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnfile').on('click', function () {
        $('#iptfile').click()
    })
    $("#iptfile").on('change', function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = '已发布'
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', {
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
                publishArticle(fd)

            })
    })
    var layer = layui.layer
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('上传失败')
                }
                layer.msg('上传成功')
                location.href = 'art_list.html'
            }
        })
    }


})