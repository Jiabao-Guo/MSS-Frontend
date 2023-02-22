<template>
  <!--------------------------------------------------------
  Control
  -------------------------------------------------------->
  <el-card v-loading="loading" class="gt-card">

    <div v-if="!disablePaginationControl">
      <h3>Pagination Control</h3>

      <el-form inline size="small">
        <el-form-item label="Size">
          <el-radio-group v-model="shouldUseSmallPaginationSize">
            <el-radio-button :label="false">Medium</el-radio-button>
            <el-radio-button :label="true">Small</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Show Background">
          <el-switch v-model="shouldShowBackground"/>
        </el-form-item>

        <el-form-item label="Disabled">
          <el-switch v-model="paginationDisabled"/>
        </el-form-item>
      </el-form>

      <el-divider direction="horizontal"/>
    </div>

    <slot name="header"/>

    <h3>Filters & Management</h3>

    <FormItems
        :columns="columns"
        :target-form="filterForm"
        mode="filter"
        form-ref="filterFormRef"
        inline
        size="small"
        label-position="left"
        @apply-filter="reloadTableData"
    />

    <el-button type="success" size="default" @click="handleApplyFilter">
      <el-icon>
        <Check/>
      </el-icon>&nbsp;
      Apply Filter
    </el-button>

    <div v-if="!viewOnly">
      <!--------------------------------------------------------
      Divider
      -------------------------------------------------------->
      <el-divider direction="horizontal"/>

      <el-dropdown style="margin-right: 10px;">
        <el-button type="primary">
          <el-icon>
            <Plus/>
          </el-icon>&nbsp;
          Add {{ noun }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleAddModel">
              Add One
            </el-dropdown-item>

            <el-dropdown-item @click="handleImportFromCSV">
              Import From CSV
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

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

      <el-button @click="reloadTableData">
        <el-icon>
          <Refresh/>
        </el-icon>&nbsp;
        Refresh
      </el-button>
    </div>

    <slot name="management"/>
  </el-card>

  <slot name="table-header"/>
  <!--------------------------------------------------------
  Pagination
  -------------------------------------------------------->
  <el-pagination
      class="gt-pager"
      v-loading="loading"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[20, 40, 60, 80]"
      :small="shouldUseSmallPaginationSize"
      :disabled="paginationDisabled"
      :background="shouldShowBackground"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />

  <!--------------------------------------------------------
  Table
  -------------------------------------------------------->
  <el-upload
      drag
      ref="uploaderRef"
      v-model:file-list="uploadFileList"
      :name="uploadFileFieldName"
      :method="uploadMethod"
      :action="uploadAction"
      :headers="uploadHeaders"
      :multiple="false"
      :accept="uploadAcceptType"
      :auto-upload="uploadShouldAutoUpload"
      :on-success="handleUploadSuccess"
  >
    <el-table
        :data="tableData"
        :class-name="`data-table ${tableClass}`"
        v-loading="loading"
        stripe
        class="gt-data-table"
        cell-class-name="gt-data-table-cell"
        @click="(e) => e.stopPropagation()"
        @cell-click="handleCellClick"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>

      <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          sortable
      >
        <template #default="scope">
        <span v-if="column.dataType === 'switch'">
          <el-switch
              v-model="scope.row[column.prop]"
              :active-value="1"
              :inactive-value="0"
              :disabled="true"
          />
        </span>
        <span v-else-if="column.dataType === 'select'">
          {{ column.options.find(x => x.value === scope.row[column.prop]).label }}
        </span>
        </template>
      </el-table-column>
    </el-table>
  </el-upload>

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
  Check, Refresh,
  Plus, Close
} from '@element-plus/icons-vue'
import FormItems from "@/components/generic/FormItems.vue";
import {useDefaultConfig, useDefaultElMessageBoxConfig, useTasks} from "@/components/util/global";

/// ================== Props ==================
const props = defineProps({
  model: String,
  noun: String,
  modelKey: String,
  columns: Array,
  tableClass: String,
  viewOnly: {
    type: Boolean,
    required: false,
  },
  disablePaginationControl: {
    type: Boolean,
    required: false,
  },
})

const uploadFileFieldName = "file"
const uploadMethod = "POST"
const uploadAction = `${Net.baseUrl()}/${props.model}/upload`
const uploadHeaders = Net.defaultHeaders()
const uploadAcceptType = "text/csv"
const uploadShouldAutoUpload = true

/// ================== Emits ==================
const emit = defineEmits(['selection-updated'])

/// ================== Bindings ==================
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

const shouldUseSmallPaginationSize = ref(false)
const shouldShowBackground = ref(true)
const paginationDisabled = ref(false)
const uploaderRef = ref(null)
let uploadFileList = reactive([])

const currentPage = ref(1)
const pageSize = ref(40)
const totalSize = ref(0)
const tableData = ref([])

const loading = ref(false)
const currentSelection = ref([])
const shouldShowAddingDialog = ref(false)

/// ================== Logics ==================
const defaultElConfig = useDefaultElMessageBoxConfig()
const config = useDefaultConfig()

function getProp(p, defaultKey) {
  return (p.alias || {})[defaultKey] || defaultKey
}

async function reloadTableData() {
  if (loading.value) {
    return
  }
  loading.value = true
  let response = await Net.get(`/${props.model}`, {
    page: currentPage.value - 1,
    amount: pageSize.value,
    ...filterForm
  }).finally(() => {
    setTimeout(() => {
      loading.value = false
    }, config.minLoadingTimeMillis)
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
  emit('selection-updated', selection)
}

function handleSizeChange() {
  reloadTableData()
}

function handleCurrentChange() {
  reloadTableData()
}

function accessNestedProperty(obj, path) {
  return path.split('.').reduce((acc, cur) => acc[cur], obj)
}

async function handleCellClick(row, column) {
  // 要修改的项目，比如双击的是name，那property就是name.
  let targetColumn = props.columns.find((c) => c.label === column.label)

  if (!targetColumn) {
    return
  }

  let property = getProp(targetColumn, targetColumn.prop);

  if (!property || !targetColumn.modifiable) {
    return
  }

  // row就是整行的json
  let action = await ElMessageBox.prompt(`Input new ${targetColumn.label}:`, "Edit", {
    // 把现在的值传进去
    inputValue: accessNestedProperty(row, targetColumn.prop),
    //正则 不能为空字符
    inputPattern: /.+/,
    inputErrorMessage: `${property} must not be empty.`,
    inputValidator: targetColumn.createForm.validator || (() => true),
    ...defaultElConfig
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
        ...defaultElConfig
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
            ...defaultElConfig
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
      .catch(() => {
        ElMessageBox({
          title: 'Foreign Key Constraint Failed',
          message: `This ${getNounLowercased()} requires some entities that don't yet exist. Please create them first.`,
          type: 'error',
          ...defaultElConfig
        })
      })
  ElMessage({
    message: response.data.message,
    type: response.data['success'] ? 'success' : 'error'
  })
  await reloadTableData()
}

function handleImportFromCSV() {
  let uploadInput = document.createElement('input')
  uploadInput.type = 'file'
  uploadInput.accept = 'text/csv'
  uploadInput.onchange = (e) => {
    let file = e.target.files[0]
    if (!file) {
      return
    }
    uploaderRef.value.handleStart(file)
    uploaderRef.value.submit()
  }
  uploadInput.click()
}

function handleUploadSuccess(res) {
  if (!res.success) {
    ElMessage.error(res.message)
    return
  }

  useTasks().addTask(res.message)
}

onMounted(reloadTableData)

</script>


<style lang="scss">
@import "src/assets/main";

.gt-card-header {
  display: flex;
  vertical-align: center;
  justify-content: space-between;
}

.gt-card-title {
  align-self: center;
}

.gt-pager {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
}

.gt-data-table {
  width: 100%;
  border-radius: 12px;
  margin: 0;
  padding: 0;
}

.gt-data-table-cell {
  cursor: pointer;
}

.gt-card {
  border-radius: 12px;
  border: 0;
  box-shadow: black 0 0 !important;
}

.el-upload-dragger {
  cursor: pointer;
  border: none;
}

.el-upload-dragger, .el-upload-dragger.is-dragover {
  cursor: pointer;
  padding: 0;
}

</style>
