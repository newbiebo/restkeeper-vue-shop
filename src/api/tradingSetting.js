import request from '@/utils/request'

export function saveOrUpdate(data) {
  return request({
    url: 'trading/trading-setting',
    method: 'patch',
    data
  })
}

export function findTradingSetting() {
  return request({
    url: 'trading/trading-setting',
    method: 'get',
  })
}


