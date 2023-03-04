<template>
  <GenericTable
      model="user"
      noun="User"
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
        uid: ''
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
    prop: 'blocked',
    label: 'Blocked?',
    dataType: 'select',
    options: [
      {label: 'Yes', value: 1},
      {label: 'No', value: 0},
    ],
    width: '',
    asInsert: true,
    asFilter: true,
    modifiable: true,
    createForm: {
      rules: []
    },
    filterForm: {
      defaultValues: {
        blocked: ''
      },
    },
  },
  {
    prop: 'privileged',
    label: 'Privileged?',
    dataType: 'select',
    options: [
      {label: 'Yes', value: 1},
      {label: 'No', value: 0},
    ],
    width: '',
    asInsert: true,
    asFilter: true,
    modifiable: true,
    createForm: {
      rules: []
    },
    filterForm: {
      defaultValues: {
        privileged: ''
      },
    },
  },
  {
    prop: 'roles',
    label: 'Roles',
    dataType: 'string',
    asInsert: true,
    asFilter: false,
    modifiable: true,
    createForm: {
      rules: [],
      validator: (v) => {
        return 'Not enabled'
      },
    },
  }
])

</script>

<style scoped>

</style>
