import request from '@/utils/request'

// 查询商品管理列表
export function listCommodity(query) {
  return request({
    url: '/commodity/commodity/list',
    method: 'get',
    params: query
  })
}

// 查询商品管理详细
export function getCommodity(id) {
  return request({
    url: '/commodity/commodity/' + id,
    method: 'get'
  })
}

// 新增商品管理
export function addCommodity(data) {
  return request({
    url: '/commodity/commodity',
    method: 'post',
    data: data
  })
}

// 修改商品管理
export function updateCommodity(data) {
  return request({
    url: '/commodity/commodity',
    method: 'put',
    data: data
  })
}

// 删除商品管理
export function delCommodity(id) {
  return request({
    url: '/commodity/commodity/' + id,
    method: 'delete'
  })
}
