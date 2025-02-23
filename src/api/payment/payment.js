import request from '@/utils/request'

// 查询支付记录列表
export function listPayment(query) {
  return request({
    url: '/payment/payment/list',
    method: 'get',
    params: query
  })
}

// 查询支付记录详细
export function getPayment(paymentId) {
  return request({
    url: '/payment/payment/' + paymentId,
    method: 'get'
  })
}

// 新增支付记录
export function addPayment(data) {
  return request({
    url: '/payment/payment',
    method: 'post',
    data: data
  })
}

// 修改支付记录
export function updatePayment(data) {
  return request({
    url: '/payment/payment',
    method: 'put',
    data: data
  })
}

// 删除支付记录
export function delPayment(paymentId) {
  return request({
    url: '/payment/payment/' + paymentId,
    method: 'delete'
  })
}
