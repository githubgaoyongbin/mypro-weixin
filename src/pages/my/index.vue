<template>
  <div>
    <button open-type="openSetting">打开授权</button>
    <button @click="getUserLocation">获取用户定位</button>
  </div>
</template>

<script>
export default {
  methods: {
    getUserLocation(){
      wx.getLocation({
        type: 'wgs84', //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标,
        success: res => {
          console.info("getLocation success: ", res);
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const accuracy = res.accuracy
        },
        fail: () => {
          console.log("getLocation failed")
        }
      });
    }
  },
}
</script>

<style>

</style>

