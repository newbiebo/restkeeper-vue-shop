import request from '@/utils/request'

export function findValueByDataKey(data) {
  console.log('查询数据字典信息：' + data);
  return request({
    url: '/basic/data-dict/parent-key/'+data,
    method: 'get'
  })
}







