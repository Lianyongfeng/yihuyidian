import wepy from 'wepy';
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext()
class WxAPI {
    wxLogin(that, userInfo, callback) {
        //flag控制先登录，然后判断是否可以收礼
        const self = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    self.login(res.code, userInfo, that, callback)
                }
            },
            fail: function () { }
        })
    }
    //检查登录态
    checkSession() {
        const self = this;
        wx.checkSession({
            success: function () {

            },
            fail: function () {
                self.wxLogin() //重新登录
            }
        })
    }
    //获取图片信息
    getImageInfo() {
        const self = this;
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: src, //图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径
                success: function (res) {
                    resolve.call(self, res)
                },
                fail: function (err) {
                    reject.call(err);
                }
            })
        });
    }
    //4.0 调用拨打电话
    makePhoneCall(mobile) {
        wx.makePhoneCall({
            phoneNumber: mobile,
            success: function () { },
            fail: function () { }
        })
    }
    //5.0 调起预览图片接口
    previewImage(images, current) {
        wx.previewImage({
            current: current,
            urls: images
        })
    }
    //6.0 调起微信内置地图查看位置
    openLocation(lat, lng, name, address, scale) {
        const self = this;
        return new Promise((resolve, reject) => {
            wx.openLocation({
                latitude: lat,
                longitude: lng,
                name: name,
                address: address,
                scale: scale ? scale : 28,
                success: function (res) {
                    resolve.call(self, res)
                },
                fail: function (res) {
                    reject.call(err);
                },
            })
        })
    }
    //7.0 调起微信选择位置的视图，需要用户授权获取地理位置
    chooseLocation() {
        const self = this;
        return new Promise((resolve, reject) => {
            wx.chooseLocation({
                success: function (res) {
                    resolve.call(self, res)
                },
                fail: function (res) {
                    reject.call();
                },
                complete: function (res) {
                    // complete
                }
            })
        })
    }
    //8.0 选择图片
    chooseImages(count) {
        const self = this;
        return new Promise((resolve, reject) => {
            wx.chooseImage({
                count: count ? count : 1, // 最多可以选择的图片张数，默认9
                sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
                sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
                success: function (res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片    
                    resolve.call(self, res)
                }
            })
        })
    }
    //9.0 调起微信支付
    requestPayment(timeStamp, nonceStr, packageStr, paySign) {
        const self = this;
        return new Promise((resolve, reject) => {
            wx.requestPayment({
                'timeStamp': timeStamp.toString(),
                'nonceStr': nonceStr,
                'package': packageStr,
                'signType': 'MD5',
                'paySign': paySign,
                'success': function (res) {
                    self.close();
                    resolve.call(self, res)
                },
                'fail': function (res) {
                    wx.redirectTo({
                        url: '../../a_me/order_list/order_list?type=1'
                    })
                    self.close();
                    reject.call(res);
                }
            })
        })
    }
    //10.0录音
    recorder(flag) {
        const self = this;
        //flag true时开始录音,false停止录音
        if (flag) {
            const options = {
                duration: 10000,
                sampleRate: 44100,
                numberOfChannels: 1,
                encodeBitRate: 192000,
                format: 'mp3',
                frameSize: 50
            };
            recorderManager.start(options)
        } else {
            return new Promise((resolve, reject) => {
                recorderManager.stop()
                recorderManager.onStop((res) => {
                    resolve.call(self, res)
                })

            })
        }
    }
    //选择视频
    chooseVideo() {
        const self = this;
        return new Promise((resolve, reject) => {
            wx.chooseVideo({
                sourceType: ['album', 'camera'],
                compressed:false,
                maxDuration: 60,
                camera: 'back',
                success: function (res) {
                    console.log(res)
                    if (res.size < 3072000) {
                        resolve.call(self, res)
                    } else {
                        self.error('上传的视频不能超过3M!')
                        reject();
                    }

                },
                fail: function (res) {
                    console.log(res)
                    // self.error(res);
                    // reject.call(res);
                }
            })
        })
    }
    //播放音乐
    playMusic(url, self, type) {
        this.stopMusic();
        const that = this;
        innerAudioContext.src = url
        innerAudioContext.play();
        innerAudioContext.onEnded((res) => {
            if (type) {
                self.v_status = false;
            } else {
                self.tit = '点击播放...'
            }
            self.$apply();
        })
        innerAudioContext.onError((res) => { })

    }
    //停止播放
    stopMusic() {
        innerAudioContext.stop();
    }
    //上传文件
    upload(file, tap) {
        const self = this;
        if (!tap) {
            this.loading("上传中");
        }
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: this.baseUrl + 'Uploadify/uploadFiles',
                filePath: file,
                name: 'file',
                header: {
                    'token': wx.getStorageSync('user_info').access_token
                },
                formData: {},
                success: function (res) {
                    self.close();
                    try {
                        let data = JSON.parse(res.data)
                        if (data.code == 1) {
                            resolve.call(self, data)
                            self.success("文件上传成功！")
                        } else {
                            self.error(data.msg ? data.msg : "上传文件失败，请重新上传！")
                        }
                    } catch (error) {
                        self.error("上传文件失败，请重新上传！")
                    }
                },
                fail: function () {
                    self.error("上传文件失败，请重新上传！")
                }
            })
        })
    }

}
export default WxAPI