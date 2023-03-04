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
    prop: 'uid',
    label: 'UID',
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
    prop: 'name',
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
    prop: 'email',
    label: 'Email',
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
        email: ''
      },
    },
  },
  {
    prop: 'studentInfo.age',
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
      minKey: 'ageLowerBound',
      maxKey: 'ageUpperBound',
      defaultValues: {
        ageLowerBound: '',
        ageUpperBound: ''
      },
    }
  },
  {
    prop: 'studentInfo.gender',
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
        'studentInfo.gender': ''
      }
    },
    alias: {
      'studentInfo.gender': 'gender'
    }
  }
])

</script>

<style scoped>

</style>
