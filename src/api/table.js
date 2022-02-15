import request from '@/utils/request'


export function fetchList(data) {
  console.log('查询门店列表参数：' + data);
  return request({
    url: 'shop/table/page/'+data.pageNum+"/"+data.pageSize,
    method: 'post',
    data,
  })
}

export function initfetchList(data) {
  return request({
    url: 'shop/table/list',
    method: 'get',
  })
}

export function changeEnableFlag(data) {
  console.info("修改data"+data);
  return request({
    url: 'shop/table/update-table-enableFlag',
    method: 'post',
    data
  })
}

export function changeTableStatus(data) {
  console.info("修改data"+data);
  return request({
    url: 'shop/table/update-table-tableStatus',
    method: 'post',
    data
  })
}

export function createInfo(data) {
  return request({
    url: 'shop/table',
    method: 'post',
    data,
  })
}

export function updateInfo(data) {
  console.log('修改信息：' + data);
  return request({
    url: 'shop/table',
    method: 'patch',
    data,
  })
}

export function deleteInfo(data) {
  console.log('删除信息：' + data);
  return request({
    url: 'shop/table',
    method: 'delete',
    data,
  })
}






