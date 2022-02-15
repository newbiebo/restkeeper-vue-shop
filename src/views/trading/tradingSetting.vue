<template>
  <div class="app-container">
    <el-container>
      <el-card class="box-card-component" style="width: 95%;">
        <el-link type="warning" icon="el-icon-edit" style="font-size: 17px" >交易配置</el-link>
        <el-divider></el-divider>
        <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" style="width: 400px; margin-left:30px;">

          <el-form-item :label="$t('table.alipayAppid')" prop="alipayAppid">
            <el-input v-model="temp.alipayAppid" style="width: 300px" ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.alipayPublicKey')" prop="alipayPublicKey">
            <el-input type="textarea" v-model="temp.alipayPublicKey" :rows="4" style="width: 500px"></el-input>
          </el-form-item>

          <el-form-item :label="$t('table.alipayMerchantPrivateKey')" prop="alipayMerchantPrivateKey">
            <el-input type="textarea" v-model="temp.alipayMerchantPrivateKey" :rows="4" style="width: 500px"></el-input>
          </el-form-item>

          <el-form-item :label="$t('table.alipayEncryptKey')" prop="alipayEncryptKey">
            <el-input v-model="temp.alipayEncryptKey" style="width: 500px" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveOrUpdate" v-show="temp.id==''">立即创建</el-button>
            <el-button type="primary" @click="saveOrUpdate" v-show="temp.id!=''">立即更新</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-container>
  </div>
</template>

<script>
  import { saveOrUpdate, findTradingSetting} from '@/api/tradingSetting'
  import waves from '@/directive/waves' // waves directive


  export default {
    name: 'ComplexTable',
    directives: { waves },
    data() {
      return {
        // 表单提交字段
        temp: {
          id:'',
          alipayAppid: '',
          alipayPublicKey: '',
          alipayMerchantPrivateKey: '',
          alipayEncryptKey: '',
          enableFlag: 'YES'
        },
        rules: {
          alipayAppid: [{ required: true, message: '必填', trigger: 'blur' }],
          alipayPublicKey: [{ required: true, message: '必填', trigger: 'blur' }],
          alipayMerchantPrivateKey: [{ required: true, message: '必填', trigger: 'blur' }],
          alipayEncryptKey: [{ required: true, message: '必填', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.findTradingSetting();
    },
    methods: {
      findTradingSetting(){
        findTradingSetting().then(response=>{
          if (response.datas!==null){
            this.temp = response.datas;
          }
        })
      },
      saveOrUpdate(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            saveOrUpdate(this.temp).then(response=>{
              if (response.datas!==null){
                this.temp = response.datas;
              }
              this.$message({
                message: response.msg,
                type: 'warning'
              });
            })
          }
        })

      }
    }
  }
</script>
<style>

  .el-main {
    padding: 0px 20px;
  }

  .el-aside {
    background-color: #fff;
    color: #fff;
    padding: 0px;
    border: 1px solid #dfe6ec;
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
    width: 50%;
  }

</style>
