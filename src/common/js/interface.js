class Interface {
    /**
     *登录接口
     *
     * @memberof Interface
     * flag先登录后判断是否可以收礼
     */
    login(code, userInfo, self, callback) {
        let data = {
            code: code,
            encryptedData: userInfo ? userInfo.encryptedData : '',
            iv: userInfo ? userInfo.iv : '',
            invite: wx.getStorageSync("invite_id") ? wx.getStorageSync("invite_id") : (wx.getStorageSync("invite_goodsId") ? wx.getStorageSync("invite_goodsId") : 0)
        }
        this.request(false, 'GET', 'Oauth/login', data).then((res) => {
            if (res.data.code == 1) {
                wx.setStorageSync('user_info', res.data.data)
                if (self) {
                    self.userInfo = res.data.data;
                    this.getPersonInfo(self)
                    self.$apply();
                }

                if (callback) {
                    callback(self, self.code);
                }
            } else {
                this.error(res.data.msg)
            }
        })
    }
    

}
export default Interface