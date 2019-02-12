class Layer {
    loading(msg) {
        if (wx.showLoading) {
            wx.showLoading({
                title: msg ? msg : '加载中...',
                mask: true
            })
        } else {
            wx.showToast({
                title: msg ? msg : "加载中",
                icon: 'loading',
                duration: 2000
            })
        }
    }

    success(msg) {
        //暂未使用
        //因为android能正常使用，ios 不起作用
        var systemInfo = wx.getStorageSync("systemInfo")
        if (systemInfo.platform != "ios") {
            wx.showToast({
                title: msg ? msg : "成功",
                icon: "success",
                duration: 2000
            })
        } else {
            wx.showModal({
                title: "",
                content: msg ? msg : "成功",
                showCancel: false
            })
        }
    }
    error(msg) {
        wx.showModal({
            title: "",
            content: msg ? msg : "错误",
            showCancel: false
        })
    }
    close() {
            if (wx.hideLoading) {
                wx.hideLoading();
            }
        }
        //有取消和确定键,del true为有取消键，没有则有取消键
    confirm(msg, del) {

        const self = this;
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: '',
                content: msg,
                showCancel: del,
                success: function(res) {
                    if (res.confirm) {
                        resolve.call(self, res)
                    } else {
                        if (del) {
                            reject()
                        }
                    }
                },
                fail: function() {
                    reject()
                }
            })
        })
    }


}
export default Layer