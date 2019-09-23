<template>
  <div class="app-search">
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="查询条件一">
          <el-input v-model="formInline.user" placeholder="查询条件一"></el-input>
        </el-form-item>
        <el-form-item label="查询条件二">
          <el-input v-model="formInline.user" placeholder="查询条件二"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "app-search",
    computed: {
      
    },
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        }
      };
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  };
</script>

<style scoped>
  .app-search .search{
    width: 100%;
    height: 60px;
    border-radius: 5px;
  }
</style>
