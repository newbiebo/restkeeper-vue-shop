import request from '@/utils/request'


export function fetchList(data) {
  console.log('查询菜品列表参数：' + data);
  return request({
    url: 'shop/order/page/'+data.pageNum+"/"+data.pageSize,
    method: 'post',
    data,
  })
}

export function changeTable(data) {
  return request({
    url: 'shop/applet/rotary-table/'+data.sourceTableId+"/"+data.targetTableId+"/"+data.orderNo,
    method: 'post',
  })
}

export function opertionToOrderItem(dishId,orderNo,opertionType) {
  return request({
    url: 'shop/order/opertion-to-orderItem/'+dishId+"/"+orderNo+"/"+opertionType,
    method: 'post',
  })
}

export function handleTrading(data) {
  console.info("结算信息："+data);
  return request({
    url: 'shop/order/handleTrading',
    method: 'post',
    data
  })
}

export function handleTradingRefund(data) {
  console.info("退款信息："+data);
  return request({
    url: 'shop/order/handle-trading-refund',
    method: 'post',
    data
  })
}











