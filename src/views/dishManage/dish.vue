<template>
  <div class="app-container">
    <el-container>
      <el-drawer
        :with-header="false"
        size = 25%
        :visible.sync="drawer"
        :direction="direction">
        <el-card class="box-card-component" >
          <div class="demo-image__preview">
            <el-form  size="small" :model="temp" label-position="right" label-width="80px" style="width: 300px;">
              <el-form-item :label="$t('table.picture')" prop="picture">
                  <img v-if="temp.affixVo.pathUrl" :src="temp.affixVo.pathUrl" class="avatar">
              </el-form-item>
              <el-form-item :label="$t('table.dishName')" prop="dishName">
                {{temp.dishName}}
              </el-form-item>
              <el-form-item :label="$t('table.dishNumber')" prop="dishNumber">
                {{temp.dishNumber}}
              </el-form-item>
              <el-form-item :label="$t('table.price')" prop="price">
                {{temp.price}}元
              </el-form-item>
              <el-form-item :label="$t('table.reducePrice')" prop="reducePrice">
                {{temp.reducePrice}}元
              </el-form-item>
              <el-form-item :label="$t('table.code')" prop="code">
                {{temp.code}}
              </el-form-item>
              <el-form-item :label="$t('table.description')" prop="description">
               {{temp.description}}
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-drawer>
      <el-main>
        <div class="filter-container">
          <el-input v-model="listQuery.code" :placeholder="$t('table.code')" style="width: 130px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.dishName" :placeholder="$t('table.dishName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.categoryId" :placeholder="$t('table.categoryId')" clearable style="width: 90px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in calendarCategoryOptions" :key="item.id" :label="item.categoryName" :value="item.id" />
          </el-select>
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
          <el-table-column type="selection" width="50px" align="center" />
          <el-table-column :label="$t('table.dishName')" prop="dishName" min-width="120px" />
          <el-table-column :label="$t('table.dishNumber')" prop="dishNumber" min-width="80px" />
          <el-table-column :label="$t('table.categoryId')" prop="categoryId" width="120px" :formatter="formatCategory"/>
          <el-table-column :label="$t('table.price')" prop="price" width="65px" />
          <el-table-column :label="$t('table.reducePrice')" prop="reducePrice" width="95px" />
          <el-table-column :label="$t('table.code')" prop="code" width="65px" />
          <el-table-column :label="$t('table.dishStatus')" prop="dishStatus" width="85px" :formatter="formatDishStatus"/>
          <el-table-column :label="$t('table.sortNo')" prop="sortNo" width="50px" />
          <el-table-column :label="$t('table.enableFlag')" prop="enableFlag" width="60px" :formatter="formatEnableFlag"/>
          <el-table-column align="center" :label="$t('table.actions')" width="320">
            <template  slot-scope="{row}">
              <el-button  type="info" @click="changImage(row)"
                          size="mini" icon="el-icon-edit" plain>
                详情
              </el-button>
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
              <el-button  type="warning" v-if="row.dishStatus==$global.dishStatusYes"
                          @click="changeDishStatus(row,$global.dishStatusNo)"
                          size="mini" icon="el-icon-edit" plain>
                停售
              </el-button>
              <el-button  type="success" v-if="row.dishStatus==$global.dishStatusNo"
                          @click="changeDishStatus(row,$global.dishStatusYes)"
                          size="mini" icon="el-icon-edit" plain>
                起售
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0"
                    :total="total"
                    :page.sync="listQuery.pageNum"
                    :limit.sync="listQuery.pageSize"
                    @pagination="getList" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%"  top="10px">
          <el-form ref="dataForm" size="small" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 400px; margin-left:30px;">
            <el-form-item v-show="false" prop="id">
              <el-input v-model="temp.id" />
            </el-form-item>
            <el-form-item :label="$t('table.picture')" prop="picture">
              <el-upload
                class="avatar-uploader"
                name="file"
                :action="uploadAction()"
                :headers="myHeaders"
                :data="affixData()"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="temp.affixVo.pathUrl" :src="temp.affixVo.pathUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('table.dishName')" prop="dishName">
              <el-input v-model="temp.dishName" />
            </el-form-item>
            <el-form-item :label="$t('table.categoryId')" prop="enableFlag">
              <el-select v-model="temp.categoryId" clearable class="filter-item" :placeholder="$t('table.PleaseSelect')">
                <el-option v-for="item in calendarCategoryOptions" :key="item.id" :label="item.categoryName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('table.dishNumber')" prop="dishNumber">
              <template>
                <el-input-number v-model="temp.dishNumber" :step="1" step-strictly :min="0"/>
              </template>
            </el-form-item>
            <el-form-item :label="$t('table.price')" prop="price">
              <template>
                <el-input-number v-model="temp.price" :precision="1" :step="0.1" :min="0" :max="5000"></el-input-number>
              </template>
            </el-form-item>
            <el-form-item :label="$t('table.reducePrice')" prop="reducePrice">
              <template>
                <el-input-number v-model="temp.reducePrice" :precision="1" :step="0.1" :min="0" :max="1000"></el-input-number>
              </template>
            </el-form-item>
            <el-form-item :label="$t('table.code')" prop="code">
              <el-input v-model="temp.code" />
            </el-form-item>
            <el-form-item :label="$t('table.hasDishFlavor')" prop="hasDishFlavor">
              <el-select v-model="temp.hasDishFlavor" clearable multiple class="filter-item" :placeholder="$t('table.PleaseSelect')">
                <el-option v-for="item in calendarDishFlavorOptions" :key="item.dataKey" :label="item.discriptioin" :value="item.dataKey" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('table.dishStatus')" prop="dishStatus">
              <el-select v-model="temp.dishStatus" clearable class="filter-item" :placeholder="$t('table.PleaseSelect')">
                <el-option v-for="item in calendarDishStatusOptions" :key="item.dataValue" :label="item.discriptioin" :value="item.dataValue" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('table.description')" prop="description">
              <el-input  type="textarea"  v-model="temp.description" />
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
      </el-main>
    </el-container>


  </div>
</template>

<script>
  import { fetchList,createInfo,updateInfo,deleteInfo,changeDishStatus,changeEnableFlag } from '@/api/dish'
  import { findValueByDataKey } from '@/api/datadict'
  import { getToken } from '@/utils/auth'
  import { initfetchList} from '@/api/category'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  const calendarEnableFlagOptions = [];

  const calendarCategoryOptions=[];

  const calendarDishStatusOptions = [];

  const calendarDishFlavorOptions = [];

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        myHeaders: {jwtToken: getToken()},
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
          dishName: '',
          categoryId:'',
          dishStatus:'',
          code:'',
          enableFlag: '',
          affixVo:{
            id: '',
            businessId: '',
            pathUrl: ''
          }
        },
        calendarEnableFlagOptions,
        calendarCategoryOptions,
        calendarDishStatusOptions,
        calendarDishFlavorOptions,
        showReviewer: false,
        // 表单提交字段
        temp: {
          id: '',
          dishName: '',
          dishNumber:'',
          categoryId:'',
          price:'',
          reducePrice:'',
          code:'',
          description:'',
          dishStatus:'',
          checkedIds:[],
          sortNo:'',
          enableFlag: '',
          hasDishFlavor:'',
          affixVo:{
            id: '',
            businessId: '',
            pathUrl: ''
          }
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑菜品',
          create: '添加菜品'
        },
        rules: {
          dishName: [{ required: true, message: '必填', trigger: 'blur' }],
          dishNumber: [{ required: true, message: '必填', trigger: 'blur' }],
          categoryId: [{ required: true, message: '必填', trigger: 'change' }],
          price: [{ required: true, message: '必填', trigger: 'blur' }],
          reducePrice: [{ required: true, message: '必填', trigger: 'blur' }],
          code: [{ required: true, message: '必填', trigger: 'blur' }],
          description: [{ required: true, message: '必填', trigger: 'blur' }],
          dishStatus: [{ required: true, message: '必填', trigger: 'blur' }],
          hasDishFlavor: [{ required: true, message: '必填', trigger: 'change' }],
          sortNo: [{ required: true, message: '必填', trigger: 'blur' }],
          enableFlag: [{ required: true, message: '必填', trigger: 'change' }],
        },
        downloadLoading: false
      }
    },
    created() {
      this.initDishFlavor();
      this.initDishStatus();
      this.initCategory();
      this.initEnableFlag();
      this.getList();
    },
    methods: {
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
      changeDishStatus(row,status){
        this.temp = row;
        this.temp.dishStatus=status;
        changeDishStatus(this.temp).then(response => {
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
      initDishFlavor() {
        findValueByDataKey(this.$global.dishFlavor).then(response => {
          this.calendarDishFlavorOptions = response.datas;
        })
      },
      initCategory() {
        initfetchList().then(response => {
          this.calendarCategoryOptions = response.datas;
        })
      },
      formatCategory(row){
        for(let x of this.calendarCategoryOptions){
          if (row.categoryId === x.id) {
            return x.categoryName;
          }
        }
      },
      initDishStatus() {
        findValueByDataKey(this.$global.dishStatus).then(response => {
          this.calendarDishStatusOptions = response.datas;
        })
      },
      formatDishStatus(row){
        for(let x of this.calendarDishStatusOptions){
          if (row.dishStatus === x.dataValue) {
            return x.discriptioin;
          }
        }
      },
      //查询分页
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.list = response.datas.records;
          this.total = response.datas.total;
          console.log('查询菜品信息返回:' + response.datas);
          setTimeout(() => {
            this.listLoading = false
          }, 1000)
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
      // 重新刷新页面
      handleFilter() {
        this.listQuery.pageNum = 1;
        this.getList()
      },
      // 重置表单
      resetTemp() {
        this.temp = {
          id: '',
          dishName: '',
          dishNumber:'',
          categoryId:'',
          price:'',
          reducePrice:'',
          code:'',
          description:'',
          dishStatus:'',
          checkedIds:[],
          sortNo:'',
          enableFlag: '',
          affixVo:{
            id: '',
            businessId: '',
            pathUrl: ''
          }
        }
      },
      affixData(){
        return {
          "businessType":this.$global.dish
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
      changImage(row){
        this.resetTemp();
        this.temp = row;
        this.srcList=row.affixVo.pathUrl;
        this.drawer = true
      },
      // 处理添加
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
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
          this.$refs['dataForm'].clearValidate();
        });
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
</style>
