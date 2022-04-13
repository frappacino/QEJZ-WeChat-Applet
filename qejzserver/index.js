// 企鹅记账-入口文件
const express = require('express');
const router = require('./router.js');
const app = express();
const bodyParser = require('body-parser');

// 启动服务器功能
// 转化前端axios的post请求过来的数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 配置路由
app.use(router);



//跨域  后期删
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "*");//配置客户端 localhost与127.0.0.1是一个意思
    if (req.method == 'OPTIONS') {
        /*让options请求快速返回*/
        res.send(200);
    }
    else {
/*防止异步造成多次响应，出现错误*/
        var _send = res.send;
        var sent = false;
        res.send = function (data) {
            if (sent) return;
            _send.bind(res)(data);
            sent = true;
        };
        next();
    }
});

//session
// var session = require('express-session');
// app.use(session({
// 	secret: 'qejz2021', //设置 session 签名
// 	name: 'qejz',
// 	cookie: {
// 		maxAge: 60 * 1000 * 60 * 24
// 	}, // 储存的时间 24小时
// 	resave: false, // 每次请求都重新设置session
// 	saveUninitialized: true
// }));


// 监听端口
app.listen(3000, () => {
	console.log('running...');
})
