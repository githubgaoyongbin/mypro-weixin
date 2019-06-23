<template>
  <div>
    <view class="empty-car" v-if="isEmpty">
      <image src="/static/img/kong.png"></image>
      <text class="empty-car-tips">购物车还是空的</text>
      <text class="empty-car-tips extra">快去逛逛吧~</text>
    </view>
    <view v-else>
      <!-- 头部 -->
      <view class="shop-head">
        <view class="shop-head-info">
          <view class="iconfont icon-shop flex-center icon-dianpu"></view>
          <text class="shop-name">品优购生活馆</text>
        </view>
      </view>
      <!-- 列表 -->
      <block v-for="item in goodsList" :key="item.goods_id">
        <view class="goods-item">
            <!-- 左边选中的图标 -->
            <view @click="toggleSelect(item)" :class="['pubIcon',item.isSelect ? 'trueIcon' : 'falseIcon']"></view>
            <!-- 中间的图片 -->
            <view class="goods-item-pic">
              <image :src="item.goods_small_logo"/>
            </view>
            <!-- 右边的商品信息 -->
            <view class="goods-item-info">
              <text class="goods-item-info-title">{{item.goods_name}}</text>
              <text class="goods-item-info-price">￥{{item.goods_price}}</text>
              <view class="goods-item-info-edit">
                <view class="outer">
                  <view :style="{'color':item.goods_number == 1 ? '#ccc' : 'black'}" @click="substrict(item)">-</view>
                  <view class="value">
                    <input
                      style="font-size:12px;color:#999;"
                      v-model="item.goods_number"
                      @input="changeValue(item)"
                      type="number"
                    /></view>
                  <view @click="add(item)" class="add">+</view>
                </view>
                <text @click="deleteGoods(item)">| 删除</text>
              </view>
          </view>
        </view>
      </block>
      <!-- 工具条 -->
      <view class="fixed-bar">
        <view @click="toggleAllSelect" class="allselect">
          <!-- 左边选中的图标 -->
          <view :class="['pubIcon',allSelected ? 'trueIcon' : 'falseIcon']"></view>
          <text style="margin-left:10rpx;color:#999;">全选</text>
        </view>
        <view class="statistics">
          <view>
            <text>合计：</text>
            <text style="color:#ff2d4a;font-size:30rpx;">￥{{totalPrice}}</text>
          </view>
          <view>
            <text>包含运费</text>
          </view>
        </view>
        <view @click="goToOrderAndPay" :class="['jiesuan',totalCount === 0 ? 'disabled':'']">
          <text>去结算 ({{totalCount}})</text>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
  // 按需导入获取本地数据的方法还有修改商品数据的方法
  import {getLocalGoods,updateGoods,deleteGoods} from '../../common/cart'
  export default {
    data() {
      return {
        isEmpty:true, // 判断是否有数据
        allSelected:true, //全选
        goodsList:[] // 商品列表
      }
    },
    methods: {
       async getGoodsListData(){
      // 拿到本地的商品信息
      const localGoods = getLocalGoods()
      // 获取商品数据对应的id  组成数组
      const ids = Object.keys(localGoods)
      // console.log(ids)
      // 判断有误加入购物车 无加入购物车的话  显示空的购物车
      if (ids.length === 0){
        this.isEmpty = true
        return
      }

      this.isEmpty = false

      // 从本地拿到商品id的集合 拿到对应参数发送请求获取对应数据的页面
      const res = await this.$axios.get(`goods/goodslist?goods_ids=${ids.join(',')}`)

      // 一定要先把数据处理好，然后再赋值
      res.data.message.forEach(item => {
        // 给对象添加上商品数量的属性  商品数量从本地拿
        item.goods_number = localGoods[item.goods_id]
        // 默认选中的状态
        item.isSelect = true
      })
      
      this.goodsList = res.data.message
    },
    // 全选与反选
    toggleAllSelect(){
      // 点击取反
      this.allSelected=!this.allSelected;
      // 遍历数组所有的项  全选居中
      this.goodsList.forEach(item=>{
        item.isSelect=this.allSelected
      }) 
    },
    // 点击单选
    toggleSelect(item){
      // 点击后取反
      item.isSelect=!item.isSelect
      // 使用数组的some方法来提高性能 
      // 使用开关思想
      let allSelected=true;
      this.goodsList.some(item =>{
        if(item.isSelect==false){
          allSelected=false
          return true  //只要有一个为false 立即结束
        }
      })
      this.allSelected=allSelected
    },
    // 减少商品数量的点击事件
    substrict(item){
      if(item.goods_number<=1){
        return
      }
      // 点击商品数量减1
      item.goods_number--
      // 保存回本地
      updateGoods(item)
    },
    // 添加商品数量的点击事件
    add(item){
      // 点击商品数量+1
      item.goods_number++
      // 再保存回本地
      updateGoods(item)
    },
    // 删除商品数据
    deleteGoods(item){
     wx.showModal({
       title: '提示', //提示的标题,
       content: '是否删除该商品', //提示的内容,
       showCancel: true, //是否显示取消按钮,
       cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
       cancelColor: '#000000', //取消按钮的文字颜色,
       confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
       confirmColor: '#3CC51F', //确定按钮的文字颜色,
       success: res => {
         if (res.confirm) {
            //确定的话删除数据后 对应也要删除数组中的数据
            // 找到对应的要删除数据的id的索引
            let index=this.goodsList.findIndex(item1=>item1.goods_id===item.goods_id)  
            // 从数组中删除该索引
            this.goodsList.splice(index,1);
            // 从本地的存储中删除该数据
           deleteGoods(item.goods_id);
            // 删除完数据还要判断下 购物车中有无商品
            this.isEmpty= this.goodsList.length===0
         } else if (res.cancel) {
           console.log('用户点击取消')
         }
       }
     });
    },
    // 跳回支付的页面
    goToOrderAndPay(){
      let ids=[]
      this.goodsList.forEach(item=>{
        if(item.isSelect){
          // 判断是否选中 选中的话将对应商品的id添加到新的数组里面去
          ids.push(item.goods_id)
        }
      })
      // 判断结算的是否为空(疑问 可以判断当前total的数量么)
      if(ids.length===0){
        // 弹出页面提示
        wx.showToast({
          title: '请选择商品结算', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        return
      }
      // 导航跳转到支付的页面
      wx.navigateTo({ url: "/pages/pay/main?ids='+ids.join(',')" });
    }
    },
    computed: {
      // 使用计算属性来计算商品的总和
      // 先检测总价
      totalPrice(){
        let TotalPrice=0;
        this.goodsList.forEach(item=>{
          // 判断有无选中
          if(item.isSelect){
            TotalPrice+=item.goods_number*item.goods_price
          }
        })
        return TotalPrice;
      },
      // 计算数量
      totalCount(){
        let totalCount=0;
        this.goodsList.forEach(item=>{
          // 判断有无选中
          if(item.isSelect){
            // 总数等于选中的数量累加
            totalCount+=item.goods_number;
          }
        })
        return totalCount
      }
    },
      onShow(){
      // 从详情页的购物车跳过来的时候  onLoad只加载一次 所以用onshow
      this.getGoodsListData();
    },

  }
</script>
<style lang="less" scoped>
@PADDING-LEFT: 20rpx;
.empty-car {
  display: flex;
  flex-direction: column;
  height: 500rpx;
  justify-content: center;
  align-items: center;
  image {
    width: 125rpx;
    height: 124rpx;
  }
  &-tips {
    margin-top: 30rpx;
    font-size: 28rpx;
    color: #666;
  }
}
.extra {
  font-size: 24rpx;
  color: #999;
}
.shop-head {
  background-color: #fff;
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 @PADDING-LEFT;
  border-bottom: 1px solid #ddd;
  &-info {
    display: flex;
    align-items: center;
    .shop-name {
      margin-left: 10rpx;
    }
  }
}
.goods-item {
  height: 220rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding-left: @PADDING-LEFT;
  border-bottom: 1px solid #eee;
  &-pic {
    width: 160rpx;
    height: 160rpx;
    margin-left: 10rpx;
    border: 1px solid #ddd;
    padding: 10rpx;
    border-radius: 5rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  &-info {
    flex: 1;
    height: 180rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0rpx @PADDING-LEFT;
    &-title {
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    &-price {
      color: #ff2d4a;
      font-size: 30rpx;
    }
    &-edit {
      display: flex;
      justify-content: space-between;
      .outer {
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        border-radius: 5rpx;
        view {
          height: 50rpx;
          width: 50rpx;
          line-height: 50rpx;
          text-align: center;
        }
        .value {
          width: 65rpx;
          border-left: 1px solid #ddd;
        }
        .add {
          border-left: 1px solid #ddd;
        }
      }
    }
  }
}
.pubIcon {
  background: url(https://mcart.jiuxian.com/statics/images/cart/catIcon.png)
    no-repeat 0 0;
  background-size: 300rpx 300rpx;
  width: 55rpx;
  height: 55rpx;
}
.trueIcon {
  background-position: 0 -225rpx;
}
.falseIcon {
  background-position: -50rpx -225rpx;
}
.fixed-bar {
  display: flex;
  height: 98rpx;
  width: 750rpx;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  .allselect {
    padding-left: @PADDING-LEFT;
    width: 200rpx;
    height: 98rpx;
    display: flex;
    align-items: center;
  }
  .statistics {
    flex: 1;
    display: flex;
    // align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .jiesuan {
    width: 200rpx;
    height: 98rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ff2d4a;
    text {
      color: #fff;
    }
  }

  .disabled {
    background-color: #ddd;
  }
}
</style>

