import request from '@/utils/request.js'

// 查询订单详情列表
export function listOrder_detail(query) {
  return request({
    url: '/order_detail/order_detail/list',
    method: 'get',
    params: query
  })
}

// 查询订单详情详细
export function getOrder_detail(detailId) {
  return request({
    url: '/order_detail/order_detail/' + detailId,
    method: 'get'
  })
}

// 新增订单详情
export function addOrder_detail(data) {
  return request({
    url: '/order_detail/order_detail',
    method: 'post',
    data: data
  })
}

// 修改订单详情
export function updateOrder_detail(data) {
  return request({
    url: '/order_detail/order_detail',
    method: 'put',
    data: data
  })
}

// 删除订单详情
export function delOrder_detail(detailId) {
  return request({
    url: '/order_detail/order_detail/' + detailId,
    method: 'delete'
  })
}
