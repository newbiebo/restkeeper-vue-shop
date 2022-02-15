import request from '@/utils/request'

export function fetchPlaces(data) {
  console.log('查询省市区参数：' + data);
  return request({
    url: 'basic/places/'+data,
    method: 'get'
  })
}
