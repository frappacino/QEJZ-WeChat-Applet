// 业务模块
// const request = require('request');
const db = require('./db.js');
// const querystring = require("querystring");
const https = require("https");
//导入jwt生成token和解析token
const jwt = require('jsonwebtoken');
// 导入xsls模块生成Excel
const xlsx = require('node-xlsx')//引入模块
const fs = require('fs');  // JSON数据(此处作为示例，JSON数据写到代码当中，实际过程中，先生成JSON文件，然后通过fs.readFile读取文件内容，然后拿读取到的数据生成Excel)
// 发送邮箱
const nodemailer = require('nodemailer');

// 根据token获取openid识别用户
var verifyUser = (req,res) => {
    //验证token
    var token = req.headers.token;
    console.log(token);
    var tokenResult = {
        userid : '',
        message : ''
    }
    const secret = 'qejz' // secret要与签发时一致
    jwt.verify(token, secret, (err, decoded) => {
        if(err){
            console.log(err.name)
            switch (err.name) {
                case 'JsonWebTokenError':
                tokenResult.message = '无效用户，请重新登录';
                //   res.status(403).send({ code: -1, msg: '无效的token' });
                  break;
                case 'TokenExpiredError':
                //   res.status(403).send({ code: -1, msg: 'token过期' });
                tokenResult.message = '登录已过期，请重新登录';
                  break;
            }
        } else {
            console.log('解码')
            tokenResult.userid = decoded.openid
        }
        
        console.log(tokenResult)
    })
    return tokenResult
}

//保存新增账单
exports.addCounts = (req, res) => {
    var tokenResult = verifyUser(req);
    if(tokenResult.userid == '') {
        console.log('未登录')
        console.log(tokenResult)
        res.json({ success_code: 200,  message: tokenResult.message })
    } else {
        // 获取表单数据
        let info = req.body;
        console.log(info);
        let detail = [info.addtime, info.tagname, info.icon, info.money, info.remarks, info.consumetype, tokenResult.userid];
        let sql = 'insert into detail (addtime,tagname,icon,money,remarks,consumetype,openid) values(?,?,?,?,?,?,?)';
        db.base(sql, detail, (result) => {
            if (result.affectedRows == 1) {
                res.json({success_code: 200,message:'插入成功'});
                console.log("ok");
            }
            else {
                console.error(); 
                res.json({success_code: 1,message:'插入失败'});
            }
        })
    }
}

// 获取账单明细detail
exports.getDetail = (req, res) => {
    var tokenResult = verifyUser(req);
    if(tokenResult.userid == '') {
        console.log('未登录')
        console.log(tokenResult)
        res.json({ success_code: 200,  message: tokenResult.message })
    } else {
        let sql = 'SELECT * FROM detail WHERE openid = ?'
        db.base(sql, tokenResult.userid, (result) => {
            res.json({ success_code: 200, message: result })
        })
    }
}

// 获取选中的账单条目明细detail
exports.getSelectedDetail = (req, res) => {
    let id = req.params.id;
    console.log(req.params);
	let data = id;
    let sql = 'select * from detail where id = ?';
    db.base(sql, data, (result) => {
        res.json({ success_code: 200, message: result })
        // res.render('/editdetail',result[0]);
    })
}
// 保存编辑好的账单条目并返回账单明细页面
exports.editDetail = (req,res) => {
	let info = req.body;
    console.log(info);
	let sql = 'update detail set addtime=?,tagname=?,icon=?,money=?,remarks=?,consumetype=? where id =?';
	let data = [info.addtime,info.tagname,info.icon,info.money,info.remarks,info.consumetype,info.id];
	db.base(sql,data,(result)=>{
		if(result.affectedRows == 1){
			res.json({ success_code: 200, message: result })
		} else { res.json({  message: "errorrrr" }) }
	});
}

// 删除具体某条账单
exports.deleteDetail = (req,res) => {
	let id = req.params.id;
    console.log(req.params);
	let data = id;
	let sql = 'delete from detail where id=?';
	db.base(sql,data,(result)=>{
		if(result.affectedRows == 1){
			res.json({success_code: 200,flag : 1});
		}else{
			res.json({flag : 2});
		}
	});
};

// 获取tag
exports.getTag = (req, res) => {
    var tokenResult = verifyUser(req);
    if(tokenResult.userid == '') {
        console.log('未登录')
        console.log(tokenResult)
        res.json({ success_code: 200,  message: tokenResult.message })
    } else {
        let sql = 'select * from tag WHERE openid = ?';
        db.base(sql, tokenResult.userid, (result) => {
            res.json({ success_code: 200, message: result })
        })
    }
}
// 新增某个分类标签
exports.addTag = (req,res) => {
    var tokenResult = verifyUser(req);
    if(tokenResult.userid == '') {
        console.log('未登录')
        console.log(tokenResult)
        res.json({ success_code: 200,  message: tokenResult.message })
    } else {
        let info = req.body;
        console.log(info);
        let detail = [info.tagname, info.icon, tokenResult.userid];
        let sql = 'insert into tag (tagname,icon,openid) values(?,?,?)';
        db.base(sql, detail, (result) => {
            if (result.affectedRows == 1) {
                res.json({success_code: 200,message:'插入成功'});
                console.log("ok");
            }
            else {
                console.error(); 
                res.json({success_code: 1,message:'插入失败'});
            }
        })
    }
	
};

// 删除某个分类标签
exports.deleteTag = (req,res) => {
	let id = req.params.id;
    console.log(req.params);
	let data = id;
	let sql = 'delete from tag where id=?';
	db.base(sql,data,(result)=>{
		if(result.affectedRows == 1){
			res.json({success_code: 200,flag : 1});
		}else{
			res.json({flag : 2});
		}
	});
};

// 获取借款记录
exports.getLoan = (req, res) => {
    var tokenResult = verifyUser(req);
    if(tokenResult.userid == '') {
        console.log('未登录')
        console.log(tokenResult)
        res.json({ success_code: 200, message: tokenResult.message })
    } else {
        let sql = 'select * from loan WHERE openid = ?';
        db.base(sql, tokenResult.userid, (result) => {
            res.json({ success_code: 200, message: result })
        })
    }
}
// 删除某个借款记录
exports.deleteLoan = (req,res) => {
	let id = req.params.id;
    console.log(req.params);
	let data = id;
	// let sql = 'delete from loan where id=?';
    let sql = 'delete loan,loanhandle from loan LEFT JOIN loanhandle ON loan.id = loanhandle.loan_id where loan.id =?';
	db.base(sql,data,(result)=>{
        console.log('shanloan',result)
		if(result.affectedRows == 0){ //失败
			res.json({success_code: 200,flag : 2});
		}else{ //这是级联表，删除的不只是一行数据
			res.json({success_code: 200,flag : 1});
		}
	});
};
// 保存新增的借款记录
exports.addLoan = (req,res) => {
    var tokenResult = verifyUser(req);
    if(tokenResult.userid == '') {
        console.log('未登录')
        console.log(tokenResult)
        res.json({ success_code: 200,  message: tokenResult.message })
    } else {
        let info = req.body;
        console.log(info);
        let detail = [info.people, info.money, info.date, info.remarks, info.type, tokenResult.userid];
        let sql = 'insert into loan (people,money,date,remarks,type,openid) values(?,?,?,?,?,?)';
        db.base(sql, detail, (result) => {
            if (result.affectedRows == 1) {
                res.json({success_code: 200,message:'插入成功'});
                console.log("ok");
            }
            else {
                console.error(); 
                res.json({success_code: 1,message:'插入失败'});
            }
        })
    }
};

// 保存新增的收款还款记录
exports.addLoanBack = (req,res) => {
	let info = req.body;
	console.log(info);
    let detail = [info.type, info.date, info.money, info.remarks, info.loan_id];
    let sql = 'insert into loanhandle (type,date,money,remarks,loan_id) values(?,?,?,?,?)';
    db.base(sql, detail, (result) => {
        if (result.affectedRows == 1) {
            res.json({success_code: 200,message:'插入成功'});
            console.log("ok");
        }
        else {
            console.error(); 
            res.json({success_code: 1,message:'插入失败'});
        }
    })
};
// 获取收款还款记录
exports.getLoanBack = (req, res) => {
    let id = req.params.id;
    console.log(req.params.id);
    let data = id;
    let sql = 'SELECT lh.* FROM loan l ,loanhandle lh WHERE lh.loan_id = ? GROUP BY lh.id';
    db.base(sql, data, (result) => {
        res.json({ success_code: 200, message: result })
    })
}
// 删除某个收款还款记录
exports.deleteLoanBack = (req,res) => {
	let id = req.params.id;
    console.log(req.params);
	let data = id;
	let sql = 'delete from loanhandle where id=?';
	db.base(sql,data,(result)=>{
		if(result.affectedRows == 1){
			res.json({success_code: 200,flag : 1});
		}else{
			res.json({flag : 2});
		}
	});
};


//用从前端接收到的code向微信服务器换取openid，并生成token给前端，同时存储openid进数据库
exports.getOpenid = (req, res) => {
    console.log(req.body.nickName);
    let nickName = req.body.nickName;//获取小程序传来的昵称
    let code = req.body.code;//获取小程序传来的code
    let encryptedData = req.body.encryptedData;//获取小程序传来的encryptedData
    let iv = req.body.iv;//获取小程序传来的iv
    let appid = "wx9a0cf8632a101087";//自己小程序后台管理的appid，可登录小程序后台查看
    let secret = "44b9bb6c4f8f64a667a147a9d828666e";//小程序后台管理的secret，可登录小程序后台查看
    // let grant_type = "authorization_code";// 授权（必填）默认值直接换取token
    let grantType = "client_credential";//只是换取openid和sessionkey
    
    // 请求获取openid
    let url = "https://api.weixin.qq.com/sns/jscode2session?grantType="+grantType+"&appid="+appid+"&secret="+secret+"&js_code="+code;
    let openid,sessionKey;
    var requestFunc = (url,callback) => {
        var tokenreq = https.get(url, (res) => {
            res.on('data', (d) => {
                console.log('微信服务器返回的信息: ', JSON.parse(d));
                openid = JSON.parse(d).openid;//得到openid
                // openid = 'rew'
                sessionKey = JSON.parse(d).session_key;//得到session_key
                // 0.准备用户信息
                const userSecret = {
                    openid,
                    sessionKey,
                    nickName
                }
                // 1. 生成一个 token
                const token = jwt.sign(userSecret, 'qejz', {expiresIn: 24*3600 })//24*3600表示一天后过期
                
                // 2.把用户信息存进数据库
                //先查询user表中有没有此用户
                let sql = 'select * from user where openid = ?';
                db.base(sql, openid, (result) => {
                    console.log(result);
                    console.log(Object.keys(result).length === 0 ); //！！！重难点：这里的result打印出来是[]，但类型却是object，所以应该是空对象，老用户打印出来result是对象数组
                    let isregister = Object.keys(result).length;
                    //老用户
                    if(isregister !== 0) {
                        console.log('老用户')
                        console.log(result[0].registerDate);
                        let registerDate = result[0].registerDate;
                        // 3.返回token和注册日期给前端
                        callback(token,registerDate);
                        return;
                    //新用户，把openid、昵称、注册时间存储进数据库
                    } else if(isregister === 0){ 
                        console.log('注册用户')
                        let registerDate = new Date();
                        console.log(registerDate);
                        // 3.返回token和注册日期给前端
                        callback(token,registerDate);
                        let userinfo = [openid,userSecret.nickName,registerDate]
                        let sql = 'insert into user (openid,nickName,registerDate) values(?,?,?)';
                        db.base(sql, userinfo, (result) => {
                            console.log('插入user',result)
                        })
                        // 4.新用户，需要先复制下tag分类
                        let sqlTag = 'INSERT INTO tag(tagname,icon,openid) SELECT oldtag.tagname,oldtag.icon,user.openid from oldtag JOIN user where user.openid = ?'
                        db.base(sqlTag, openid, (result) => {
                            console.log('插入tag',result)
                        })
                    }
                })
                
            }).on('error', (e) => {
                console.error(e);
            });
            
        });
        tokenreq.end();
    }
    requestFunc(url,(tok,dat)=>{
        res.json({success_code: 200,message: [tok, dat]});
            console.log("返回token和注册日期给前端");
    })
}
// 获取坚持记账天数
exports.getKeepDay = (req, res) => {
    var tokenResult = verifyUser(req);
    if(tokenResult.userid == '') {
        console.log('未登录')
        console.log(tokenResult)
        res.json({ success_code: 200,  message: tokenResult.message })
    } else {
        let id = tokenResult.userid;
        console.log(tokenResult.userid);
        let data = id;
        let sql = 'select registerDate from user where openid = ?';
        db.base(sql, data, (result) => {
            res.json({ success_code: 200, message: result })
        })
    }
}
//导出账单
exports.exportDetailExcel = (req, res) => {
    var tokenResult = verifyUser(req);
    if(tokenResult.userid == '') {
        console.log('未登录')
        console.log(tokenResult)
        res.json({ success_code: 200,  message: tokenResult.message })
    } else {
        console.log(req.params.mail)
        let QQMail = req.params.mail;
        let id = tokenResult.userid;
        let sql = 'select * from detail where openid = ?';
        db.base(sql,id,(rows)=>{
            //rows是个从数据库里面读出来的数组，大家就把他当成一个普通的数组就ok
            let data = [] // 其实最后就是把这个数组写入excel   
            let title = ['记账时间','分类','金额','备注','消费类型']//这是第一行 俗称列名 
            data.push(title) // 添加完列名 下面就是添加真正的内容了
            rows.forEach((element) => {
                let arrInner = [];
                if(element.consumetype == 'outType') {
                    element.consumetype = '支出';
                } else if(element.consumetype == 'inType') {
                    element.consumetype = '收入';
                }
                arrInner.push(element.addtime)
                arrInner.push(element.tagname)
                arrInner.push(element.money)
                arrInner.push(element.remarks)
                arrInner.push(element.consumetype)
                data.push(arrInner)//data中添加的要是数组，可以将对象的值分解添加进数组，例如：['1','name','上海']
            });
            let buffer = xlsx.build([
                {
                    name: 'sheet1',
                    data: data
                }
            ]);
            let xslsName = '所有账单';
            let path = './static/bill/' + xslsName+ '.xlsx';
            fs.writeFileSync(path,buffer,{'flag':'w'});//生成excel the_content是excel的名字，大家可以随意命名
            
            


            //发送到QQ邮箱
            // 引入 nodemailer
            // 创建一个SMTP客户端配置
            var config = {
                host: 'smtp.qq.com',//网易163邮箱 smtp.163.com
                port: 465,//网易邮箱端口 25
                auth: {
                    user: '2850045003@qq.com', //邮箱账号
                    pass: 'rajxdloqiwhxdgdd'  //邮箱的授权码
                }
            };

            // 创建一个SMTP客户端对象
            var transporter = nodemailer.createTransport(config);

            // 发送邮件
            function send(mail){
                transporter.sendMail(mail, function(error, info){
                    if(error) {
                        return console.log(error);
                    }
                    console.log('mail sent:', info.response);
                });
            };

            // 创建一个邮件对象
            var mail = {
                // 发件人
                from: '"企鹅记账"<2850045003@qq.com>',
                // 主题
                subject: '个人账单',
                // 收件人
                to: QQMail,
                // 邮件内容，HTML格式
                text: '请查收您的个人账单哦！', //可以是链接，也可以是验证码
                attachments:[
                    {
                    filename : xslsName + '.xlsx',
                    path: path
                    }
                ]
            };
            send(mail);

            
            res.json({ success_code: 200, message: '已发送至您的邮箱！请查收' })
        })
        
    }
}