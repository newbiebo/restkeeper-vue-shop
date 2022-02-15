import request from '@/utils/request'

export function login(username,password) {
  console.log(username,password);
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  return request({
    url: 'security/user/login',
    method: 'post',
    headers:{'Content-Type':"application/x-www-form-urlencoded"},
    data: params
  })
}

export function getInfo() {
  return request({
    url: 'security/user/find-current-user',
    method: 'get'
  })
}
export function restPassword(data) {
  console.info("重置data"+data);
  return request({
    url: 'shop/user/rest-password',
    method: 'post',
    data
  })
}
export function changeEnableFlag(data) {
  console.info("修改data"+data);
  return request({
    url: 'shop/user/update-user-enableFlag',
    method: 'post',
    data
  })
}

export function findUserVoList() {
  return request({
    url: 'shop/user/select-list',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'security/user/logout',
    method: 'post'
  })
}

export function fetchList(data) {
  console.log('查询用户列表参数：' + data);
  return request({
    url: 'shop/user/page/'+data.pageNum+"/"+data.pageSize,
    method: 'post',
    data,
  })
}

export function initRoleIdOptions() {
  return request({
    url: '/security/role/init-roleid-options',
    method: 'post'
  })
}

export function createInfo(data) {
  return request({
    url: 'shop/user',
    method: 'post',
    data,
  })
}

export function updateInfo(data) {
  console.log('修改信息：' + data);
  return request({
    url: 'shop/user',
    method: 'patch',
    data,
  })
}

export function deleteInfo(data) {
  console.log('删除信息：' + data);
  return request({
    url: 'shop/user',
    method: 'delete',
    data,
  })
}






