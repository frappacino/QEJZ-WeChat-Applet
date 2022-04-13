<template>
	<view ref= "scroll" @touchstart="handleTouchStart" @touchend="handleTouchEnd"  @touchmove="handleTouchMove">
		<view class="datetype">
			<view class="showTime">
				<picker mode="date" :value="dateVal" fields="month" :start="startDate" :end="endDate" @change="dateChange" class="date">
					<view class="datey">{{formdateyear}}年</view>
					<view class="datem">{{formdatemonth}}月<text class="iconfont icon-xiajiantou icon"></text></view>
				</picker>
			</view>
			<button class="btn" type="default" @click="changeType">{{btntype}}</button>
		</view>
		<!-- 日期 -->
		<!-- 图表 -->
		<view v-if="haveCounts">
			<view id="myChart" ref="chart" style="width: 100%; height: 200px">
				<qiun-data-charts
				    type="pie"
				    :chartData="chartData"
				    background="none"
					:opts="{legend:{position: 'top'},extra:{radar:{border:true}}}"
				  />
			</view>
		</view>
		<view v-else>
			<view id="myChart" ref="chart" style="width: 100%; height: 200px">
				<qiun-data-charts
				    type="pie"
				    :chartData="nullChartData"
				    background="none"
					:opts="{legend:{position: 'top'},extra:{radar:{border:true}}}"
				  />
			</view>
		</view>
		
		<!-- 列表区域 -->
		<view v-if="haveCounts">
		  <view class="listArea" v-for="(item, k) in indexDetail" :key="k">
		    <view class="listItem">
		      <view class="listLeft">
		        <image :src="item.listicon" alt="" />
		        <text>{{ item.piename }}</text>
		      </view>
		      <view class="listRight">
		        <view class="listMoney">{{ item.pievalue }}元</view>
		        <view class="listBI">{{ item.listbi }}笔</view>
		      </view>
		    </view>
		  </view>
		</view>
		<view v-else class="listAreano">
		  <view class="listItemno"><text>没有数据哦！</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"circlechart",
		props: ["fuScrollTop","fupdrf"],
		data() {
			return {
				startX: 0,
				moveWidth: 0,
				dateVal: '',
				filtertime: '',
				formdateyear: '',
				formdatemonth: '',
				haveCounts: false, //是否有数据
				oldDetailList: [], //筛选过日期的数据
				indexDetail: [], //整理好的给账单分类列表的数据
				echartsDetail: [], //整理好的给echarts图表的数据
				innewDetail: [], //收入数据
				outnewDetail: [], //支出数据
				btntype: "支出", //支出收入的文字显示
				toglbtn: true, //控制支出收入的切换
				chartData: {
					// categories:[],
					"series": [
					        {
					            "data": [
					                {
					                    "name": "一班",
					                    "value": 50
					                },
					                {
					                    "name": "二班",
					                    "value": 30
					                },
					                {
					                    "name": "三班",
					                    "value": 20
					                },
					                {
					                    "name": "四班",
					                    "value": 18
					                },
					                {
					                    "name": "五班",
					                    "value": 8
					                }
					            ]
					        }
					    ]
				},
				nullChartData: {
					// categories:[],
					"series": [
					        {
					            "data": [
					                {
					                    "name": "无数据",
					                    "value": 0
					                },
					                
					            ]
					        }
					    ]
				}
			};
		},
		created() {
			// 初始化当前日期
			this.dateVal = new Date();
			this.filtertime = this.$myformatDate(this.dateVal,0);
			// 格式化成年月
			this.formdateyear = this.$myformatDate(this.dateVal,3);
			this.formdatemonth = this.$myformatDate(this.dateVal,4);
			this.getAllDetail();
		},
		methods: {
			// 获取数据列表
			async getAllDetail (){
				this.oldDetailList = []; //防止每次刷新数据重复叠加
				console.log('图表加载');
				const res = await this.$myRuquest({
					url: '/api/getDetail'
				})
				let alldata = res.data.message;
				this.filterTime(alldata); // 筛选当前日期列表
				this.arrayDetailList = this.arrayDetail(this.oldDetailList); // 按标签分组
				this.inORout(this.arrayDetailList);
				this.echartsdata(this.outnewDetail);
			},
			// 选择日期
			dateChange(e) {
			    this.dateVal = e.target.value.slice(0,7);
				this.filtertime = this.dateVal;
				this.formdateyear = e.target.value.slice(0,4);
				this.formdatemonth = e.target.value.slice(5,7);
				this.oldDetailList = [];
				this.getAllDetail();
				this.toglbtn = true;
				this.btntype = "支出";
			 },
			// 筛选当前日期列表
			filterTime(p) {
			  p.forEach((element, i) => {
			    if (
			      this.filtertime.substring(0, 7) == element.addtime.substring(0, 7)
			    ) {
			      // console.log('筛选的数据：' + JSON.stringify(element)); //重点!!一定要用JSON.stringify
			      //   console.log('当月的时间：' + this.filtertime.substring(0,7) + '后台数据的' +element.addtime.substring(0,7));
			      this.oldDetailList.push(element);
			    }
			  });
			},
			// 按标签分组
			arrayDetail(data) {
			  //定义一个空数组
			  let newArr = [];
			  //通过forEach循环数组
			  data.forEach((item, i) => {
			    let index = -1;
			    //然后在跑到这里筛选 根据不同的时间放置不同的数组    some（）用来查找数组中是否存在某个值  如果存在 就return true
			    let isExists = newArr.some((newItem, j) => {
			      if (item.tagname == newItem.tagname) {
			        index = j;
			        return true;
			      }
			    });
			    //代码是先跑这里的if条件判读
			    if (!isExists) {
			      newArr.push({
			        tagname: item.tagname,
			        subList: [item],
			      });
			    } else {
			      newArr[index].subList.push(item);
			    }
			  });
			  return newArr;
			},
			//整理支出还是收入的数据
			inORout(detail) {
			  let b = [];
			  let c = [];
			  for (var i = 0; i < detail.length; i++) {
			    for (var j = 0; j < detail[i].subList.length; j++) {
			      if (detail[i].subList[j].consumetype == "inType") {
			        c.push(detail[i].subList[j]);
			      } else if (detail[i].subList[j].consumetype == "outType") {
			        b.push(detail[i].subList[j]);
			      }
			    }
			  }
			  this.innewDetail = this.arrayDetail(c);
			  this.outnewDetail = this.arrayDetail(b);
			},
			// 整理图表数据
			echartsdata(typeDetail) {
				this.totalout = 0,
				this.totalin = 0;
				var oldsum = 0;
				var sum = 0; //此分类金额总数
				var tgnam = ''; //此分类名字
				var tgico = ""; //此分类icon
				var num = 0; //此分类笔数
				
				this.indexDetail = [];
				this.echartsDetail = [];
				if (typeDetail.length !== 0) {
					for (var i = 0; i < typeDetail.length; i++) {
						for (var j = 0; j < typeDetail[i].subList.length; j++) {
							sum += parseFloat(typeDetail[i].subList[j].money.toFixed(2));
							tgico = typeDetail[i].subList[0].icon;
						}
						tgnam = typeDetail[i].tagname;
						num += typeDetail[i].subList.length;
						this.haveCounts = true;
						this.indexDetail.push({
							listbi: num,
							listicon: tgico,
							pievalue: sum,
							piename: tgnam,
						})
						this.echartsDetail.push({
							value: sum,
							name: tgnam
						});
						sum = 0;
						num = 0;
					}
					// console.log(this.echartsDetail);
					this.chartData.series[0].data = this.echartsDetail;
				} else {
					console.log("没有");
					this.haveCounts = false;
					this.echartsDetail.push({
						value: 0,
						name: '无',
					});
				}
				this.compare(this.indexDetail);
			},
			// 按钮切换支出还是收入
			changeType() {
			  this.toglbtn = !this.toglbtn;
			  if (this.toglbtn == true) {
			    this.btntype = "支出";
			    this.echartsdata(this.outnewDetail);
			    // console.log(this.btntype + this.toglbtn);
			  } else if (this.toglbtn == false) {
			    this.btntype = "收入";
			    this.echartsdata(this.innewDetail);
			    // console.log(this.btntype + this.toglbtn);
			  }
			},                                            
			// 排序方法--降序，金额最多在前
			compare(list) {
			  for (let i = 0; i < list.length; i++) {
			    for (let j = i; j < list.length; j++) {
			      if (list[j].pievalue - list[i].pievalue > 0) {
			        let listObj = list[i];
			        list[i] = list[j];
			        list[j] = listObj;
			      }
			    }
			  }
			  return list;
			},
			// 开始触摸
			handleTouchStart(event) {
				// console.log(event.touches[0]);
			  let touch = event.touches[0];
			  this.startX = Number(touch.pageY);
			},
			handleTouchMove(event) {
				
			  // 1.获取第一个触点
			  let touch = event.touches[0];
			  // 2.求出移动的距离
			  this.moveWidth = Number(touch.pageY) - this.startX;
			},
			handleTouchEnd() {
				console.log(this.fuScrollTop);
				// console.log(this.$refs.scroll.getBoundingClientRect().top);
				if(this.moveWidth > 0 && this.fuScrollTop == 0 && this.fupdrf == '1') {
					this.getAllDetail();
					setTimeout(function () {
						uni.showToast({
							icon:'success',
							title:'刷新成功'
						})
						uni.stopPullDownRefresh();
					}, 1000);
				}
			}
		}
	}
</script>

<style>
/* 日期控件 */
.datetype {
	display: flex;
	justify-content: space-between;
	margin-top: 10px;
}
.date {
	height: 44px;
	margin-left: 10px;
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
	font-size: 16px;
	margin-left: 4px;
}
.btn {
	margin-right: 10px;
	background-color: #FFA800 !important;
}
/* 列表 */
/* 无数据列表 */
.listAreano {
  border-top: 1px solid #ffa800;
}
.listItemno {
  padding: 5px 20px;
  border-bottom: 1px solid #ffa800;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
}
/* 有数据列表 */
.listArea {
  border-top: 1px solid #ffa800;
}
.listItem {
  padding: 5px 20px;
  border-bottom: 1px solid #ffa800;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}
.listLeft {
  display: flex;
  align-items: center;
}
.listLeft image {
  width: 36px;
  height: 36px;
  border: 1px solid #ffa800;
  border-radius: 50%;
  padding: 6px;
}
.listLeft text {
  display: block;

  margin-left: 10px;
}
.listRight {
  display: flex;
}
.listMoney {
  height: 34px;
  line-height: 34px;
  border-right: 1px solid #ffa800;
  padding-right: 6px;
  margin-right: 6px;
}
.listBI {
  height: 34px;
  line-height: 34px;
}/* 列表 */
/* 无数据列表 */
.listAreano {
  border-top: 1px solid #ffa800;
}
.listItemno {
  padding: 5px 20px;
  border-bottom: 1px solid #ffa800;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
}
/* 有数据列表 */
.listArea {
  border-top: 1px solid #ffa800;
}
.listItem {
  padding: 5px 20px;
  border-bottom: 1px solid #ffa800;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}
.listLeft {
  display: flex;
  align-items: center;
}
.listLeft image {
  width: 30px;
  height: 30px;
  border: 1px solid #ffa800;
  border-radius: 50%;
  padding: 6px;
}
.listLeft text {
  display: block;

  margin-left: 10px;
}
.listRight {
  display: flex;
}
.listMoney {
  height: 34px;
  line-height: 34px;
  border-right: 1px solid #ffa800;
  padding-right: 6px;
  margin-right: 6px;
}
.listBI {
  height: 34px;
  line-height: 34px;
}
</style>
