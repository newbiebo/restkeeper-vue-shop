import request from '@/utils/request'


export function fetchList(data) {
  console.log('查询区域列表参数：' + data);
  return request({
    url: 'shop/table-area/page/'+data.pageNum+"/"+data.pageSize,
    method: 'post',
    data,
  })
}

export function createInfo(data) {
  return request({
    url: 'shop/table-area',
    method: 'post',
    data,
  })
}

export function changeEnableFlag(data) {
  console.info("修改data"+data);
  return request({
    url: 'shop/table-area/update-tableArea-enableFlag',
    method: 'post',
    data
  })
}

export function updateInfo(data) {
  console.log('修改信息：' + data);
  return request({
    url: 'shop/table-area',
    method: 'patch',
    data,
  })
}

export function initfetchList(data) {
  return request({
    url: 'shop/table-area/list',
    method: 'get',
  })
}

export function deleteInfo(data) {
  console.log('删除信息：' + data);
  return request({
    url: 'shop/table-area',
    method: 'delete',
    data,
  })
}






