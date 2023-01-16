<template>
  <el-table :data="tableData" stripe class="data-table">
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
        background: <el-switch v-model="background" class="ml-2" />
      </td>
      <td>
        disabled: <el-switch v-model="disabled" class="ml-2" />
      </td>
    </tr></table>
  </div>

  <el-pagination
      class="pager"
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
</template>
<script>
import axios from "axios";
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
      tableData: []
    }
  },

  mounted() {

    //loadPage应该出现3次
    this.loadPage()
  },
  methods: {
    handleSizeChange(val) {
      //每当页码改变时候 要刷新一遍
      this.loadPage()
    },
    handleCurrentChange(val) {
      this.loadPage()
    },

    loadPage() {
      // 格式: http://a.com/xxx?name=Bob&age=20&salary=10000
      // 根据后端的 InstructorController
      //@RequestMapping("/instructor")
      //@Request..前段传来的数据
      // Page<Instructor> findAll(@RequestParam Integer [page], @RequestParam Integer [amount]) {
         //构造pageable
       //  Pageable pageable = PageRequest.of(page, amount);
       // return instructorRepository.findAll(pageable);
     // }

      axios.get(`http://localhost:8080/instructor?page=${this.currentPage-1}&amount=${this.pageSize}`)
          .then(response => {
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
.pager {
  width: 200px;
}
</style>
