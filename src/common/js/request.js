import wepy from 'wepy';
class Request {
    //json转map
    _objToStrMap(obj) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }
    request(load, methods, url, data) {
        const self = this;
        url = this.baseUrl + url;
        if (data) {
            let sign = self.encryption(this._objToStrMap(data))
            data = Object.assign(data, {
                sign: sign
            })
        }
        if (load) {
            this.loading();
        }
        return new Promise((resolve, reject) => {
            wepy.request({
                url: url,
                data: data ? data : {},
                method: methods, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                    'token': wx.getStorageSync('user_info').access_token
                }, // 设置请求的 header
                success: function(res) {
                    if (load) {
                        self.close();
                    }
                    if (res.data.code == 407) {
                        self.wxLogin(self, self.request(load, methods, url, data));
                        return
                    } else {
                        resolve.call(self, res)
                    }

                },
                fail(err) {
                    self.close();
                    reject()
                }
            })
        })
    }
}
export default Request