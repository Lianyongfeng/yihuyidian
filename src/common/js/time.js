class Timer {
    /**
     * 商城活动计时
     * @param {*当前上下文} selfs 
     */
    getActivityTime(selfs) {
        const now = new Date();
        const self = this;
        let hour = now.getHours();
        let minute = now.getMinutes();
        let sec = now.getSeconds();

        // if (hour < 9) {
        //     selfs.activityTime = "9点场"
        // }

        selfs.activityTime = hour % 2 == 0 ? hour + "点场" : hour - 1 + "点场";

        selfs.actHour = hour % 2 == 0 ? "01" : "00";
        selfs.actMinute = 60 - minute - 1 < 10 ? "0" + (60 - minute - 1) : 60 - minute - 1;
        selfs.actSec = 60 - sec < 10 ? "0" + (60 - sec) : 60 - sec;
        selfs.$apply();
        setTimeout(() => {
            self.getActivityTime(selfs);
        }, 1000)
    }

    getCurrentTime(flag) {
        const now = new Date();
        const self = this;
        self.year = now.getYear();
        self.month = now.getMonth() + 1;
        self.date = now.getDate();
        self.hour = now.getHours();
        self.minute = now.getMinutes();
        self.sec = now.getSeconds();
        if (flag) {
            setTimeout(() => {
                self.getCurrentTime(true);
            }, 1000)
        }
    }

    getMdate() {
            const now = new Date();
            let month = now.getMonth() + 1;
            let date = now.getDate();
            if (month < 10) {
                month = `0${month}`
            }
            if (date < 10) {
                date = `0${date}`
            }
            return `${month}-${date}`
        }
        //判断几天前
    getDateDiff(dateTimeStamp) {
        dateTimeStamp = parseInt(dateTimeStamp) * 1000;
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var month = day * 30;
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        var result;
        if (monthC >= 1) {
            result = parseInt(monthC) + "个月前";
        } else if (weekC >= 1) {
            result = parseInt(weekC) + "个星期前";
        } else if (dayC >= 1) {
            result = parseInt(dayC) + "天前";
        } else if (hourC >= 1) {
            result = parseInt(hourC) + "小时前";
        } else if (minC >= 1) {
            result = parseInt(minC) + "分钟前";
        } else
            result = "刚刚发表";
        return result;
    }

    /** 
     * 时间戳转化为年 月 日 时 分 秒 
     * number: 传入时间戳 
     * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 如：'Y-M-D h:m'
     */
    formatTime(number, format) {
        var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        var returnArr = [];
        var date = new Date(number * 1000);
        returnArr.push(date.getFullYear());
        returnArr.push(this.formatNumber(date.getMonth() + 1));
        returnArr.push(this.formatNumber(date.getDate()));
        returnArr.push(this.formatNumber(date.getHours()));
        returnArr.push(this.formatNumber(date.getMinutes()));
        returnArr.push(this.formatNumber(date.getSeconds()));
        for (var i in returnArr) {
            format = format.replace(formateArr[i], returnArr[i]);
        }
        return format;
    }

    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }

    /**
     * 获取限时购的时间
     * @param {} self
     */
    getLimitTime(selfs, flag) {
        const now = new Date();
        const self = this;
        let hour = now.getHours();
        if (hour >= 21) {
            for (var i = 0; i < 5; i++) {
                selfs.timeList[i].type = 1
                selfs.selectNav = 5
            }
        } else if (hour >= 18) {
            for (var i = 0; i < 4; i++) {
                selfs.timeList[i].type = 1
                selfs.selectNav = 4
            }
        } else if (hour >= 15) {
            for (var i = 0; i < 3; i++) {
                selfs.timeList[i].type = 1
                selfs.selectNav = 3
            }
        } else if (hour >= 12) {
            for (var i = 0; i < 2; i++) {
                selfs.timeList[i].type = 1
                selfs.selectNav = 2
            }
        } else if (hour >= 9) {
            for (var i = 0; i < 1; i++) {
                selfs.timeList[i].type = 1
                selfs.selectNav = 1
            }
        }
        selfs.$apply();
        // if (flag) {
        //     setTimeout(() => {
        //         self.getLimitTime(selfs, flag);
        //     }, 1000)
        // }
    }

    /**
     * 判断是否过了当前时间
     */
    getTheTimestamp(time) {
        var isTap = false
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        return isTap = time > timestamp
    }

    /**
     * 限时抢购商品详情时间
     * @param {*当前上下文} selfs 
     */
    getShopDetailsTime(selfs, startTime, endTime) {
        const self = this;
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        var isTag = endTime - timestamp > 0 ? true : false;
        var isStartTag = timestamp - startTime > 0 ? true : false;
        selfs.isFlashSale = isTag && isStartTag
        let seconds = endTime - timestamp
        let hour = Math.floor(seconds / 3600);
        let hours = seconds % 3600;
        let minute = Math.floor(hours / 60);
        let sec = hours % 60;
        selfs.actHour = hour < 10 ? "0" + hour : hour;
        selfs.actMinute = minute < 10 ? "0" + minute : minute;
        selfs.actSec = sec < 10 ? "0" + sec : sec;
        if (selfs.isFlashSale && selfs.flag) {
            selfs.timeout = setTimeout(() => {
                self.getShopDetailsTime(selfs, startTime, endTime);
                selfs.$apply();
            }, 1000)
        }
        selfs.$apply();
    }

    //获取月-日 时：分
    getFormateTime(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }
        return `${month}月${day}日${hours}：${minutes}`
    }

}
export default Timer