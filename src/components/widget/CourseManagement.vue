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
    prop: 'instructorByInstructorNumber.name',
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
        'instructorByInstructorNumber.name': '',
      },
    },
    alias: {
      'instructorByInstructorNumber.name': 'instructorName'
    }
  },
  {
    prop: 'instructorByInstructorNumber.instructorNumber',
    label: 'Instructor Number',
    dataType: 'string',
    width: '',
    asInsert: true,
    asFilter: false,
    modifiable: true,
    createForm: {},
    filterForm: {},
    alias: {
      'instructorByInstructorNumber.instructorNumber': 'instructorNumber'
    }
  },
])
</script>

<style scoped>

</style>
