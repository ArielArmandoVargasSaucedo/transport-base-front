<template>
    <div>
      <div>
        <TypeDriverSitTable />
        <TypeCarSitTable />
        <ProgramTypeTable />
      </div> 
    </div>
</template>

<script setup lang="ts" >
import TypeDriverSitTable from 'src/components/TypeDriverSitTable.vue';
import TypeCarSitTable from 'src/components/TypeCarSitTable.vue';
import ProgramTypeTable from 'src/components/ProgramTypeTable.vue';
</script>