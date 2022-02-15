import request from '@/utils/request'

export function initEnterpriseIdOptions() {
  return request({
    url: '/security/enterprise/init-enterprise-options',
    method: 'post'
  })
}


