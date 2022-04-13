<template>
	<view>
		<view class="classify">
		  <text>分类名称：</text>
		  <input type="text" placeholder="点击输入" v-model="tagname" />
		</view>
		<view class="classify">
		  <text>分类图标：</text>
		  <input type="text" placeholder="点击下方图标选择" />
		</view>
		<view class="tagArea">
		  <view class="tag_item" v-for="(item, index) in imgList" :key="index" @click="sendTag(index)" >
		    <image :src="item.imgsrc" alt=""  :class="isactive == index ? 'addclass' : '' " />
		  </view>
		</view>
		<button class="save" @click="saveNewTag">保存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tagname: "",
				tagicon: "",
				isactive: 0,
				activeTag: {},
				imgList: [
				  {imgsrc: require('static/img/canyin.png'),icon:'static/img/canyin.png'},
				  {imgsrc: require('static/img/yaopin.png'),icon:'static/img/yaopin.png'},
				  {imgsrc: require('static/img/jiaotong.png'),icon:'static/img/jiaotong.png'},
				  {imgsrc: require('static/img/zhufang.png'),icon:'static/img/zhufang.png'},
				  {imgsrc: require('static/img/shuiguo.png'),icon:'static/img/shuiguo.png'},
				  {imgsrc: require('static/img/yifu.png'),icon:'static/img/yifu.png'},
				  {imgsrc: require('static/img/lingshi.png'),icon:'static/img/lingshi.png'},
				  {imgsrc: require('static/img/yinliao.png'),icon:'static/img/yinliao.png'},
				  {imgsrc: require('static/img/huazhuang.png'),icon:'static/img/huazhuang.png'},
				  {imgsrc: require('static/img/hufu.png'),icon:'static/img/hufu.png'},
				  {imgsrc: require('static/img/riyong.png'),icon:'static/img/riyong.png'},
				  {imgsrc: require('static/img/hongbao.png'),icon:'static/img/hongbao.png'},
				  {imgsrc: require('static/img/jiaoyu.png'),icon:'static/img/jiaoyu.png'},
				  {imgsrc: require('static/img/qita.png'),icon:'static/img/qita.png'},
				  {imgsrc: require('static/img/cunqian.png'),icon:'static/img/cunqian.png'},
				  {imgsrc: require('static/img/dianfei.png'),icon:'static/img/dianfei.png'},
				  {imgsrc: require('static/img/huafei.png'),icon:'static/img/huafei.png'},
				  {imgsrc: require('static/img/juankuan.png'),icon:'static/img/juankuan.png'},
				  {imgsrc: require('static/img/liwu.png'),icon:'static/img/liwu.png'},
				  {imgsrc: require('static/img/maicai.png'),icon:'static/img/maicai.png'},
				  {imgsrc: require('static/img/menpiao.png'),icon:'static/img/menpiao.png'},
				  {imgsrc: require('static/img/shuifei.png'),icon:'static/img/shuifei.png'},
				]
			}
		},
		onLoad() {
			this.tagicon = '/static/img/canyin.png';
		},
		methods: {
			// 发送post请求
			 async addNewTag() {
			   const res = await this.$myRuquest({
				   url: '/api/addTag',
				   method: 'post',
				   data: this.activeTag
			   })
			   if (res.data.success_code === 200) {
			     console.log("成功");
			     this.tagicon = "";
			     this.tagname = "";			     
			   } else console.log("error");
			},
			// 保存新的分类标签
			saveNewTag() {
			  this.$set(this.activeTag, "tagname", this.tagname);
			  this.$set(this.activeTag, "icon", this.tagicon);
			  console.log(this.activeTag);
			  this.addNewTag();
			  // 跳转至分类标签列表页面
			  getApp().globalData.myTagRefresh = true;
			  setTimeout(()=>{
			    uni.navigateBack({ //navigateto会刷新 页面从头开始显示 而navigateback回到上一个页面浏览的地方 且不更新
			    	url: '/pages/classify/classify'
			    })
			  })
			},
			//点击后传值给父组件
			sendTag(index) {
			  this.tagicon = '/' + this.imgList[index].icon;
			  this.isactive = index;
			}
		}
	}
</script>

<style>
/* 激活样式 */
.addclass {
  border: 2px solid #ffa800;
  border-radius: 50%;
  background-color: #ffa800;
}

.classify {
  display: flex;
  border-bottom: 1px solid rgb(235, 235, 235);
  padding: 4px 20px;
  align-items: center;
}
.classify text {
  width: 40%;
  font-size: 14px;
  margin: 0;
  color: #666;
}
.classify input {
  width: 100%;
  padding: 0;
  border: none;
  margin: 0;
  font-size: 14px;
  height: 30px;
}
.tagArea {
    display: flex;
    width: 90%;
    margin: 10px auto;
    flex-wrap: wrap;
    justify-content: flex-start;
}
.tag_item {
    margin: 6px 6px;
}
.tag_item image {
  border: 1px solid #ffa800;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 6px;
}
/* 保存按钮 */
.save {
  margin-left: 50%;
  transform: translateX(-50%);
  margin-bottom: 80px;
  width: 80px;
  font-size: 16px;
  background-color: #ffa800;
  color: white;
  border-radius: 6px;
}
</style>
