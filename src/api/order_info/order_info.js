import request from '@/utils/request'

// 查询订单列表
export function listOrder_info(query) {
  return request({
    url: '/order_info/order_info/list',
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getOrder_info(orderId) {
  return request({
    url: '/order_info/order_info/' + orderId,
    method: 'get'
  })
}

// 新增订单
export function addOrder_info(data) {
  return request({
    url: '/order_info/order_info',
    method: 'post',
    data: data
  })
}

// 修改订单
export function updateOrder_info(data) {
  return request({
    url: '/order_info/order_info',
    method: 'put',
    data: data
  })
}

// 删除订单
export function delOrder_info(orderId) {
  return request({
    url: '/order_info/order_info/' + orderId,
    method: 'delete'
  })
}
