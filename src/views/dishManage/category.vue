<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.categoryName" :placeholder="$t('table.categoryName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.categoryType" :placeholder="$t('table.categoryType')" clearable style="width: 190px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in calendarCategoryTypeOptions" :key="item.dataValue" :label="item.discriptioin" :value="item.dataValue" />
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
      <el-table-column :label="$t('table.categoryName')" prop="categoryName" min-width="200px" />
      <el-table-column :label="$t('table.categoryType')" prop="categoryType" width="200px" :formatter="formatCategoryType"/>
      <el-table-column :label="$t('table.sortNo')" prop="sortNo" width="95px" />
      <el-table-column :label="$t('table.createdTime')" prop="createdTime" min-width="120px"/>
      <el-table-column :label="$t('table.enableFlag')" prop="enableFlag" width="200px" :formatter="formatEnableFlag"/>
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
        <el-form-item :label="$t('table.categoryName')" prop="categoryName">
          <el-input v-model="temp.categoryName" />
        </el-form-item>
        <el-form-item :label="$t('table.categoryType')" prop="enableFlag">
          <el-select v-model="temp.categoryType" clearable class="filter-item" :placeholder="$t('table.PleaseSelect')">
            <el-option v-for="item in calendarCategoryTypeOptions" :key="item.dataValue" :label="item.discriptioin" :value="item.dataValue" />
          </el-select>
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
  import { fetchList,createInfo,updateInfo,deleteInfo,changeEnableFlag } from '@/api/category'
  import { findValueByDataKey } from '@/api/datadict'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  const calendarEnableFlagOptions = [];

  const calendarCategoryTypeOptions=[];

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
          categoryName: '',
          categoryType:'',
          enableFlag: ''
        },
        calendarEnableFlagOptions,
        calendarCategoryTypeOptions,
        showReviewer: false,
        // 表单提交字段
        temp: {
          id: '',
          categoryName: '',
          categoryType:'',
          checkedIds:[],
          enableFlag: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑分类',
          create: '添加分类'
        },
        rules: {
          categoryName: [{ required: true, message: '必填', trigger: 'blur' }],
          categoryType: [{ required: true, message: '必填', trigger: 'blur' }],
          enableFlag: [{ required: true, message: '必填', trigger: 'change' }],
        },
        downloadLoading: false
      }
    },
    created() {
      this.initCategoryType();
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
      initCategoryType() {
        findValueByDataKey(this.$global.categoryType).then(response => {
          this.calendarCategoryTypeOptions = response.datas;
        })
      },
      formatCategoryType(row){
        for(let x of this.calendarCategoryTypeOptions){
          if (row.categoryType === x.dataValue) {
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
          console.log('查询分类信息返回:' + response.datas);
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
          categoryName: '',
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
