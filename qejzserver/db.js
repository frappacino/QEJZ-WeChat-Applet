// 封装连接数据库

// 加载数据库驱动
const mysql = require('mysql');
exports.base = (sql, data, callback) => {
	// 创建数据库连接
	const connection = mysql.createConnection({
		host: 'localhost', //数据库所在的服务器的域名或者IP地址
		user: 'root', //登录数据库的账号
		password: 'root', //登录数据库的密码
		database: 'qejz'
	});
	//执行连接操作
	connection.connect();
	//操作数据库
	connection.query(sql, data, function(error, results, fields) {
		if (error) throw error;
		// console.log(results);
		callback(results);
	});
	//关闭数据库
	connection.end();
}
