<template>
  <div class="app-container">
    <el-container>
      <el-drawer
        ref="drawer"
        :with-header="false"
        size = 26%
        :visible.sync="drawer"
        :direction="direction">
        <el-card class="box-card-component">
          <div class="demo-image__preview">
            <el-form ref="dataForm" size="small" :model="orderDetails" label-position="right" label-width="80px" style="width: 300px;">
              <el-link type="danger" icon="el-icon-edit" style="margin-bottom: 20px" >订单结算</el-link>
              <el-form-item :label="$t('table.tableName')" prop="tableName" class="order-details">
                {{orderDetails.tableName}}
              </el-form-item>
              <el-form-item :label="$t('table.orderNo')" prop="orderNo" class="order-details">
                {{orderDetails.orderNo}}
              </el-form-item>
              <el-form-item v-show="false" prop="orderNo">
                <el-input v-model="orderDetails.orderNo" />
              </el-form-item>
              <el-form-item :label="$t('table.personNumbers')" prop="personNumbers" class="order-details">
                {{orderDetails.personNumbers}}
              </el-form-item>
              <el-form-item :label="$t('table.payableAmountSum')" prop="payableAmountSum" class="order-details">
                {{orderDetails.payableAmountSum}}元
              </el-form-item>
              <el-form-item v-if="orderDetails.tradingChannel==this.$global.tradingChannelRefund"
                :label="$t('table.realAmountSum')" prop="realAmountSum" class="order-details">
                {{orderDetails.realAmountSum}}元
              </el-form-item>
              <el-form-item v-if="orderDetails.tradingChannel==this.$global.tradingChannelRefund"
                            :label="$t('table.refunded')" prop="refunded" class="order-details">
                {{orderDetails.refunded}}元
              </el-form-item>
              <el-form-item v-if="orderDetails.tradingChannel==this.$global.tradingChannelRefund"
                            :label="$t('table.refund')" prop="operTionRefund" class="order-details">
                <el-input-number v-model="orderDetails.operTionRefund" :step="0.5" :min="0" :max="orderDetails.maxRefund"/>&nbsp &nbsp元
              </el-form-item>
              <el-form-item v-if="this.$store.getters.introduction.includes('reduce')
              &orderDetails.tradingChannel!=this.$global.tradingChannelFreeCharge
              &orderDetails.tradingChannel!=this.$global.tradingChannelRefund"
                            :label="$t('table.reduce')" prop="reduce" class="order-details">
                <el-input-number v-model="orderDetails.reduce" :step="1" :min="0" :max="reduceLimit" step-strictly/>&nbsp &nbsp元
              </el-form-item>
              <el-form-item v-if="this.$store.getters.introduction.includes('discount')
              &orderDetails.tradingChannel!=this.$global.tradingChannelFreeCharge
              &orderDetails.tradingChannel!=this.$global.tradingChannelRefund"
                            :label="$t('table.discount')" prop="discount" class="order-details">
                <el-input-number v-model="orderDetails.discount" :precision="1" :step="0.5" :min="discountLimit" :max="10" step-strictly/> &nbsp &nbsp折
              </el-form-item>
              <el-form-item  v-if="orderDetails.tradingChannel!=this.$global.tradingChannelRefund"
                :label="$t('table.tradingChannel')" prop="tradingChannel" class="order-details">
                <el-select @change="HandlerTradingChannel" v-model="orderDetails.tradingChannel" :placeholder="$t('table.tradingChannel')" style="width: 120px" class="filter-item">
                  <el-option v-for="item in calebdarTradingChannel" :key="item.dataValue" :label="item.discriptioin" :value="item.dataValue" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="demo-drawer__footer" style="margin-top: 20px; margin-left: 10px"  v-if="orderDetails.tradingChannel!=this.$global.tradingChannelRefund">
            <el-button size="medium" type="success" @click="handleTrading()" >结&nbsp算</el-button>
          </div>
          <div class="demo-drawer__footer" style="margin-top: 20px; margin-left: 10px"  v-if="orderDetails.tradingChannel==this.$global.tradingChannelRefund">
            <el-button size="medium" type="danger" @click="handleTradingRefund()" >退&nbsp款</el-button>
          </div>
        </el-card>
      </el-drawer>
      <el-main>

        <div class="filter-container">
          <el-input v-model="listQuery.orderNo" :placeholder="$t('table.orderNo')" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.orderState" :placeholder="$t('table.orderState')" clearable style="width: 120px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in calendarOrderStateOptions" :key="item.dataValue" :label="item.discriptioin" :value="item.dataValue" />
          </el-select>
          <el-select v-model="listQuery.isRefund" filterable :placeholder="$t('table.refund')" clearable style="width: 120px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in calebdarRefundTypy" :key="item.dataValue" :label="item.discriptioin" :value="item.dataValue" />
          </el-select>
          <el-select v-model="listQuery.tableId" filterable :placeholder="$t('table.tableId')" clearable style="width: 190px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in calendarTableOptions" :key="item.id" :label="item.tableName" :value="item.id" />
          </el-select>
        </div>

        <el-table
          ref="multipleTable"
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          stripe
          fit
          highlight-current-row
          style="width: 100%;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form v-for="item  in props.row.orderItemVoStatisticsList" label-width="70px" label-position="left" inline class="demo-table-expand">
                <el-form-item :label="$t('table.dishName')">
                  <span>{{item .dishName }}</span>
                </el-form-item>
                <el-form-item :label="$t('table.price')">
                  <span>{{ item .price }}</span>
                </el-form-item>
                <el-form-item :label="$t('table.reducePrice')">
                  <span>{{ item .reducePrice }}</span>
                </el-form-item>
                <el-form-item :label="$t('table.dishNum')">
                  <template>
                    <el-input-number v-if="props.row.orderState==$global.orderStateDFK"
                      @change="(newval,oldval,) => opertionToShoppingCart(newval, oldval, item.productOrderNo,item.dishId,props.row)"
                      size="mini"
                      v-model="item .dishNum "
                      :step="1"
                      :min="0"
                      step-strictly/>
                    <el-input-number v-if="props.row.orderState!=$global.orderStateDFK" disabled
                                     @change="(newval,oldval,) => opertionToShoppingCart(newval, oldval, item.productOrderNo,item.dishId,props.row)"
                                     size="mini"
                                     v-model="item .dishNum "
                                     :step="1"
                                     :min="0"
                                     step-strictly/>
                  </template>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.orderNo')" prop="orderNo" width="170px" />
          <el-table-column :label="$t('table.payableAmountSum')" prop="payableAmountSum" width="60px" />
          <el-table-column :label="$t('table.realAmountSum')" prop="realAmountSum" width="60px" />
          <el-table-column :label="$t('table.discount')" prop="discount" width="55px" />
          <el-table-column :label="$t('table.reduce')" prop="reduce" width="55px" />
          <el-table-column :label="$t('table.refund')" prop="refund" width="55px" />
          <el-table-column :label="$t('table.orderState')" prop="orderState" width="80px" :formatter="formatOrderState"/>
          <el-table-column :label="$t('table.cashierName')" prop="cashierName" width="115px" />
          <el-table-column min-width="230px" :label="$t('table.tableId')" prop="tableId" >
            <template slot-scope="{row}">
              <template v-if="row.edit">
                <el-select size="small" @change="doChangeTable" v-model="temp.tableId" style="width: 140px" filterable :placeholder="$t('table.tableId')" class="filter-item">
                  <el-option v-for="item in calendarTableOptions" :key="item.id" :label="item.tableName" :value="item.id" />
                </el-select>
                <el-button
                  class="cancel-btn"
                  size="mini"
                  icon="el-icon-refresh"
                  type="warning"
                  @click="cancelEdit(row)">
                  取消
                </el-button>
              </template>
              <span v-else>{{row.tableName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.actions')" width="220">
            <template  slot-scope="{row}">
              <el-button v-if="row.edit&row.orderState==$global.orderStateDFK"  type="success" size="mini" icon="el-icon-edit"
                         @click="confirmEdit(row)">
                确定
              </el-button>
              <el-button v-if="!row.edit&row.orderState==$global.orderStateDFK" type="primary" size="mini" icon="el-icon-edit"
                         @click="changeTanle(row)">
                转台
              </el-button>
              <el-button v-if="row.orderState==$global.orderStateDFK||row.orderState==$global.orderStateQXDD" type="warning" size="mini" icon="el-icon-s-claim"
                         @click="settleAccounts(row)">
                结账
              </el-button>
              <el-button v-if="row.orderState==$global.orderStateFKZ&&row.tradingChannel==$global.tradingChannelAlipay" type="primary" size="mini" icon="el-icon-s-claim"
                         @click="reconfirm(row)">
                查看二维码
              </el-button>
              <el-button v-if="row.orderState==$global.orderStateYJS" type="danger" size="mini" icon="el-icon-s-claim"
                         @click="settleRefund(row)">
                退款
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0"
                    :total="total"
                    :page.sync="listQuery.pageNum"
                    :limit.sync="listQuery.pageSize"
                    @pagination="getList" />
      </el-main>
      <el-dialog title="请使用支付宝扫描" :visible.sync="dialogFormVisible" width="35%" align="center" >
        <el-image :src="this.tradingVo.imgUrl"></el-image>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
        </div>
      </el-dialog>
    </el-container>


  </div>
</template>

<script>
  import { fetchList,changeTable,opertionToOrderItem,handleTrading,handleTradingRefund} from '@/api/orderSettlement'
  import { getInfo } from '@/api/user'
  import { initfetchList } from '@/api/table'
  import { findValueByDataKey } from '@/api/datadict'
  import { getToken } from '@/utils/auth'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  const calendarOrderStateOptions = [];
  const calendarTableOptions=[];
  const calebdarTradingChannel=[];
  const calebdarRefundTypy=[];
  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        dialogFormVisible: false,
        drawer: false,
        direction: 'rtl',
        srcList: [],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        // 查询条件
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          orderState: '',
          tableId:'',
          orderNo:'',
          isRefund:''
        },
        temp:{
          tableId:'',
          sourceTableId:'',
          targetTableId:'',
          orderNo:''
        },
        orderDetails:{
          tableName:'',
          orderNo:'',
          personNumbers:'',
          payableAmountSum:'',
          tradingChannel:'',
          maxRefund:'',
          refunded:'',
          operTionRefund:''
        },
        tradingVo:{
          imgUrl:'',
        },
        calendarOrderStateOptions,
        calendarTableOptions,
        calebdarTradingChannel,
        calebdarRefundTypy,
        showReviewer: false,
        discountLimit:'',
        reduceLimit:''
      }
    },
    created() {
      this.initRefundTypy();
      this.getInfo();
      this.initTradingChannel();
      this.initOrderState();
      this.initTable();
      this.getList();
    },
    methods: {
      //去结算
      settleAccounts(row){
        this.orderDetails = row;
        this.orderDetails.discount=10;
        this.orderDetails.reduce=0;
        this.orderDetails.tradingChannel=this.$global.tradingChannelAlipay;
        this.drawer = true
      },
      //再次查看二维码
      reconfirm(row){
        this.orderDetails = row;
        this.orderDetails.discount=10;
        this.orderDetails.reduce=0;
        this.orderDetails.tradingChannel=this.$global.tradingChannelAlipay;
        handleTrading(this.orderDetails).then(response => {
          if (response.datas.imgUrl!=null){
            this.tradingVo.imgUrl = response.datas.imgUrl;
            console.info("二维码路径："+this.tradingVo.imgUrl);
            this.$refs['drawer'].closeDrawer();
            this.dialogFormVisible=true;
          }else {
            this.$message({
              message: '非线上支付',
              type: 'warning',
              duration: 1000,
              offset: 300
            });
          }
        });
      },
      //退款
      settleRefund(row){
        this.orderDetails = row;
        this.orderDetails.tradingChannel=this.$global.tradingChannelRefund;
        //可退款
        this.orderDetails.maxRefund = this.orderDetails.realAmountSum-this.orderDetails.refund;
        //已经退款
        this.orderDetails.refunded = this.orderDetails.refund;
        this.drawer = true
      },
      //重置表单
      resetTemp() {
        this.temp = {
          tableId:'',
          sourceTableId:'',
          targetTableId:'',
          orderNo:''
        }
      },
      //转台
      changeTanle(row){
        row.edit=!row.edit;
        this.temp.tableId = row.tableId;
        this.temp.sourceTableId = row.tableId;
        this.temp.targetTableId = row.tableId;
        //alert("sourceTableId:"+this.temp.sourceTableId );
        this.temp.orderNo = row.orderNo;
        //alert("orderNo:"+this.temp.orderNo );
      },
      //提交转台
      doChangeTable(op){
        this.temp.targetTableId = op;
        //alert("sourceTableId:"+this.temp.sourceTableId+"====targetTableId:"+this.temp.targetTableId+"===orderNo:"+this.temp.orderNo );
      },
      cancelEdit(row) {
        row.edit = false;
        this.resetTemp();
      },
      confirmEdit(row) {
        if(this.temp.targetTableId ===this.temp.sourceTableId){
          this.$message({
            message: '相同桌台不能转台',
            type: 'warning'
          });
          return
        }
        changeTable(this.temp).then(response => {
          const flag = response.datas;
          if (flag) {
            row.edit = false;
            row.tableId = this.temp.targetTableId;
            row.tableName = this.formatTable(row);
            this.resetTemp();
            this.$message({
              message: '转台成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: response.msg,
              type: 'warning'
            })
          }
        })
      },
      initRefundTypy(){
        findValueByDataKey(this.$global.refundTypy).then(response => {
          this.calebdarRefundTypy = response.datas;
        })
      },
      formatRefundTypy(row) {
        for (let x of this.calebdarRefundTypy) {
          if (row.isRefund === x.dataValue) {
            return x.discriptioin;
          }
        }
      },
      initTradingChannel() {
        findValueByDataKey(this.$global.tradingChannel).then(response => {
          this.calebdarTradingChannel = response.datas;
        })
      },
      initOrderState() {
        findValueByDataKey(this.$global.orderState).then(response => {
          this.calendarOrderStateOptions = response.datas;
        })
      },
      formatOrderState(row) {
        for (let x of this.calendarOrderStateOptions) {
          if (row.orderState === x.dataValue) {
            return x.discriptioin;
          }
        }
      },
      initTable() {
        initfetchList().then(response => {
          this.calendarTableOptions = response.datas;
        })
      },
      formatTable(row) {
        for (let x of this.calendarTableOptions) {
          if (row.tableId === x.id) {
            return x.tableName;
          }
        }
      },
      opertionToShoppingCart(newval, oldval, productOrderNo,dishId,row){
        console.info(newval+"@@@@@"+oldval+"@@@@@"+productOrderNo+"@@@@@"+dishId+"@@@@"+row);
        let opertionType = null;
        if (newval>oldval) {
          opertionType =this.$global.opertionTypeAdd;
          opertionToOrderItem(dishId,productOrderNo,opertionType).then(response => {
            if (response.datas!==null){
              row.payableAmountSum = response.datas.payableAmountSum;
              this.$message({
                message: '增加菜品成功',
                type: 'success'
              });
            }
          })
        }
        if (newval<oldval) {
          opertionType =this.$global.opertionTypeRemove;
          opertionToOrderItem(dishId,productOrderNo,opertionType).then(response => {
            if (response.datas!==null){
              row.payableAmountSum = response.datas.payableAmountSum;
              this.$message({
                message: '减少菜品成功',
                type: 'success'
              });
            }
          })
        }
      },
      getInfo(){
        getInfo().then(response => {
          if (response.datas!==null){
            this.discountLimit = response.datas.discountLimit;
            this.reduceLimit = response.datas.reduceLimit;
          }
        })
      },
      //查询分页
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          if (response.datas.records!==null){
            this.list = response.datas.records.map(v => {
              this.$set(v, 'edit', false) ;
              return v
            });
            this.total = response.datas.total;
          }else {
            this.list = response.datas.records;
            this.total = response.datas.total;
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1000)
        })
      },

      // 重新刷新页面
      handleFilter() {
        this.listQuery.pageNum = 1;
        this.getList()
      },
      //处理结算方式
      HandlerTradingChannel(op){
        this.orderDetails.tradingChannel=op;
      },
      //结账
      handleTrading (){
        handleTrading(this.orderDetails).then(response => {
          console.info("支付渠道："+response.datas.tradingChannel);
          console.info("二维码路径："+this.tradingVo.imgUrl);
          if(response.datas.tradingChannel==this.$global.tradingChannelCashpay||
            response.datas.tradingChannel==this.$global.tradingChannelFreeCharge||
            response.datas.tradingChannel==this.$global.tradingChannelRefund){
            this.$message({
              message: '操作成功',
              type: 'warning',
              duration: 1000,
              offset: 300
            });
            this.$refs['drawer'].closeDrawer();
            this.getList();
          } else if (response.datas.tradingChannel==this.$global.tradingChannelAlipay){
            this.tradingVo.imgUrl = response.datas.imgUrl;
            this.$refs['drawer'].closeDrawer();
            this.dialogFormVisible=true;
            this.getList();
          }else {
            this.$message({
              message: '操作失败',
              type: 'warning',
              duration: 1000,
              offset: 300
            });
          }
        });
      },
      handleTradingRefund (){
        handleTradingRefund(this.orderDetails).then(response => {
          if (response.datas){
            this.$message({
              message: '发起退款成功',
              type: 'success',
              duration: 1000,
              offset: 300
            });
            this.$refs['drawer'].closeDrawer()
            this.getList();
          }else {
            this.$message({
              message: '发起退款失败',
              type: 'warning',
              duration: 1000,
              offset: 300
            });
          }
        });
      }
    }
  }
</script>
<style>

  .el-main {
    padding: 0px;
  }

  .box-card-component {
    margin: 10px;
  }

  .progress-item {
    margin-bottom: 25px;
    font-size: 15px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .el-drawer__body > * {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 97%;
  }
  .edit-input {
    padding-right: 200px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 24%;
  }

</style>
