/**
 * 这是抽取的一个模块 用于操作购物车的数据
 * 新增 修改 删除
 * 练习按需导入
 * 
 */
let key = 'GOODS'
// 导出的模块是从本地获取商品数据的方法
export const getLocalGoods = () => {
    // 获取本地的商品id对应数据 如果没有返回空对象
    return mpvue.getStorageSync(key) || {}
}
/**
 * 
 * @param {*} goods :是一个对象
 */
// 添加商品id对应的数量并且保存本地 获取最新的数据
export const addGoods = goods => {
    // 1.0先取出本地之前存储的商品信息
    const localGoods = getLocalGoods();
    // 2.0 新增我们的商品信息 有些只需要更改商品的数量
    if (localGoods[goods.goods_id]) { //添加的goods是一个对象 判断里面的key :id 再本地有没有存在
        // 存在的话 对应加上传过来的数量
        localGoods[goods.goods_id] += goods.goods_number
    } else {
        // 如果不存在
        localGoods[goods.goods_id] = goods.goods_number
    }
    console.log(localGoods);
    // 3 把添加后的数据保存到本地
    mpvue.setStorageSync(key, localGoods)//对应的key:GOODs  localGoods:对应为存储商品信息的对象
}

//导出一个修改商品信息的数据
export const updateGoods = goods => {
    // 从本地获取对应的数据
    const localGoods = getLocalGoods();
    // 更改goods_number的数量
    localGoods[goods.goods_id] = goods.goods_number
    // 然后保存回去
    mpvue.setStorageSync(key,localGoods)
}

// 导出一个删除商品信息的方法
export const deleteGoods=goods_id=>{
    // 从本地获取对应的数据
    const localGoods=getLocalGoods()
    // 删除对应id的数据
    delete localGoods[goods_id]
    // 保存回去
    mpvue.setStorageSync(key,localGoods)
}