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

    <FormItems
        :columns="columns"
        :target-form="filterForm"
        mode="filter"
        form-ref="filterFormRef"
        inline
        size="small"
        label-position="left"
    />

    <el-button type="success" size="default" @click="handleApplyFilter">
      <el-icon>
        <Check/>
      </el-icon>&nbsp;
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
      <el-icon>
        <Plus/>
      </el-icon>&nbsp;
      Add {{ noun }}
    </el-button>

    <el-button
        type="danger"
        @click="handleDeleteModel"
        v-if="currentSelection.length > 0"
        :disabled="currentSelection.length === 0"
    >
      <el-icon>
        <Close/>
      </el-icon>&nbsp;
      Delete {{ currentSelection.length }} {{ noun }}(s)
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
      width="480px"
      draggable
  >

    <FormItems
        :columns="columns"
        :target-form="createForm"
        :rules="rules"
        mode="create"
        form-ref="filterFormRef"
        :inline="false"
        size="default"
        label-position="right"
        label-width="220px"
    />

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
import FormItems from "@/components/generic/FormItems.vue";

const props = defineProps({
  model: String,
  noun: String,
  modelKey: String,
  columns: Array,
  tableClass: String,
})

const rules = reactive(props.columns.reduce((acc, column) => {
  acc[getProp(column, column.prop)] = column.rules
  return acc
}, {}))

const filterForm = reactive(props.columns.reduce((acc, column) => {
  if (!column.asFilter) {
    return acc
  }
  for (let key in column.filterForm.defaultValues) {
    acc[getProp(column, key)] = column.filterForm.defaultValues[key]
  }
  return acc
}, {}))

const createForm = reactive(props.columns.reduce((acc, column) => {
  acc[getProp(column, column.prop)] = ''
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

function getProp(p, defaultKey) {
  return (p.alias || {})[defaultKey] || defaultKey
}

async function reloadTableData() {
  loading.value = true
  let response = await Net.get(`/${props.model}`, {
    page: currentPage.value - 1,
    amount: pageSize.value,
    ...filterForm
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
  handleCreateModel()
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
  let targetColumn = props.columns.find((c) => c.label === column.label)
  let property = getProp(targetColumn, targetColumn.prop);

  console.log(targetColumn, property)
  if (!property || !targetColumn.modifiable) {
    return
  }

  // row就是整行的json
  let action = await ElMessageBox.prompt(`Please input the new ${targetColumn.label}.`, "Edit", {
    // 把现在的值传进去
    inputValue: row[targetColumn.prop],
    //正则 不能为空字符
    inputPattern: /.+/,
    inputErrorMessage: `${property} must not be empty.`,
    draggable: true,
  }).catch(() => {
  })

  if (!action) {
    return
  }

  row[property] = action.value
  let response = await Net.put(`/${props.model}/${row[props.modelKey]}`, row)

  ElMessage({
    message: response.data.message,
    type: response.data['success'] ? 'success' : 'error'
  })
  await reloadTableData()
}

async function handleDeleteModel() {
  let refer = currentSelection.value.length > 0
      ? `these ${currentSelection.value.length}`
      : 'this'
  let action = await ElMessageBox.confirm(
      `Are you sure delete ${refer} ${getNounLowercased()}(s)?`, "Warning", {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning",
        draggable: true,
      }
  ).catch(() => {
  })

  if (action === "confirm") {
    let selectedModelNumbers = currentSelection.value
        .map((x) => x[props.modelKey])
        .join(",")

    Net.delete(`/${props.model}/${selectedModelNumbers}`)
        .then((res) => {
          ElMessage({
            message: res.data.message,
            type: res.data['success'] ? 'success' : 'error'
          })
        })
        .catch(() => {
          ElMessageBox({
            title: 'Foreign Key Constraint Failed',
            message: `These ${getNounLowercased()}(s) are still required in somewhere else. We can't delete them right now.`,
            type: 'error',
            draggable: true,
          })
        })
        .finally(() => {
          reloadTableData()
        })
  }
}

function getNounLowercased() {
  return props.noun.toLowerCase()
}

function handleApplyFilter() {
  reloadTableData()
}

async function handleCreateModel() {
  let response = await Net.post(`/${props.model}`, createForm)
  ElMessage({
    message: response.data.message,
    type: response.data['success'] ? 'success' : 'error'
  })
  await reloadTableData()
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
