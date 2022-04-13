export function formatDate(secs, type = 0) {         //type是可选参数，因为json中时间的格式是year-month-date,不能识别XX年XX月XX日
    var t = new Date(secs)
    var year = t.getFullYear()
    var month = t.getMonth() + 1
    if (month < 10) { month = '0' + month }
    var date = t.getDate()
    if (date < 10) { date = '0' + date }
    var hour = t.getHours()
    if (hour < 10) { hour = '0' + hour }
    var minute = t.getMinutes()
    if (minute < 10) { minute = '0' + minute }
    var second = t.getSeconds()
    if (second < 10) { second = '0' + second }
    if (type == 0) {
        return year + '-' + month + '-' + date
    } else if (type == 1){
        return year + '年' + month + '月' + date + '日'
        
    } else if (type == 2){
        return month + '月' + date + '日'
    } else if (type == 3){
        return year 
    } else if (type == 4){
        return month  
    } 
}