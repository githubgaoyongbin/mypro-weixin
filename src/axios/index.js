import Vue from 'vue'
import axios from 'axios'
// console.log(111,222)

// 设置基准路径
axios.defaults.baseURL = 'https://www.zhengzhicheng.cn/api/public/v1/'

// 适配器
axios.defaults.adapter = function(config){
  // console.log(config)
  return new Promise((resolve,reject) => {
    // 在发送请求之前 显示正在加载的内容
    mpvue.showLoading({
      title: '拼命加载中...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透
    })
    mpvue.request({
      url: config.url,
      data: config.data,
      method: config.method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // todo:
      header: config.headers, // 设置请求的 header
      success: res => {
        resolve(res)
      },
      fail: err => {
        // fail
        reject(err)
      },
      complete(){
        // 请求完成后隐藏提示内容
        mpvue.hideLoading();
      }
    })
  })
}

// 挂载到Vue的原型
Vue.prototype.$axios = axios
