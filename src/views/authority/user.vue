<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.username" :placeholder="$t('table.username')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.mobil" :placeholder="$t('table.mobil')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.enableFlag" :placeholder="$t('table.enableFlag')" clearable style="width: 90px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in calendarEnableFlagOptions" :key="item.dataValue" :label="item.discriptioin" :value="item.dataValue" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="handleUpdate">
        {{ $t('table.edit') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-close" @click="handleDelete">
        {{ $t('table.delete') }}
      </el-button>
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
      <el-table-column type="selection" width="50px" align="center"/>
      <!--<el-table-column :label="$t('table.id')" prop="id" width="180px" align="center" />-->
      <el-table-column :label="$t('table.storeId')" prop="storeId" width="150px" :formatter="formatStore"/>
      <el-table-column :label="$t('table.username')" prop="username" min-width="110px" />
      <el-table-column :label="$t('table.realName')" prop="realName" width="90px" />
      <el-table-column :label="$t('table.sex')" prop="sex" width="50px" :formatter="formatSex"/>
      <el-table-column :label="$t('table.mobil')" prop="mobil" width="110px" />
      <el-table-column :label="$t('table.discountLimit')" prop="discountLimit" width="65px" />
      <el-table-column :label="$t('table.reduceLimit')" prop="reduceLimit" width="65px" />
      <el-table-column :label="$t('table.email')" prop="email" width="150px" />
      <el-table-column :label="$t('table.enableFlag')" prop="enableFlag" width="60" :formatter="formatEnableFlag"/>
      <el-table-column align="center" :label="$t('table.actions')" width="220">
        <template  slot-scope="{row}">
          <el-button  type="danger" v-if="row.enableFlag==$global.enableFlagYes"
                      @click="changeEnableFlag(row,$global.enableFlagNo)"
                      size="mini" icon="el-icon-edit" plain>
            禁用
          </el-button>
          <el-button  type="success" v-if="row.enableFlag==$global.enableFlagNo"
                      @click="changeEnableFlag(row,$global.enableFlagYes)"
                      size="mini" icon="el-icon-edit" plain>
            启用
          </el-button>
          <el-button  type="success"
                      @click="restPassword(row)"
                      size="mini" icon="el-icon-edit" plain>
            密码重置
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.pageNum"
                :limit.sync="listQuery.pageSize"
                @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" top="10px">
      <el-form ref="dataForm" :rules="rules" size="small" :model="temp" label-position="right" label-width="80px" style="width: 400px; margin-left:30px;">
        <el-form-item v-show="false" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item :label="$t('table.username')" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item :label="$t('table.headPortrait')" prop="headPortrait">
          <el-upload
            class="avatar-uploader"
            name="file"
            :action="uploadAction()"
            :headers="myHeaders"
            :data="affixData()"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="temp.affixVo.pathUrl" :src="temp.affixVo.pathUrl" class="avatar-hearder">
            <i v-else class="el-icon-plus avatar-uploader-icon-hearder"></i>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('table.realName')" prop="realName">
          <el-input v-model="temp.realName" />
        </el-form-item>

        <el-form-item v-if="dialogStatus==='create'" :label="$t('table.plainPassword')" prop="plainPassword">
          <el-input v-model="temp.plainPassword" />
        </el-form-item>

        <el-form-item v-if="dialogStatus==='create'" :label="$t('table.password')" prop="againPlainPassword">
          <el-input v-model="temp.password" />
        </el-form-item>

        <el-form-item :label="$t('table.storeId')" prop="storeId">
          <el-select v-model="temp.storeId" clearable class="filter-item" :placeholder="$t('table.PleaseSelect')">
            <el-option v-for="item in calendarStoreOptions" :key="item.id" :label="item.storeName" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('table.sex')" prop="sex">
          <el-select v-model="temp.sex" clearable class="filter-item" :placeholder="$t('table.PleaseSelect')">
            <el-option v-for="item in calendarSexOptions" :key="item.dataValue" :label="item.discriptioin" :value="item.dataValue" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('table.hasRoleIds')" prop="hasRoleIds">
          <el-select v-model="temp.hasRoleIds" clearable multiple class="filter-item" :placeholder="$t('table.PleaseSelect')">
            <el-option v-for="item in calendarMerchantRoleOptions" :key="item.dataValue" :label="item.discriptioin" :value="item.dataValue" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('table.discountLimit')" prop="discountLimit">
          <el-input v-model="temp.discountLimit" />
        </el-form-item>

        <el-form-item :label="$t('table.reduceLimit')" prop="reduceLimit">
          <el-input v-model="temp.reduceLimit" />
        </el-form-item>

        <el-form-item :label="$t('table.mobil')" prop="mobil">
          <el-input v-model="temp.mobil" />
        </el-form-item>

        <el-form-item :label="$t('table.email')" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>

        <el-form-item :label="$t('table.sortNo')" prop="sortNo">
          <el-input v-model="temp.sortNo" />
        </el-form-item>

        <el-form-item :label="$t('table.enableFlag')" prop="enableFlag">
          <el-select v-model="temp.enableFlag" clearable class="filter-item" :placeholder="$t('table.PleaseSelect')">
            <el-option v-for="item in calendarEnableFlagOptions" :key="item.dataValue" :label="item.discriptioin" :value="item.dataValue" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList,createInfo,updateInfo,deleteInfo,changeEnableFlag,restPassword } from '@/api/user'
import { findValueByDataKey } from '@/api/datadict'
import { getToken } from '@/utils/auth'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { validUsername, validEmail } from '@/utils/validate'
import {initfetchList} from '@/api/store'

const calendarEnableFlagOptions = [];

const calendarSexOptions = [];

const calendarMerchantRoleOptions=[];

const calendarStoreOptions = [];


export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    // 参数校验
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确邮箱格式'))
      } else {
        callback()
      }
    };

    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确邮箱格式'))
      } else {
        callback()
      }
    };

    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.temp.plainPassword !== '') {
          this.$refs.dataForm.validateField('password');
        }
        callback();
      }
    };
    const validateAgainPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.temp.plainPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      myHeaders: {jwtToken: getToken()},
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      // 查询条件
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        username: '',
        mobil: '',
        enableFlag: '',
      },
      calendarEnableFlagOptions,
      calendarSexOptions,
      calendarMerchantRoleOptions,
      calendarStoreOptions,
      showReviewer: false,
      // 表单提交字段
      temp: {
        id: '',
        username: '',
        realName: '',
        sex: '',
        mobil: '',
        email: '',
        duties: '',
        hasRoleIds:[],
        checkedIds:[],
        sortNo: '',
        enableFlag: '',
        plainPassword: '',
        discountLimit:'',
        reduceLimit:'',
        password:'',
        affixVo:{
          id: '',
          businessId: '',
          pathUrl: ''
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '添加用户'
      },
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        sex: [{ required: true, message: '必填', trigger: 'change' }],
        realName: [{ required: true, message: '必填', trigger: 'change' }],
        mobil: [{ required: true, message: '必填', trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        storeId: [{ required: true, message: '必填', trigger: 'blur' }],
        sortNo: [{ required: true, message: '必填', trigger: 'blur' }],
        discountLimit: [{ required: true, message: '必填', trigger: 'blur' }],
        reduceLimit: [{ required: true, message: '必填', trigger: 'blur' }],
        enableFlag: [{ required: true, message: '必填', trigger: 'change' }],
        hasRoleIds: [{ required: true, trigger: 'change',message: '请选择角色'}],
        plainPassword: [{ required: true,trigger: 'blur',validator: validatePassword }],
        password: [{ required: true,trigger: 'blur' ,validator: validateAgainPassword}]
      },
      downloadLoading: false
    }
  },
  created() {
    this.initEnableFlag();
    this.initSexFlag();
    this.initStore();
    this.getList();
  },
  methods: {
    //查询分页
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.datas.records;
        this.total = response.datas.total;
        console.log('查询用户信息返回:' + response.datas);
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
      })
    },
    restPassword(row){
      this.temp = row;
      restPassword(this.temp).then(response => {
        const flag = response.datas;
        if (flag) {
          this.$message({
            message: '重置密码成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: response.msg,
            type: 'warning'
          })
        }
      })
    },
    changeEnableFlag(row,status){
      this.temp = row;
      this.temp.enableFlag=status;
      changeEnableFlag(this.temp).then(response => {
        const flag = response.datas;
        if (flag) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: response.msg,
            type: 'warning'
          })
        }
      })
    },
    initMerchantRoleOptions(){
      findValueByDataKey(this.$global.merchantRole).then(response => {
        this.calendarMerchantRoleOptions = response.datas;
      })
    },
    initEnableFlag() {
      findValueByDataKey(this.$global.enableFlag).then(response => {
        this.calendarEnableFlagOptions = response.datas;
      })
    },
    formatEnableFlag(row){
      for(let x of this.calendarEnableFlagOptions){
        if (row.enableFlag === x.dataValue) {
          return x.discriptioin;
        }
      }
    },
    initStore() {
      initfetchList().then(response => {
        this.calendarStoreOptions = response.datas;
      })
    },
    formatStore(row){
      for(let x of this.calendarStoreOptions){
        if (row.storeId === x.id) {
          return x.storeName;
        }
      }
    },
    initSexFlag() {
      findValueByDataKey(this.$global.sex).then(response => {
        this.calendarSexOptions = response.datas;
      })
    },
    formatSex(row){
      for(let x of this.calendarSexOptions){
        if (row.sex === x.dataValue) {
          return x.discriptioin;
        }
      }
    },
    // 重新刷新页面
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.getList()
    },
    // 重置表单
    resetTemp() {
      this.temp = {
        id: '',
        username: '',
        realName: '',
        sex: '',
        mobil: '',
        email: '',
        duties: '',
        hasRoleIds:[],
        checkedIds:[],
        sortNo: '',
        enableFlag: '',
        plainPassword: '',
        password:'',
        storeId:'',
        affixVo:{
          id:'',
          businessId:'',
          pathUrl:'undefined'
        }
      }
    },
    affixData(){
      return {
        "businessType":this.$global.headPortrait
      }
    },
    //上传路径
    uploadAction(){
      return this.$global.uploadAction;
    },
    //上传结果处理
    handleAvatarSuccess(res, file) {
      this.temp.affixVo.pathUrl = res.datas.pathUrl;
      this.temp.affixVo.id = res.datas.id;
      console.log("返回图片路径："+this.temp.affixVo.pathUrl);
      console.log("返回图片Id："+this.temp.affixVo.id);
    },
    //上传之前处理
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt3M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isJPG && isLt3M;
    },
    // 处理添加
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
        this.initMerchantRoleOptions();
        this.temp.affixVo.pathUrl=null;
      })
    },
    // 执行添加
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createInfo(this.temp).then(response => {
            this.temp = response.datas;
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 1000,
              offset: 300
            });
          })
        }
      })
    },
    //处理修改
    handleUpdate() {
      this.resetTemp();
      const rows = this.$refs.multipleTable.selection;
      if (rows.length === 0) {
        this.$message({
          message: '请选择要编辑的记录',
          type: 'warning',
          duration: 1500,
          offset: 300
        });
        return
      }
      if (rows.length > 1) {
        this.$message({
          message: '只能选择一条记录',
          type: 'warning',
          duration: 1500,
          offset: 300
        });
        return
      }
      this.temp = Object.assign({}, rows[0]) ;// copy obj
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.initMerchantRoleOptions();
        this.$refs['dataForm'].clearValidate();
      })
    },
    //执行修改
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateInfo(this.temp).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1500,
              offset: 300
            });
          })
        }
      })
    },
    handleDelete() {
      const rows = this.$refs.multipleTable.selection;
      if (rows.length === 0) {
        this.$message({
          message: '请选择您要删除的记录',
          type: 'warning',
          duration: 1500,
          offset: 300
        });
        return
      }
      if (rows.length > 0) {
        this.$confirm('此操作将永久删除所选记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const ids = [];
          rows.forEach(item => {
            ids.push(item.id)
          });
          this.temp.checkedIds = ids;
          deleteInfo(this.temp).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              offset: 300
            });
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1500,
            offset: 300
          })
        })
      }
    }
  }
}
</script>
<style>
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
  .avatar-uploader-icon-hearder {
    font-size: 28px;
    color: #8c939d;
    width: 78px;
    height: 78px;
    line-height: 78px;
    text-align: center;
  }
  .avatar-hearder {
    width: 78px;
    height: 78px;
    display: block;
  }
</style>
