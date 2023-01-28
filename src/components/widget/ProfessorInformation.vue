<template>
  <!-- 筛选 -->
  <el-form :inline="true" :model="queryForm">
    <el-form-item label="Salary Range">
      <div>
        <el-input v-model="queryForm.min" placeholder="Min salary" style="width: 100px" />
        ~
        <el-input v-model="queryForm.max" placeholder="Max salary" style="width: 100px" />
      </div>
    </el-form-item>

    <el-form-item label="Professor Name">
      <el-input v-model="queryForm.name"  placeholder="Professor name" />
    </el-form-item>

    <el-form-item>
      <el-button @click="handleQuery">Query</el-button>
    </el-form-item>

    <el-form-item>
      <el-button @click="handleDelete" type="danger" :disabled="currentSelection.length === 0">Delete</el-button>
    </el-form-item>

    <el-form-item>
      <el-button text @click="handleAddInstructor">
        Add Instructor
      </el-button>
    </el-form-item>
  </el-form>

  <!-- 表格 -->
  <el-table :data="tableData"
            v-loading="loading"
            stripe class="data-table"
            @cell-dblclick="handleCellDoubleClick"
            @selection-change="handleSelectionChange">

    <el-table-column type="selection" width="55" />
    <el-table-column prop="instructorNumber" label="Instructor Number" width="180" />
    <el-table-column prop="salary" label="Salary" width="180" />
    <el-table-column prop="name" label="Name" />

  </el-table>

  <div class="flex items-center mb-4">
    <table><tr>
      <td>
        <el-radio-group v-model="small" class="mr-4">
          <el-radio-button :label="false">default</el-radio-button>
          <el-radio-button :label="true">small</el-radio-button>
        </el-radio-group>
      </td>
      <td>
        background <el-switch v-model="background" class="ml-2" />
      </td>
      <td>
        disabled <el-switch v-model="disabled" class="ml-2" />
      </td>
    </tr></table>
  </div>

  <el-pagination
      class="pager"
      v-loading="loading"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[20, 40, 60, 80]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />


  //增加教授信息
  <el-dialog v-model="shouldShowAddingDialog" title="Adding Instructor Information" width="450px">
    <el-form :model="addForm" :rules="addFormRules">
      <el-form-item prop="instructorNumber" label="Instructor Number" :label-width="formLabelWidth">
        <el-input v-model="addForm.instructorNumber" autocomplete="off" />
      </el-form-item>

      <el-form-item prop="salary" label="Salary" :label-width="formLabelWidth">
        <el-input v-model="addForm.salary" autocomplete="off" />
      </el-form-item>

      <el-form-item prop="name" label="Name" :label-width="formLabelWidth">
        <el-input v-model="addForm.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="shouldShowAddingDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleConfirmAddingInstructor">
          Add Instructor
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>


<script>
import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
export default {
  data() {
    return {
      size:'default',
      formSize:'default',
      small: false,
      background: false,
      disabled: false,
      currentPage: 1,
      pageSize: 40,

      totalSize: 0,
      tableData: [],

      queryForm: {
        min: '',
        max: '',
        name:''
      },

      addForm: {
        instructorNumber: '',
        salary: '',
        name: ''
      },

      addFormRules: {
        instructorNumber: [
          { required: true, message: 'Instructor number must not be empty' },
        ],
        salary: [
          { required: true, message: 'Salary must not be empty' },
        ],
        name: [
          { required: true, message: 'Name must not be empty' },
        ]
      },

      loading: false,
      currentSelection: [],
      shouldShowAddingDialog: false
    }
  },

  mounted() {
    //loadPage应该出现3次
    //this.loadPage()
    this.handleQuery()
  },
  methods: {
    handleAddInstructor() {
      this.shouldShowAddingDialog = true
    },
    handleConfirmAddingInstructor() {
      this.shouldShowAddingDialog = false
    },
    handleSelectionChange(selection) {
      this.currentSelection = selection
    },
    handleSizeChange(val) {
      //每当页码改变时候 要刷新一遍
      //this.loadPage()
      this.handleQuery()
    },
    handleCurrentChange(val) {
      //this.loadPage()
      this.handleQuery()
    },

    handleCellDoubleClick(row, column) {
      // 要修改的项目，比如双击的是name，那property就是name.
      let property = column.property;

      // row就是整行的json
      // 对于双击name的情形，row = { instructorNumber: 2, salary: 17000, name: Adam Gittins" }

      // 所以这时候要问用户：你想把(property)改成什么？

      // row.name = "Zhang san"
      // =
      // row["name"] = "Zhang san"
      // =
      // let xxx = "name"
      // row[xxx] = "Zhang san"
      // !=
      // row.xxx = "Zhang san"
      // =
      // row["xxx"] = "Zhang san"

      ElMessageBox.prompt(`Please input the new ${property}.`, "Edit", {
        // 把现在的值传进去
        inputValue: row[property],
        //正则 不能为空字符
        inputPattern: /.+/,
        inputErrorMessage: `${property} must not be empty.`
      })
          .then(({ value }) => {
            //使用更改的value 去更新 老的row
            row[property] = value
            // 用户点了OK之后，会自动执行.then里面的代码
            axios.put(`http://localhost:8080/instructor/${row.instructorNumber}`,row).then(response => {
              // 根据后端ResponseEntity<InstructorModifyResponse> modifyInstructor() 的参数
                ElMessage({
                  message: response.data.messages,
                  type: response.data.isSuccess ? 'success' : 'error'
                })
              this.handleQuery()
            })
          });
    },

    handleQuery() {
      this.loading = true

      let minResult = parseFloat(this.queryForm.min)
      let maxResult = parseFloat(this.queryForm.max)
      let nameResult = this.queryForm.name;

      // undefined, null, "", 均视为false
      if (isNaN(minResult) || !minResult) {
        minResult = -2147483647 - 1;
      }
      if(isNaN(maxResult) || !maxResult){
        maxResult = 2147483647; // (2 << 30) - 1;
      }

      // undefined, null
      if (!nameResult) {
        nameResult = "";
      }


      /*
    private Integer page;
    private Integer amount;
    private Double min;
    private Double max;
    private String name;
       */

      axios.post("http://localhost:8080/instructor/query", {
        page: this.currentPage - 1,
        amount: this.pageSize,
        min:minResult,
        max:maxResult,
        name:nameResult
      }).then(response => {
        this.tableData = response.data.content
        this.totalSize = response.data.totalElements
      }).finally(() => {
        this.loading = false
      })
    },

    // @DeleteMapping("/instructor/{instructorNumbers}")
    handleDelete() {
      ElMessageBox.confirm(
          'Are you sure delete it?', "Warning", {
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            type: "warning",
          }
      ).then(() => {
        // f(x) = x+1
        // S = {1,2,3,4}
        // T = {f(1),f(2),f(3),f(4)}

        // f(prof) = prof.num
        // S = [ {num:1,name:xxx}, {num:2,name:yyy} ]
        // T = [1,2]
        // T1 = f(s1) = s1.num
        // T2 =

        // S map with f = T

        let instructorNumbers1 = this.currentSelection
            //x为 currentSelection中每个对象
            .map((x) => x.instructorNumber)
            .join(",")   //数组.join()分割为字符串加逗号

        axios.delete(`http://localhost:8080/instructor/${instructorNumbers1}`).then(response => {
          // 根据后端ResponseEntity<InstructorModifyResponse> modifyInstructor() 的参数
          ElMessage({
            message: response.data.messages,
            type: response.data.isSuccess ? 'success' : 'error'
          })
          this.handleQuery()
        })
      })
    },
    loadPage_Unused() {
      //get适用于 不做更新删除 只有查询
      // get格式: http://a.com/xxx? 后端需要的参数 =${this.currentPage-1}&后端需要的参数=${this.pageSize}
      // 根据后端的 InstructorController
      //@RequestMapping("/instructor")
      //@Request..前段传来的数据
      // Page<Instructor> findAll(@RequestParam Integer [[page]], @RequestParam Integer [[amount]]) {
         //构造pageable
       //  Pageable pageable = PageRequest.of(page, amount);
       // return instructorRepository.findAll(pageable);
     // }

      axios.get(`http://localhost:8080/instructor?page=${this.currentPage-1}&amount=${this.pageSize}`)
          .then(response => {
            //可以将需要的 字段 全部打印出来..通过打印 可以知道从后端取出了哪些字段,例如:content和totalElements
            console.log(response)
        // 得到的instructor数组
        this.tableData = response.data.content

        // 总数信息
        this.totalSize = response.data.totalElements
      })
    }

  }
}

</script>

<style scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
td {
  padding: 2px 8px;
}
.data-table {
  width: 100%;
  height: 500px;
  margin-bottom: 20px
}
.mb-4 {
  margin-bottom: 4px;
}
</style>
