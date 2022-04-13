<template>
	<view>
		<view class="topArea">
			<view class="toggle">
				<!--  支出收入的切换按钮 -->
				<text class="out" @click="changeType($event)" ref="out" id="out"
					:class="isActive == 'outType' ? 'active' : ''">借出</text>
				<text class="in" @click="changeType($event)" ref="in" id="in"
					:class="isActive == 'inType' ? 'active' : ''">借入</text>
			</view>
		</view>
		<view v-show="isActive == 'outType'">
			<view class="tag_content">
				<view class="tag_area">
					<view class="tag_item" @click="goloanconcrete(item)" v-for="(item,index) in loanlistout" :key="index">
						<view class="left">
							<text class="iconfont icon-jieqian icon"></text>
							<view class="tag_name">{{item.people}}--{{item.remarks}}</view>
						</view>
						<view class="right">
							<view class="tag_name">
								{{item.money}}
							</view>
							<text class="iconfont icon-shanchu delicon" @click.stop="clickDelLoan(item.id)"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-show="isActive == 'inType'">
			<view class="tag_content">
				<view class="tag_area">
					<view class="tag_item" @click="goloanconcrete(item)" v-for="(item,index) in loanlistin" :key="index">
						<view class="left">
							<text class="iconfont icon-jieqian icon"></text>
							<view class="tag_name">{{item.people}}--{{item.remarks}}</view>
						</view>
						<view class="right">
							{{item.money}}
							<text class="iconfont icon-shanchu delicon" @click.stop="clickDelLoan(item.id)"></text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="addArea">
			<view @click="goloanadd(isActive)" class="add" tag="button">新增</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isActive: "outType",
				loanlistout: [],
				loanlistin: [],
				loantype: true
			}
		},
		onLoad() {
			this.getAllLoan();
		},
		onPullDownRefresh() {
			this.getAllLoan();
			setTimeout( ()=> {
				uni.stopPullDownRefresh(); // 0.5s之后触发（异步）
				console.log('加载完成，更新数据');
			}, 500); // 下拉刷新持续显示0.5s
		},
		onShow() {
			let isRefresh = getApp().globalData.myLoanRefresh;
			console.log(isRefresh);
			if(isRefresh == true) {
				this.getAllLoan();
				getApp().globalData.myLoanRefresh = false;
			}
		},
		methods: {
			// 获取借款数据列表
			async getAllLoan() {
				this.loanlistout = [];
				this.loanlistin = [];
				const res = await this.$myRuquest({
					url: '/api/getLoan',
				})
				console.log(res);
				let msgtype = typeof res.data.message;
				if (msgtype == typeof ''){
					uni.showToast({
						title: res.data.message,
						icon:'none',
						duration: 2000
					});
				} else if (res.data.success_code === 200) {
						this.compare(res.data.message);
					  res.data.message.forEach(element => {
						  
						if (element.type == "借出") {
						  this.loanlistout.push(element);
						} else if (element.type == "借入") {
						  this.loanlistin.push(element);
						}
					  });
				} else {
				  console.log("error");
				}
			},
			// 删除某条借款记录接口
			async delSelectedLoan(index) {
				this.id = index;
				const res = await this.$myRuquest({
					url: '/api/deleteLoan/'+this.id 
				})
			    if (res.data.flag = 1) {
			      console.log("删除成功")
			    } else if (res.data.flag = 2){
			      console.log("error");
			    }
			},
			// 删除选中借款记录
			clickDelLoan(index) {
				let that = this;
				uni.showModal({
				    title: '提示',
				    content: '确定要删除此条借款记录吗？',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							that.delSelectedLoan(index);
							that.getAllLoan();
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			goloanconcrete(item) {
				uni.navigateTo({
					url: '/pages/loan/loanconcrete?item='+ encodeURIComponent(JSON.stringify(item))
				})
			},
			goloanadd(isActive) {
				uni.navigateTo({
					url: '/pages/loan/loanadd?type=' + isActive
				})
			},
			// 更改借款类型
			changeType(e) {
			  if (e.currentTarget.id == "out") {
			    this.isActive = 'outType';
			    this.loantype = true;
			  } else if (e.currentTarget.id == "in"){
			    this.isActive = 'inType';
			    this.loantype = false;
			  }
			},
			// 排序方法--降序，最新日期在前
			compare(list){
			    for (let i=0;i<list.length;i++){
			        for (let j=i;j<list.length;j++){
			          let comparetimei = this.$myformatDate(list[i].date,0);
			          let comparetimej = this.$myformatDate(list[j].date,0);
			            if(new Date(comparetimej.replace(/-/,'/')) - new Date(comparetimei.replace(/-/,'/'))>0){
			                let listObj=list[i];
			                list[i]=list[j];
			                list[j]=listObj;
			            }
			        }
			    }
			    return list;
			},
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
	background-color: #ffa800;
	border-radius: 6px;
	color: #333;
	width: 40%;
	height: 30px;
	text-align: center;
	line-height: 30px;
	display: flex;
	flex-wrap: nowrap;
}
.out {
	border-radius: 6px 0 0 6px;
	border: 1px solid #333;
	width: 50%;
}
.in {
	border-radius: 0 6px 6px 0;
	border: 1px solid #333;
	width: 50%;
}
.active {
	border: 1px solid #333;
	background: #000;
	color: white;
}
.tag_area {
	padding-bottom: 50px;
	background-color: #fff;
}
.tag_item {
	width: 100%;
	display: flex;
	border-bottom: 1px solid rgb(223, 223, 223);
	align-items: center;
	padding: 10px 0;
	justify-content: space-between;
}
.tag_item .left,.right {
	display: flex;
	align-items: center;
	margin-left: 16px;
}
.tag_item .icon {
	margin-right: 8px;
	font-size: 24px;
	border: 1px solid #ffa800;
	border-radius: 50%;
	padding: 4px;
}
.tag_name {
	font-size: 16px;
}
.tag_item .right {
	margin-right: 16px;
}
.tag_item .delicon {
	margin-left: 6px;
	font-size: 24px;
	color: #999;
}

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
