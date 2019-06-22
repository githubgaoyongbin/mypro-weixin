<template>
  <div>
    <!-- 1.0 轮播图 -->
    <swiper indicator-dots autoplay circular indicator-active-color="#fff">
        <block v-for="item in swiperdata" :key="item.id">
            <navigator :url="item.navigator_url">
              <swiper-item>
                  <image mode="aspectFill" :src="item.image_src"></image>
              </swiper-item>
            </navigator>
        </block>
    </swiper>
       <!-- 2.0 分类菜单 -->
    <div class="categories">
      <div class="category-item" v-for="item in catitems" :key="item.name">
        <img :src="item.image_src" alt="">
      </div>
    </div>
        <!-- 3.0 楼层数据 -->
    <div class="floor">
      <div v-for="item in floordata" :key="item.floor_title.name">
        <!-- 头部 -->
        <div class="floor-head">
          <image :src="item.floor_title.image_src" alt="" />
        </div>
        <div class="floor-body">
          <div class="floor-body-left">
            <image :src="item.product_list[0].image_src"/>
          </div>
          <div class="floor-body-right">
            <div v-for="(subitem,index2) in item.product_list" v-if="index2 > 0"  :key="subitem.name">
              <img :style="{width:subitem.image_width+'rpx'}" class="floor-body-right-img" :src="subitem.image_src" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
     <!-- 4.0 到底的提示 -->
    <div class="end-tips">
      <span class="iconfont icon-xiao"></span>
      <span class="bottomline">我是有底线的哦~</span>
    </div>
       <!-- 5.0 回到顶部 -->
    <div v-show="isShowToTop">
      <div @click="goToTop" class="to-top">
        <image src="/static/img/arrow_top@2x.png"/>
        <text>顶部</text>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      swiperdata:[],//轮播图需要的数据
      catitems:[],//分列所需要的数据
      floordata:[],//楼层数据
      isShowToTop:false,//控制显示与隐藏
    }
  },
  onPageScroll({scrollTop}){
    // 为了优化性能 做节流判断
    if(scrollTop>80){
      // 当滚动距离大于80时 不再触发事件
      if(this.isShowToTop) return
      this.isShowToTop=true
    }else{
      // 当滚动距离小于80时  不再触发 更改视图数据
      if(!this.isShowToTop) return
      this.isShowToTop=false
    }
  },
  methods: {
    async getSwiperData(){
      const res = await this.$axios.get('home/swiperdata')
      this.swiperdata = res.data.message
    },
    async getCatitems(){
       const res = await this.$axios.get('home/catitems')
      this.catitems = res.data.message
    },
    async getFloordata(){
        const res = await this.$axios.get('home/floordata')
        this.floordata=res.data.message;
    },
    // 回到顶部的事件
    goToTop(){
      // 调取微信官方的方法
      mpvue.pageScrollTo({
        scrollTop:0,
        duration:300
      })
    }
  },
  onLoad(){
    //加载轮播图数据
    this.getSwiperData();
    // 加载分类数据
    this.getCatitems();
    // 加载楼层数据
    this.getFloordata();
  }
}
</script>

<style lang="less" scoped>
swiper{
  width:750rpx;
  height: 400rpx;
  image{
    width:100%;
    height: 100%;
  }
}
.categories {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #ffffff;
  height: 150rpx;
  .category-item {
    width: 120rpx;
    height: 120rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.floor {
  margin-top: 20rpx;
  background-color: white;
  &-head {
    width: 750rpx;
    height: 59rpx;
    image {
      margin: 10rpx 0rpx 0rpx 10rpx;
      width: 100%;
      height: 100%;
    }
  }
  &-body {
    display: flex;
    padding: 20rpx 16rpx 10rpx 16rpx;
    &-left {
      width: 232rpx;
      height: 386rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    &-right {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      &-img {
        height: 188rpx;
        margin: 0 0 10rpx 10rpx;
      }
    }
  }
}
.end-tips {
  display: flex;
  height: 100rpx;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #888;
  .bottomline {
    margin-left: 5rpx;
  }
}
.to-top {
  width: 90rpx;
  height: 90rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  position: fixed;
  right: 40rpx;
  bottom: 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  image {
    width: 24rpx;
    height: 14rpx;
  }
  text {
    margin-top: 20rpx;
    color: #999;
    font-size: 32rpx;
  }
}
</style>


