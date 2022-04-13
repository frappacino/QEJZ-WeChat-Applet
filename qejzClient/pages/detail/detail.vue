<template>
	<view>
		<!-- 顶部黄色区域 -->
		<view class="topArea">
			<picker mode="date" :value="dateVal" fields="month" :start="startDate" :end="endDate" @change="dateChange" class="date">
				<view class="datey">{{formdateyear}}年</view>
				<view class="datem">{{formdatemonth}}月<text class="iconfont icon-xiajiantou icon"></text></view>
			</picker>
			<!-- 分割线 -->
			<div class="line"></div>
			<!-- 右边收入支出 -->
			<view class="in">
			  <text>收入</text>
			  <text>{{totalin}}</text>
			</view>
			<view class="out">
			  <text>支出</text>
			  <text>-{{totalout}}</text>
			</view>
		</view>
		<!-- 账单明细列表 -->
		<view v-for="(list,i) in arrayDetailList" :key="i">
			<uni-card :title="list.addtime" mode="basic" isShadow="true" >
				<view @click="goDetail(item.id)" class="content-item" v-for="(item,index) in list.subList" :key="index">  <!-- 如果直接写成v-for="item in list.subList" :key="item.id" 则点击事件里item.id的取值是undefined，必须写成左边那种格式，并且这是嵌套循环，得每个循环都这样写 -->
					<view class="left">
						<image :src="item.icon" mode=""></image>
						<text>{{item.tagname}}--</text>
						<text>{{item.remarks}}</text>
					</view>
					<view class="right">
						<text v-if="item.consumetype == 'outType'">-{{item.money}}</text>
						<text v-else>{{item.money}}</text>
					</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dateVal: '',
				formdateyear: '',
				formdatemonth: '',
				totalout: 0,
				totalin: 0,
				filtertime: '',
				alldetails:[],
				oldDetailList:[],
				arrayDetailList:[]
			}
		},
		onLoad() {
			// 初始化当前日期
			this.dateVal = new Date();
			this.filtertime = this.$myformatDate(this.dateVal,0);
			// 格式化成年月
			this.formdateyear = this.$myformatDate(this.dateVal,3);
			this.formdatemonth = this.$myformatDate(this.dateVal,4);
			this.getAllDetail();
		},
		onPullDownRefresh() {
			this.getAllDetail();
			setTimeout( ()=> {
				uni.stopPullDownRefresh(); // 0.5s之后触发（异步）
				console.log('加载完成，更新数据');
			}, 500); // 下拉刷新持续显示0.5s
		},
		onShow() {
			let isRefresh = getApp().globalData.myDetailRefresh;
			console.log(isRefresh);
			if(isRefresh == true) {
				
				this.getAllDetail();
				getApp().globalData.myDetailRefresh = false;
			}
		},
		methods: {
			// 获取数据列表
			async getAllDetail (){
				this.oldDetailList = [];
				this.arrayDetailList = [];
				this.totalout = 0,
				this.totalin = 0;
				const res = await this.$myRuquest({
					url: '/api/getDetail',
					
				})
				let msgtype = typeof res.data.message;
				if (msgtype == typeof ''){
					uni.showToast({
						title: res.data.message,
						icon:'none',
						duration: 2000
					});
				} else {
					let alldata = res.data.message;
					// 筛选当前日期列表
					this.filterTime(alldata);
					this.arrayDetailList = this.arrayDetail(this.oldDetailList);
					this.totalGoings();
					console.log(this.arrayDetailList);
				}
			},
			
			// 选择日期
			dateChange(e) {
			    this.dateVal = e.target.value.slice(0,7);
				this.filtertime = this.dateVal;
				this.formdateyear = e.target.value.slice(0,4);
				this.formdatemonth = e.target.value.slice(5,7);
				this.getAllDetail();
			 },
			
			//筛选当前日期列表
			filterTime(p){
				// console.log(p)
			  p.forEach((element,i) => {
			    if (this.filtertime.substring(0,7) == element.addtime.substring(0,7) ) {
			    // console.log('筛选的数据：' + JSON.stringify(element)); //重点!!一定要用JSON.stringify
			    //   console.log('当月的时间：' + this.filtertime.substring(0,7) + '后台数据的' +element.addtime.substring(0,7));
			      this.oldDetailList.push(element);
			    }
			  })
			  this.compare(this.oldDetailList);
			},
			// 排序方法--降序，最新日期在前
			compare(list){
			    for (let i=0;i<list.length;i++){
			        for (let j=i;j<list.length;j++){
			          let comparetimei = this.$myformatDate(list[i].addtime,0);
			          let comparetimej = this.$myformatDate(list[j].addtime,0);
			            if(new Date(comparetimej.replace(/-/,'/')) - new Date(comparetimei.replace(/-/,'/'))>0){
			                let listObj=list[i];
			                list[i]=list[j];
			                list[j]=listObj;
			            }
			        }
			    }
			    return list;
			},
			// 按日期分组
			arrayDetail(data) {
			  //定义一个空数组
			  let newArr = [];
			  //通过forEach循环数组
			  data.forEach((item, i) => {
				let ft = this.$myformatDate(item.addtime,0);
			    let index = -1;
			    //然后在跑到这里筛选 根据不同的时间放置不同的数组    some（）用来查找数组中是否存在某个值  如果存在 就return true
			    let isExists = newArr.some((newItem, j) => {
			      if (ft == newItem.addtime) {
			        index = j;
			        return true;
			      }
			    });
			    //代码是先跑这里的if条件判读
			    if (!isExists) {
			      newArr.push({
			        addtime: this.$myformatDate(item.addtime,0),
			        subList: [item],
			      });
			    } else {
			      newArr[index].subList.push(item);
			    }
			  });
			  return newArr;
			},
			//支出计算
			totalGoings() {
			  let total = 0;
			  let _this = this;
			  for (let i = 0; i < _this.oldDetailList.length; i++) {
			    if (_this.oldDetailList[i].consumetype == "outType") {
			      _this.totalout += parseFloat(_this.oldDetailList[i].money);
			    
			    } else if (_this.oldDetailList[i].consumetype == "inType") {
			      _this.totalin += parseFloat(_this.oldDetailList[i].money);
			    }
			  }
			},
			// 跳转到详情
			goDetail (id) {
				console.log(id);
				uni.navigateTo({
					url: '/pages/detail/detailMore?id='+id
				})
			}
		}
	}
</script>

<style>
.topArea {
  /* width: 100%; */
  height: 70px;
  background-color: #ffa800;
  display: flex;
  padding-top: 10px !important;
  justify-content: space-around;
}
/* 日期控件 */
.date {
	height: 44px;
}
.date .arrow {
	width: 8px;
	height: 8px;
	border-bottom: 2px solid #000000;
	border-left: 2px solid #000000;
	transform: rotate(-45deg);
	margin: 0 0 4px 6px;
	display: inline-block;
}
.datey {
	font-size: 14px;
}
.datem {
	font-size: 18px;
	font-weight: 600;
}
.datem .icon {
	margin-left: 4px;
}

.line {
  border-left: 2px solid #000000;
  height: 34px;
  margin-top: 5px;
  margin-left: -40px;
}
/* 支出收入 */
.in,.out {
	display: flex;
	flex-direction: column;
}
.in text:nth-child(2),.out text:nth-child(2){
	font-size: 18px;
}
/* 账单明细列表 */
.content-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: nowrap;
	padding: 8px 0;
}
.left {
  display: flex;
  justify-content: center;
  
}
.left image {
  border: 1px solid #ffa800;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  padding: 6px;
}
.left text {
  font-size: 16px;
  line-height: 38px;
  margin-left: 6px;
  color: #000000;
}
.right {
  float: right;
  line-height: 38px;
}
.right text {
  font-size: 16px;
  color: #666;
}
</style>
