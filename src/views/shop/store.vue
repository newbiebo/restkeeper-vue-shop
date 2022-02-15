<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.storeName" :placeholder="$t('table.storeName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column :label="$t('table.storeName')" prop="storeName" min-width="150px" />
      <el-table-column :label="$t('table.brandId')" prop="brandId" width="150px" :formatter="formatBrand" />
      <el-table-column :label="$t('table.address')" prop="address" width="150px" />
      <el-table-column :label="$t('table.managerId')" prop="managerId" width="150px" :formatter="formatUser"/>
      <el-table-column :label="$t('table.enableFlag')" prop="enableFlag" width="150px" :formatter="formatEnableFlag"/>
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
        <el-form-item :label="$t('table.storeName')" prop="storeName">
          <el-input v-model="temp.storeName" />
        </el-form-item>
        <el-form-item :label="$t('table.brandId')" prop="brandId">
          <el-select v-model="temp.brandId" clearable class="filter-item" :placeholder="$t('table.PleaseSelect')">
            <el-option v-for="item in calendarBrandOptions" :key="item.id" :label="item.brandName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.managerId')" prop="managerId">
          <el-select v-model="temp.managerId" clearable class="filter-item" :placeholder="$t('table.PleaseSelect')">
            <el-option v-for="item in calendarUserOptions" :key="item.id" :label="item.realName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.province')" prop="province">
          <el-select
            filterable
            v-model="temp.province"
            class="filter-item"
            @change="clearCity"
            :placeholder="$t('table.PleaseSelect')">
            <el-option v-for="item in calendarProvinceOptions" :key="item.id" :label="item.cityName" :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('table.city')" prop="city">
          <el-select
            filterable
            v-model="temp.city"
            class="filter-item"
            @change="clearArea"
            :placeholder="$t('table.PleaseSelect')">
            <el-option v-for="item in calendarCityOptions" :key="item.id" :label="item.cityName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.area')" prop="area">
          <el-select
            filterable
            v-model="temp.area"
            class="filter-item"
            :placeholder="$t('table.PleaseSelect')">
            <el-option v-for="item in calendarAreaOptions" :key="item.id" :label="item.cityName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.address')" prop="address">
          <el-input v-model="temp.address" />
        </el-form-item>
        <el-form-item :label="$t('table.longitude')" prop="longitude">
          <el-input v-model="temp.longitude" />
        </el-form-item>
        <el-form-item :label="$t('table.dimensionality')" prop="dimensionality">
          <el-input v-model="temp.dimensionality" />
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
  import { fetchList,createInfo,updateInfo,deleteInfo,changeEnableFlag } from '@/api/store'
  import { findUserVoList } from '@/api/user'
  import { findValueByDataKey } from '@/api/datadict'
  import { initfetchList } from '@/api/brand'
  import { fetchPlaces } from '@/api/places'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { validUsername, validEmail } from '@/utils/validate'

  const calendarEnableFlagOptions = [];

  const calendarProvinceOptions = [];

  const calendarCityOptions = [];

  const calendarAreaOptions = [];

  const calendarBrandOptions = [];
  
  const calendarUserOptions=[];

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        // 查询条件
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          storeName: '',
          enableFlag: ''
        },
        calendarEnableFlagOptions,
        calendarProvinceOptions,
        calendarCityOptions,
        calendarAreaOptions,
        calendarBrandOptions,
        calendarUserOptions,
        showReviewer: false,
        // 表单提交字段
        temp: {
          id: '',
          brandId:'',
          storeName: '',
          area: '',
          city: '',
          address: '',
          managerId:'',
          longitude:'',
          dimensionality:'',
          checkedIds:[],
          enableFlag: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑门店',
          create: '添加门店'
        },
        rules: {
          brandId: [{ required: true, message: '必填',trigger: 'change'}],
          storeName: [{ required: true, message: '必填', trigger: 'blur' }],
          province: [{ required: true, message: '必填', trigger: 'change' }],
          city: [{ required: true, message: '必填',trigger: 'blur'}],
          area: [{ required: true, message: '必填', trigger: 'blur' }],
          address: [{ required: true, message: '必填', trigger: 'blur' }],
          managerId: [{ required: true, message: '必填',trigger: 'change'}],
          longitude: [{ required: true, message: '必填', trigger: 'blur' }],
          dimensionality: [{ required: true, message: '必填', trigger: 'blur' }],
          enableFlag: [{ required: true, message: '必填', trigger: 'change' }],
        },
        downloadLoading: false
      }
    },
    created() {
      this.initUser();
      this.initEnableFlag();
      this.initBrand();
      this.getList();
    },
    methods: {
      //查询分页
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.list = response.datas.records;
          this.total = response.datas.total;
          console.log('查询品牌信息返回:' + response.datas);
          setTimeout(() => {
            this.listLoading = false
          }, 1000)
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
      initProvince(provinceId) {
        fetchPlaces(provinceId).then(response => {
          this.calendarProvinceOptions = response.datas;
        })
      },
      initCity(cityId) {
        fetchPlaces(cityId).then(response => {
          this.calendarCityOptions = response.datas;
        })
      },
      clearCity(cityId) {
        fetchPlaces(cityId).then(response => {
          this.calendarCityOptions = response.datas;
          this.temp.city=null;
          this.temp.area=null;
        })
      },
      initArea(areaId) {
        fetchPlaces(areaId).then(response => {
          this.calendarAreaOptions = response.datas;
        })
      },
      clearArea(areaId) {
        fetchPlaces(areaId).then(response => {
          this.calendarAreaOptions = response.datas;
          this.temp.area=null;
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
      initBrand(){
        initfetchList().then(response => {
          this.calendarBrandOptions = response.datas;
        })
      },
      formatBrand(row){
        for(let x of this.calendarBrandOptions){
          if (row.brandId === x.id) {
            return x.brandName;
          }
        }
      },
      initUser(){
        findUserVoList().then(response => {
          this.calendarUserOptions = response.datas;
        })
      },
      formatUser(row){
        for(let x of this.calendarUserOptions){
          if (row.managerId === x.id) {
            return x.realName;
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
          brandId:'',
          storeName: '',
          area: '',
          city: '',
          address: '',
          managerId:'',
          longitude:'',
          dimensionality:'',
          checkedIds:[],
          enableFlag: ''
        }
      },
      // 处理添加
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
          this.initProvince(this.$global.defaultCity)
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
        this.initProvince(this.$global.defaultCity);
        this.initCity(this.temp.province);
        this.initArea(this.temp.city)
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
</style>
