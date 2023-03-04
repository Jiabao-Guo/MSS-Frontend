<template>
  <GenericTable
      model="course"
      noun="Course"
      model-key="id"
      :columns="columns"
  />
</template>

<script setup>
import {reactive} from "vue";
import GenericTable from "@/components/generic/GenericTable.vue";

const columns = reactive([
  {
    prop: 'courseNumber',
    label: 'Course Number',
    dataType: 'number',
    asInsert: true,
    asFilter: true,
    modifiable: true,
    createForm: {
      rules: []
    },
    filterForm: {
      defaultValues: {
        courseNumber: ''
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
    prop: 'major.name',
    label: 'Major / Department',
    dataType: 'string',
    width: '',
    asInsert: false,
    asFilter: true,
    modifiable: false,
    createForm: {
      rules: []
    },
    filterForm: {
      defaultValues: {
        'major.name': '',
      },
    },
    alias: {
      'major.name': 'majorName'
    }
  },
  {
    prop: 'user.name',
    label: 'Taught By',
    dataType: 'string',
    width: '',
    asInsert: false,
    asFilter: true,
    modifiable: false,
    createForm: {
      rules: []
    },
    filterForm: {
      defaultValues: {
        'user.name': '',
      },
    },
    alias: {
      'user.name': 'taughtBy'
    }
  },
  {
    prop: 'user.uid',
    label: 'Instructor UID',
    dataType: 'string',
    width: '',
    asInsert: true,
    asFilter: false,
    modifiable: true,
    createForm: {},
    filterForm: {},
    alias: {
      'user.uid': 'userId'
    }
  },
])
</script>

<style scoped>

</style>
