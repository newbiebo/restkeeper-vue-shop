import request from '@/utils/request'

export function fetchList(data) {
  console.log('查询品牌列表参数：' + data);
  return request({
    url: 'shop/brand/page/'+data.pageNum+"/"+data.pageSize,
    method: 'post',
    data,
  })
}

export function changeEnableFlag(data) {
  console.info("修改data"+data);
  return request({
    url: 'shop/brand/update-brand-enableFlag',
    method: 'post',
    data
  })
}

export function initfetchList() {
  return request({
    url: 'shop/brand/list',
    method: 'get'
  })
}

export function createInfo(data) {
  return request({
    url: 'shop/brand',
    method: 'post',
    data,
  })
}

export function updateInfo(data) {
  console.log('修改信息：' + data);
  return request({
    url: 'shop/brand',
    method: 'patch',
    data,
  })
}

export function deleteInfo(data) {
  console.log('删除信息：' + data);
  return request({
    url: 'shop/brand',
    method: 'delete',
    data,
  })
}






