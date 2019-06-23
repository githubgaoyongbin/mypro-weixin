export default {
    methods: {
        // 收货地址的api
        chooseAddress() {
            wx.chooseAddress({
                // 用户同意授权后 并且选中了地址
                success: res => {
                    // 给返回来的结果再添加一个详细的地址 方便之后存储到本地的时候调用
                    res.detailAddres = `${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}`
                    //给address赋值
                    this.address = res
                    // 保存到本地
                    wx.setStorageSync('address', res)
                },
                //用户拒绝或者用户同意了,但是没有选择地址 同意来到到这个函数
                fail: ({ errMsg }) => {
                    // 确定是获取授权成功后但是取消了的话
                    if (errMsg === 'chooseAddress:fail auth deny') {
                        //  调用微信官方显示提示信息
                        wx.showModal({
                            title: '提示', //提示的标题,
                            content: '请去我的页面打开授权选择收货地址', //提示的内容,
                            showCancel: false, //是否显示取消按钮,
                            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                            confirmColor: '#3CC51F', //确定按钮的文字颜色,
                            success: res => {
                                if (res.confirm) {
                                    wx.switchTab({ url: '/pages/my/main' });
                                }
                            }
                        });
                    }
                }
            })
        },
    },

}