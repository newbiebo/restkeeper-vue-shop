import request from '@/utils/request'


export function fetchList(data) {
  console.log('查询菜品列表参数：' + data);
  return request({
    url: 'shop/dish/page/'+data.pageNum+"/"+data.pageSize,
    method: 'post',
    data,
  })
}

export function changeEnableFlag(data) {
  console.info("修改data"+data);
  return request({
    url: 'shop/dish/update-dish-enableFlag',
    method: 'post',
    data
  })
}

export function changeDishStatus(data) {
  console.info("修改data"+data);
  return request({
    url: 'shop/dish/update-dish-dishStatus',
    method: 'post',
    data
  })
}

export function createInfo(data) {
  return request({
    url: 'shop/dish',
    method: 'post',
    data,
  })
}

export function updateInfo(data) {
  console.log('修改信息：' + data);
  return request({
    url: 'shop/dish',
    method: 'patch',
    data,
  })
}

export function deleteInfo(data) {
  console.log('删除信息：' + data);
  return request({
    url: 'shop/dish',
    method: 'delete',
    data,
  })
}






