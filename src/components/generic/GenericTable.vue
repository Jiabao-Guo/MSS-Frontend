<template>
  <!--------------------------------------------------------
  Control
  -------------------------------------------------------->
  <el-card>
    <h3>Pagination Control</h3>

    <el-form inline size="small">
      <el-form-item label="Size">
        <el-radio-group v-model="small">
          <el-radio-button :label="false">Medium</el-radio-button>
          <el-radio-button :label="true">Small</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Show Background">
        <el-switch v-model="background"/>
      </el-form-item>

      <el-form-item label="Disabled">
        <el-switch v-model="disabled"/>
      </el-form-item>
    </el-form>

    <el-divider direction="horizontal"/>

    <h3>Filters & Management</h3>


    <el-form inline size="small">
      <el-form-item
          v-for="c in columns"
          :key="c.prop"
          :prop="c.prop"
          :label="c.label"
      >
        <div v-if="c.form.dataType === 'string'">
          <el-input
              v-model="form[c.prop]"
              autocomplete="off"
              :placeholder="c.label"
          />
        </div>

        <div v-else-if="c.form.dataType === 'number'">
          <el-input
              v-model="form[c.prop]"
              :placeholder="c.label"
          />
        </div>

        <div v-else-if="c.form.dataType === 'number-range'">
          <el-row>
            <el-col :span="6">
              <el-input
                  v-model="form[c.form.minKey]"
                  placeholder="Min"
              />
            </el-col>
            <div style="margin: 0 4px">~</div>
            <el-col :span="6">
              <el-input
                  v-model="form[c.form.maxKey]"
                  placeholder="Max"
              />
            </el-col>
          </el-row>
        </div>

        <div v-else-if="c.form.dataType === 'datetime'">
          <el-date-picker
              v-model="form[c.prop]"
              type="date"
              placeholder="Select date"
          />
        </div>

        <div v-else-if="c.form.dataType === 'select'">
          <el-select v-model="form[c.prop]" placeholder="Select One">
            <el-option
                v-for="option in c.form.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            />
          </el-select>
        </div>

        <div v-else-if="c.form.dataType === 'switch'">
          <el-switch v-model="form[c.prop]"/>
        </div>

        <div v-else>
          Error type: {{ c.form.dataType }}
        </div>
      </el-form-item>

      <slot name="filter"/>
    </el-form>

    <el-button type="success" size="default">
      <el-icon><Check/></el-icon>&nbsp;
      Apply Filter
    </el-button>

    <!--------------------------------------------------------
    Divider
    -------------------------------------------------------->
    <el-divider direction="horizontal"/>

    <el-button
        type="primary"
        @click="handleAddModel"
    >
      <el-icon><Plus/></el-icon>&nbsp;
      Add {{ noun }}
    </el-button>

    <el-button
        type="danger"
        @click="handleDeleteModel"
        v-if="currentSelection.length > 0"
        :disabled="currentSelection.length === 0"
    >
      <el-icon><Close/></el-icon>&nbsp;
      Delete {{ noun }}
    </el-button>

    <slot name="management"/>
  </el-card>

  <!--------------------------------------------------------
  Pagination
  -------------------------------------------------------->
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

  <!--------------------------------------------------------
  Table
  -------------------------------------------------------->
  <el-table
      :data="tableData"
      :class-name="`data-table ${tableClass}`"
      v-loading="loading"
      stripe class="data-table"
      @cell-dblclick="handleCellDoubleClick"
      @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"/>

    <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
    />
  </el-table>

  <!--------------------------------------------------------
  Add Dialog
  -------------------------------------------------------->

  <!-- Class not working -->
  <el-dialog
      v-model="shouldShowAddingDialog"
      style="border-radius: 8px"
      class="create-dialog"
      :title="`Create ${noun}`"
      width="450px"
      draggable
  >
    <el-form :model="form" :rules="rules" label-width="150px">

    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="shouldShowAddingDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleConfirmAddingModel">
          <el-icon><Check/></el-icon>&nbsp;
          Create {{ noun }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/*
columns: [
  {
    prop: String,
    label: String,
    width: number,
    form: {
      dataType: 'string' | 'number' | 'number-range' | 'datetime' | 'select' | 'switch',
      {{
        options?: {label: String, value: String}[],
        min?: number,
        max?: number,
      }}
    },
    rules: [
      {
        required: boolean,
        message: String,
      }
    ]
  }
]
*/

import {onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import Net from "@/components/util/network";
import {
  Check, Checked, CircleCheck,
    Plus, Close
} from '@element-plus/icons-vue'

const props = defineProps({
  model: String,
  noun: String,
  modelKey: String,
  columns: Array,
  queryForm: Object,
  tableClass: String,
})

const rules = reactive(props.columns.reduce((acc, column) => {
  acc[column.prop] = column.rules
  return acc
}, {}))

const form = reactive(props.columns.reduce((acc, column) => {
  acc[column.prop] = ''
  return acc
}, {}))

const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const currentPage = ref(1)
const pageSize = ref(40)
const totalSize = ref(0)
const tableData = ref([])

const loading = ref(false)
const currentSelection = ref([])
const shouldShowAddingDialog = ref(false)

async function reloadTableData() {
  loading.value = true
  let response = await Net.get(`/${props.model}`, {
    page: currentPage.value - 1,
    amount: pageSize.value,
    ...props.queryForm
  }).finally(() => {
    loading.value = false
  })

  tableData.value = response.data.content
  totalSize.value = response.data['totalElements']
}

function handleAddModel() {
  shouldShowAddingDialog.value = true
}

function handleConfirmAddingModel() {
  shouldShowAddingDialog.value = false
}

function handleSelectionChange(selection) {
  currentSelection.value = selection
}

function handleSizeChange() {
  reloadTableData()
}

function handleCurrentChange() {
  reloadTableData()
}

async function handleCellDoubleClick(row, column) {
  // 要修改的项目，比如双击的是name，那property就是name.
  let property = column.property;

  if (!property) {
    return
  }

  // row就是整行的json
  let action = await ElMessageBox.prompt(`Please input the new ${property}.`, "Edit", {
    // 把现在的值传进去
    inputValue: row[property],
    //正则 不能为空字符
    inputPattern: /.+/,
    inputErrorMessage: `${property} must not be empty.`
  })

  row[property] = action.value
  let response = await Net.put(`/${props.model}/${row[props.modelKey]}`, row)

  ElMessage({
    message: response.data.message,
    type: response.data['success'] ? 'success' : 'error'
  })
  await reloadTableData()
}

async function handleDeleteModel() {
  let action = await ElMessageBox.confirm(
      'Are you sure delete it?', "Warning", {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning",
      }
  )

  if (action === "cancel") {
    return
  }

  let selectedModelNumbers = currentSelection.value
      //x为 currentSelection中每个对象
      .map((x) => x[props.modelKey])
      .join(",")   //数组.join()分割为字符串加逗号

  Net.delete(`/${props.model}/${selectedModelNumbers}`).then(response => {
    ElMessage({
      message: response.data.message,
      type: response.data['success'] ? 'success' : 'error'
    })
    reloadTableData()
  })
}

onMounted(reloadTableData)

</script>


<style lang="scss" scoped>
@import "src/assets/main";

.card-header {
  display: flex;
  vertical-align: center;
  justify-content: space-between;
}

.card-title {
  align-self: center;
}

.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
}

.data-table {
  width: 100%;
}


</style>
