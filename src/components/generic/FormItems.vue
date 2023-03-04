<template>
  <el-form
      :ref="formRef"
      :rules="rules"
      :inline="inline"
      :size="size"
      :label-position="labelPosition"
      :label-width="labelWidth"
  >
    <el-form-item
        v-for="c in columns.filter(x => mode === 'create' ? x.asInsert : x.asFilter)"
        :key="c.prop"
        :prop="c.prop"
        :label="c.label"
    >
      <div v-if="c.dataType === 'string'">
        <el-input
            v-model="targetForm[getProp(c)]"
            :placeholder="c.label"
            clearable
            @keydown.enter="$emit('apply-filter')"
        />
      </div>

      <div v-else-if="c.dataType === 'number'">
        <el-input
            v-model="targetForm[getProp(c)]"
            :placeholder="c.label"
            clearable
            @keydown.enter="$emit('apply-filter')"
        />
      </div>

      <div v-else-if="c.dataType === 'number-range'">
        <el-row v-if="mode === 'filter'">
          <el-col :span="10">
            <el-input
                v-model="targetForm[c.filterForm.minKey]"
                placeholder="Min (Inclusive)"
                clearable
                @keydown.enter="$emit('apply-filter')"
            />
          </el-col>
          <div style="margin: 0 4px">~</div>
          <el-col :span="10">
            <el-input
                v-model="targetForm[c.filterForm.maxKey]"
                placeholder="Max (Inclusive)"
                clearable
                @keydown.enter="$emit('apply-filter')"
            />
          </el-col>
        </el-row>
        <el-input
            v-else
            v-model="targetForm[getProp(c)]"
            :placeholder="c.label"
            clearable
            @keydown.enter="$emit('apply-filter')"
        />
      </div>

      <div v-else-if="c.dataType === 'datetime'">
        <el-date-picker
            v-model="targetForm[getProp(c)]"
            type="date"
            placeholder="Select date"
            clearable
        />
      </div>

      <div v-else-if="c.dataType === 'select'">
        <el-select v-model="targetForm[getProp(c)]" clearable placeholder="Select One">
          <el-option
              v-for="option in c.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
          />

          <el-option
            v-if="mode === 'filter'"
            :key="c.toString()"
            label="Doesn't matter"
            value=""
          />
        </el-select>
      </div>

      <div v-else-if="c.dataType === 'switch'">
        <el-switch v-model="targetForm[getProp(c)]"/>
      </div>

      <div v-else>
        Error type: {{ c.dataType }}
      </div>
    </el-form-item>

    <slot name="filter"/>
  </el-form>
</template>

<script setup>

// mode: 'create' | 'filter'
defineProps({
  columns: Array,
  targetForm: Object,
  mode: String,
  formRef: String,
  inline: Boolean,
  size: {},
  labelPosition: {},
  labelWidth: {
    type: String,
    required: false
  },
  rules: {
    type: Object,
    required: false
  },
})

defineEmits(['apply-filter'])

function getProp(c) {
  if (c.alias) {
    return c.alias[c.prop] || c.prop
  }
  return c.prop
}
</script>

<style scoped>

</style>
