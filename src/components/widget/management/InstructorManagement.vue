<template>
  <GenericTable
      model="instructor"
      noun="Instructor"
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
    label: 'Instructor Number',
    dataType: 'number',
    width: '180',
    asInsert: true,
    asFilter: true,
    modifiable: true,
    createForm: {
      rules: []
    },
    filterForm: {
      defaultValues: {
        instructorNumber: ''
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
    prop: 'instructorInfo.salary',
    label: 'Salary',
    dataType: 'number-range',
    width: '180',
    asInsert: true,
    asFilter: true,
    modifiable: true,
    createForm: {
      rules: []
    },
    filterForm: {
      minKey: 'min',
      maxKey: 'max',
      defaultValues: {
        min: '',
        max: ''
      },
    },
  },
])

</script>

<style scoped>

</style>
