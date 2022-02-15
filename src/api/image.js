import request from '@/utils/request'


export function findAffixVoByBusinessId(data) {
  return request({
    url: 'basic/affix/select-by-businessId',
    method: 'post',
    data
  })
}
