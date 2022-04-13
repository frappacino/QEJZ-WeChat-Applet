<template>
	<view>
		<view class="topArea">
			<!-- 支出收入的切换按钮 -->
			<view class="toggle">
				<view class="out" @click="changeType($event)" :class="isActive == 'outType' ? 'active': ''" id="out">
					<text>支出</text>
				</view>
				<view class="in" @click="changeType($event)" :class="isActive == 'inType' ? 'active': ''" id="in">
					<text>收入</text>
				</view>
			</view>
		</view>
		<!-- 标签分类选择 -->
		<view class="tag_content" >
			<view class="tag_area" @touchstart="handleTouchStart" @touchend="handleTouchEnd" @touchmove="handleTouchMove">
				<view class="tag_item" v-for="(item, index) in tagList" :key="index" @click="sendTag(index)">
					<image :src="item.icon" mode="" :class="whichTag == index ? 'addclass' : '' "></image>
					<view class="">
						{{item.tagname}}
					</view>
				</view>
			</view>
		</view>
		<!-- 进度条 -->
		<view class="tag_bottom">
		  <view class="tag_bottom_inner" :style="{width:barXWidth + 'px',left:barMoveWidth + 'px'}"></view>
		</view>
		<!-- 日期和金额 -->
		<view class="dateMoney">
			<view class="dateArea">
				<view class="showTime">
					<picker mode="date" :value="filtertime" fields="day" :start="startDate" :end="endDate" @change="dateChange" class="date">
						<view class="datem">{{filtertime}}</view>
					</picker>
				</view>
			</view>
			<input class="moneyArea" type="text" placeholder="0" v-model="money"/>
		</view>
		<!-- 备注 -->
		<view class="remarks">
			<text>备注：</text>
			<input type="text" value="" v-model="remarks"/>
		</view>
		<view class="btn">
			<!-- 删除 -->
			<view class="delete">
				<button type="default" @click.stop="clickDelCounts"><text>删除</text></button>
			</view>
			<!-- 保存 -->
			<view class="save">
				<button type="default" @click="clickEditCounts"><text>保存</text></button>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 1.屏幕的宽度
				screenW: 0,
				// 2.滚动内容的宽度
				scrollContentW: 1000,
				// 3.滚动条背景的长度
				bgBarW: 100,
				// 4.滚动条的长度
				barXWidth: 0,
				// 5.起点
				startX: 0,
				// 6.记录结束点
				endFlag: 0,
				// 7.移动的距离
				barMoveWidth: 0,
				tagList: [],
				dateVal: '',
				filtertime: '',
				addtime: '',
				money: null,
				remarks: '',
				activeTag: {},
				consumeType: '',
				newTagList: {},
				whichTag: 0,
				isActive: '',
				id: 0,
				selectedDetail: []
			}
		},
		onLoad(options) { //options是网址里的对象
			this.id = options.id;	//把此时网址的ID赋值给这个页面的ID来渲染
			console.log(this.id);
			this.getAllTag();
			this.screenW = uni.getSystemInfoSync().screenWidth;
			this.getDataList();
		},
		onShow() {
			
			this.getBottomBarWidth();
			let isRefresh = getApp().globalData.mytagrefresh;
			console.log(isRefresh);
			if(isRefresh == true) {
				this.getAllTag();
				getApp().globalData.mytagrefresh = false;
			}
			
		},
		methods: {
			// 获取分类标签数据列表
			async getAllTag() {
				const res = await this.$myRuquest({
					url: '/api/getTag'
				})
				this.tagList = res.data.message;
				// console.log(this.tagList);
			},
			// 获取此条账单具体数据
			async getDataList() {
				const res = await this.$myRuquest({
					url: '/api/getSelectedDetail/'+this.id
				})
				this.selectedDetail = res.data.message[0];
				// console.log(this.selectedDetail);
				this.filtertime = this.$myformatDate(this.selectedDetail.addtime);
				this.isActive = this.selectedDetail.consumetype;
				this.consumeType = this.selectedDetail.consumetype;
				
				this.money = this.selectedDetail.money;
				this.remarks = this.selectedDetail.remarks;
				for ( let i in this.tagList) {
					if (this.tagList[i].tagname == this.selectedDetail.tagname) {
						
						this.whichTag = i;
						this.$set(this.newTagList, "icon", this.tagList[i].icon);
						this.$set(this.newTagList, "tagname", this.tagList[i].tagname);
						
					}
				}
				// console.log(this.newTagList);
			},
			
			// 编辑账单
			async editSelectedDetail (){
				const res = await this.$myRuquest({
					url: '/api/editDetail',
					method: 'post',
					data: this.newTagList, //一定得是对象，不能是数组
					header: {'content-type': 'application/x-www-form-urlencoded'}
				})
				// console.log(res);
			},
			// 删除账单
			async delSelectedDetail (){
				const res = await this.$myRuquest({
					url: '/api/deleteDetail/'+this.id
				})
				
			},
			// 选择日期
			dateChange(e) {
				this.dateVal = e.target.value;
				this.filtertime = this.dateVal;
			},
			// 支出收入按钮改变
			changeType(e) {
			  if (e.currentTarget.id == "out") {
			    this.isActive = 'outType';
				this.consumeType = this.isActive;
			  } else if (e.currentTarget.id == "in"){
			    this.isActive = 'inType';
				this.consumeType = this.isActive;
			  }
			},
			//被选中的tag
			sendTag(index) {
			  this.newTagList = this.tagList[index];
			  //同时给被选中的添加激活样式
			  this.whichTag = index;
			},
			//保存编辑账单
			clickEditCounts() {
				if (this.money == null) {
					uni.showToast({
						title: '请输入金额',
						icon:'none',
						duration: 1000
					});
					return
				}
			  this.addtime = this.filtertime;
			  this.$set(this.newTagList, "addtime", this.addtime);
			  this.$set(this.newTagList, "money", this.money);
			  this.$set(this.newTagList, "remarks", this.remarks);
			  this.$set(this.newTagList, "consumetype", this.consumeType);
			  this.$set(this.newTagList, "id", this.id);
			  // console.log(this.newTagList);
				this.editSelectedDetail();
				// uni.request({
				// 	url: 'http://localhost:3000/api/editDetail',
				// 	method: 'POST',
				// 	data: this.newTagList,
				// 	header: {
				// 		'Content-Type': 'application/x-www-form-urlencoded', 
				// 	},
				// 	success: (res) => {
				// 		console.log(res.data);
				// 	}
				// })
			  // 重置数据
			  this.dateVal = new Date();
			  this.money = null;
			  this.remarks = '';
			  this.consumeType = '';
			  this.newTagList = this.tagList[0];
			  // 跳转至账单明细页面
			  getApp().globalData.myDetailRefresh = true;
			  // getApp().globalData.myChartRefresh = true;
			  setTimeout(()=>{
				  uni.switchTab({
				  	url: '/pages/detail/detail'
				  })
			  })
			  
			},
			// 删除选中账单
			clickDelCounts() {
				let that = this;
				uni.showModal({
				    title: '提示',
				    content: '确定要删除此条账单吗？',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							that.delSelectedDetail();
							// 跳转至账单明细页面
							getApp().globalData.myDetailRefresh = true;
							getApp().globalData.myChartRefresh = true;
							setTimeout(()=>{
							  uni.switchTab({
							  	url: '/pages/detail/detail'
							  })
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			// 获取滚动条的长度
			getBottomBarWidth() {
			  this.barXWidth = this.bgBarW * (this.screenW / this.scrollContentW);
			},
			// 开始触摸
			handleTouchStart(event) {
			  let touch = event.touches[0];
			  this.startX = Number(touch.pageX);
			},
			handleTouchMove(event) {
			  // 1.获取第一个触点
			  let touch = event.touches[0];
			  // 2.求出移动的距离
			  let moveWidth = Number(touch.pageX) - this.startX;
			  // 3.求出滚动条走的距离
			  this.barMoveWidth = -(
			    (this.bgBarW / this.scrollContentW) * moveWidth -
			    this.endFlag
			  );
			  // 4.边界值处理
			  if (this.barMoveWidth <= 0) {
			    this.barMoveWidth = 0;
			  } else if (this.barMoveWidth >= this.bgBarW - this.barXWidth) {
			    this.barMoveWidth = this.bgBarW - this.barXWidth;
			  }
			},
			handleTouchEnd() {
				console.log(this.barXWidth);
				this.endFlag = this.barMoveWidth;
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

	/* 分类 */
	/* 激活样式 */
	.addclass {
	  border: 2px solid #ffa800;
	  border-radius: 50%;
	  background-color: #ffa800;
	}
	.tag_content {
		margin: 10px 0;
		width: 100%;
		overflow-x: scroll;
	}

	.tag_area {
		width: 630px;
		height: 140px;
		display: flex;
		flex-wrap: wrap;
	}

	.tag_item {
		width: 70px;
		height: 70px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		color: #666;
	} 

	.tag_item image {
		width: 60%;
		padding: 2px;
		margin-bottom: 5px;
	}
	.tag_content::-webkit-scrollbar {
	  display: none;
	}
	/* 进度条 */
	.tag_bottom {
	  position: absolute;
	  width: 100px;
	  height: 2px;
	  background-color: #ccc;
	  margin: 10px auto;
	  left: 50%;
	  transform: translateX(-50%);
	}
	.tag_bottom_inner {
		position: absolute;
	  height: 100%;
	  background-color: #ffa800;
	  width: 10px;
	}
	/* 日期金额 */
	.dateMoney {
		display: flex;
		margin-top: 40px;
		padding-bottom: 10px;
		justify-content: space-between;
		border-bottom: 1px solid rgb(236, 236, 236);
	}

	.dateArea {
		margin-left: 40px;
	}

	.dateArea .showTime {
		color: #333;
		line-height: 22px;
	}

	.moneyArea {
		margin-right: 40px;
		width: 20%;
		height: 10px;
		text-align: right;
		border: none;
	}

	/* 备注 */
	.remarks {
		display: flex;
		margin-top: 6px;
		/* justify-content: space-around; */
		border-bottom: 1px solid rgb(236, 236, 236);
	}

	.remarks text {
		width: 16%;
		height: 30px;
		line-height: 30px;
		margin-left: 40px;
	}

	.remarks input {
		height: 30px;
		margin-right: 40px;
		margin-bottom: 6px;
		border: 0;
		/* 去除input默认边框 */
	}
	.btn {
		display: flex;
		justify-content: space-around;
		margin-top: 50px;
	}
	/* 删除 */
	
	.delete button {
	  color: #fff;
	  background-color: #666;
	  width: 100px;
	  font-size: 20px;
	  border-radius: 10px;
	}
	/* 保存 */
	
	.save button {
		color: #fff;
		background-color: #ffa800;
		width: 100px;
		font-size: 20px;
		border-radius: 10px;
	}
</style>
