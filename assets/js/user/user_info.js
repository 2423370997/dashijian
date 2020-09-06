$(function () {
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) { return '昵称长度必须在 1 ~ 6 个字符之间！' }
        }
    })
})
initUserInfo()
var form = layui.form
var layer = layui.layer
function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) { return layer.msg('获取用户信息失败！') }
            form.val("formUserInfo", res.data)
        }
    })
}
$(".layui-form").on('submit', function (e) {
    e.preventDefault()
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg("修改信息成功")
            window.parent.getinfo()
        }
    })
})