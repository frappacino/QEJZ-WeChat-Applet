 // 封装myRequest并在main.js里挂载全局
 // import uni_request from './uni_request.js'
 
 const BASE_URL = 'http://localhost:3000'
 export const myRequest = (options)=>{
	 const token = uni.getStorageSync('token');
	 
	 if (options.url == '/api/getOpenid') {
		 console.log('现在要登录');
		 return new Promise((resolve,reject)=>{
		 	 uni.request({
		 		 url: BASE_URL + options.url,
		 		 method: options.method || 'GET',
		 		 data: options.data || {},
		 		 // header: options.header || { token:token },
		 		 header: { token:token },
		 		 success: (res)=>{
		 			 if (res.data.success_code !== 200) {
		 			 	return uni.showToast({
		 			 		title:'获取数据失败'
		 			 	})
		 			 }
		 			 resolve(res)
		 		 },
		 		 fail:(err)=>{
		 			 uni.showToast({
		 			 	title:'获取接口失败'
		 			 })
		 			 reject(err)
		 		 }
		 	 })
		 })
	 }
	 else {
	 	 if(!token ){
	 	 	// 执行没有登录的逻辑
	 	 		uni.showToast({
	 	 			title:'您未登录！'
	 	 		})
	 	 	return;
	 	 }
	 	 return new Promise((resolve,reject)=>{
	 	 	 uni.request({
	 	 		 url: BASE_URL + options.url,
	 	 		 method: options.method || 'GET',
	 	 		 data: options.data || {},
	 	 		 // header: options.header || { token:token },
	 	 		 header: { token:token },
	 	 		 success: (res)=>{
	 	 			 if (res.data.success_code !== 200) {
	 	 			 	return uni.showToast({
	 	 			 		title:'获取数据失败'
	 	 			 	})
	 	 			 }
	 	 			 resolve(res)
	 	 		 },
	 	 		 fail:(err)=>{
	 	 			 uni.showToast({
	 	 			 	title:'获取接口失败'
	 	 			 })
	 	 			 reject(err)
	 	 		 }
	 	 	 })
	 	 })
	 }
 }