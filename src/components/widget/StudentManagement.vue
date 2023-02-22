<template>
  <GenericTable
      model="student"
      noun="Student"
      model-key="id"
      :columns="columns"
  />
</template>

<script setup>
import {reactive} from "vue";
import GenericTable from "@/components/generic/GenericTable.vue";

const columns = reactive([
  {
    prop: 'studentNumber',
    label: 'Student Number',
    dataType: 'number',
    width: '180',
    asInsert: true,
    asFilter: true,
    modifiable: false,
    createForm: {
      rules: []
    },
    filterForm: {
      defaultValues: {
        studentNumber: ''
      }
    }
  },
  {
    prop: 'studentName',
    label: 'Name',
    dataType: 'string',
    width: '',
    asInsert: true,
    asFilter: true,
    modifiable: true,
    createForm: {
      rules: []
    },
    filterForm: {
      defaultValues: {
        name: ''
      },
    },
  },
  {
    prop: 'age',
    label: 'Age',
    dataType: 'number-range',
    width: '180',
    asInsert: true,
    asFilter: true,
    modifiable: true,
    createForm: {
      rules: []
    },
    filterForm: {
      minKey: 'ageMin',
      maxKey: 'ageMax',
      defaultValues: {
        min: '',
        max: ''
      },
    },
  },
  {
    prop: 'gender',
    label: 'Gender',
    dataType: 'select',
    options: [
      {label: 'Male', value: 'm'},
      {label: 'Female', value: 'f'},
    ],
    asInsert: true,
    asFilter: true,
    modifiable: true,
    createForm: {
      rules: [],
      validator: (v) => {
        if (v === 'f' || v === 'm') {
          return true
        }
        return "Gender must be either 'f' or 'm'"
      },
    },
    filterForm: {
      defaultValues: {
        gender: ''
      }
    }
  }
])

</script>

<style scoped>

</style>
