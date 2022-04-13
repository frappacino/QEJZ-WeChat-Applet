<template>
	<view>
		<view class="topArea">
		  <view class="toggle">分 类 管 理</view>
		</view>
		<view class="tag_content">
		  <view class="tag_area">
		    <view class="tag_item" v-for="(item, index) in tagList" :key="index">
		      <view class="left">
		        <image :src="item.icon" alt=""/>
		        <view class="tag_name">{{item.tagname}}</view>
		      </view>
		      <view class="right">
		        <text class="iconfont icon-shanchu delicon" @click.stop="clickDelTag(item.id)"></text>
		      </view>
		    </view>
		  </view>
		</view>
		<view class="addArea">
		  <view @click="goclassifyadd" class="add" tag="button">新增</view>  
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				tagList: []
			}
		},
		onLoad() {
			this.getAllTag();
		},
		onPullDownRefresh() {
			this.getAllTag();
			setTimeout( ()=> {
				uni.stopPullDownRefresh(); // 0.5s之后触发（异步）
				console.log('加载完成，更新数据');
			}, 500); // 下拉刷新持续显示0.5s
		},
		onShow() {
			let isRefresh = getApp().globalData.myTagRefresh;
			console.log(isRefresh);
			if(isRefresh == true) {
				this.getAllTag();
				// getApp().globalData.myTagRefresh = false;
			}
		},
		methods: {
			// 获取数据列表
			async getAllTag() {
				const res = await this.$myRuquest({
					url: '/api/getTag'
				})
				this.tagList = res.data.message;
				console.log(this.tagList);
			},
			// 删除某条分类标签
			async delSelectedTag(index) {
				this.id = index;
				const res = await this.$myRuquest({
					url: '/api/deleteTag/'+this.id 
				})
			    if (res.data.flag = 1) {
			      console.log("删除成功")
			    } else if (res.data.flag = 2){
			      console.log("error");
			    }
			},
			// 删除选中某条分类标签
			clickDelTag(index) {
				let that = this;
				uni.showModal({
				    title: '提示',
				    content: '确定要删除此条分类吗？',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							// 重新刷新
							that.delSelectedTag(index);
							that.getAllTag();
							// 让其他有tag的页面也顺便更新
							getApp().globalData.myTagRefresh = true;
							console.log(getApp().globalData.myTagRefresh)
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			// 跳转去增加分类标签页面
			goclassifyadd() {
				uni.navigateTo({
					url: '/pages/classify/classifyadd'
				})
			}
		}
	}
</script>

<style>
.topArea {
  width: 100%;
  height: 70px;
  background-color: #ffa800;
  display: flex;
  padding-top: 30px !important;
  justify-content: center;
}
.toggle {
  background-color: #fff;
  font-size: 16px;
  border-radius: 6px;
  color: #333;
  height: 30px;
  width: 30%;
  line-height: 30px;
  text-align: center;
}
/* tag列表 */
.tag_area {
  padding-bottom: 50px;
  background-color: #fff;
}
.tag_item {
  width: 100%;
  display: flex;
  border-bottom: 1px solid rgb(223, 223, 223);
  padding: 10px 0;
  align-items: center;
  justify-content: space-between;
}
.tag_item .left {
  display: flex;
  align-items: center;
  margin-left: 20px;
}
.tag_item image {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  border: 1px solid #ffa800;
  border-radius: 50%;
  padding: 6px;
}
.tag_name {
  font-size: 16px;
}
.tag_item .right {
	margin-right: 20px;
}
.tag_item .delicon {
	font-size: 24px;
	color: #999;
}
/* 删除按钮 */
.del {
  border: none;
  color: rgb(194, 193, 193);
  font-size: 10px;
}
/* 新增按钮 */
.addArea {
  background-color: #fff;
}
.add {
  margin-left:  50%;
  transform: translateX(-50%);
  margin-bottom: 80px;
  width: 80px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  font-size: 16px;
  background-color: #ffa800;
  color: white;
  border-radius: 6px;
}
</style>
