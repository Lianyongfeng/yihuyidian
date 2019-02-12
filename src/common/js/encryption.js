class Encryption {
    //eidtionTypeMap是map数组
    encryption(eidtionTypeMap) {
        if (eidtionTypeMap.has('sign')) {
            eidtionTypeMap.delete('sign')
        }
        let arr = []
        for (let [key, value] of eidtionTypeMap) {
            if (!value) {
                eidtionTypeMap.delete(key)
            } else {
                arr.push(key)
            }
        }
        arr = arr.sort();
        var params = ''
        arr.forEach(item => {
            if (eidtionTypeMap.has(item)) {
                let value = eidtionTypeMap.get(item)
                params += `${item}=${value}&`
            }
        });
        return this.hexMD5(params + wx.getStorageSync('token'));
    }
}
export default Encryption