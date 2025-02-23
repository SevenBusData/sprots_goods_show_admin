import request from '@/utils/request'

// 查询评论列表
export function listReview(query) {
  return request({
    url: '/review/review/list',
    method: 'get',
    params: query
  })
}

// 查询评论详细
export function getReview(reviewId) {
  return request({
    url: '/review/review/' + reviewId,
    method: 'get'
  })
}

// 新增评论
export function addReview(data) {
  return request({
    url: '/review/review',
    method: 'post',
    data: data
  })
}

// 修改评论
export function updateReview(data) {
  return request({
    url: '/review/review',
    method: 'put',
    data: data
  })
}

// 删除评论
export function delReview(reviewId) {
  return request({
    url: '/review/review/' + reviewId,
    method: 'delete'
  })
}
