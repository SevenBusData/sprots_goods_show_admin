import request from '@/utils/request'

// 查询发货列表
export function listShipment(query) {
  return request({
    url: '/shipment/shipment/list',
    method: 'get',
    params: query
  })
}

// 查询发货详细
export function getShipment(shipmentId) {
  return request({
    url: '/shipment/shipment/' + shipmentId,
    method: 'get'
  })
}

// 新增发货
export function addShipment(data) {
  return request({
    url: '/shipment/shipment',
    method: 'post',
    data: data
  })
}

// 修改发货
export function updateShipment(data) {
  return request({
    url: '/shipment/shipment',
    method: 'put',
    data: data
  })
}

// 删除发货
export function delShipment(shipmentId) {
  return request({
    url: '/shipment/shipment/' + shipmentId,
    method: 'delete'
  })
}
