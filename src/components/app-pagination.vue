<template>
  <div class="app-pagination">
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="PageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
  </div>
</template>

<script>
import { myMixins } from '@/mixins/index'
export default {
  mixins:[myMixins],
  name: "app-pagination",
  props: [],
  computed: {},
  watch: {},
  data() {
    return {};
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      this.PageSize = val; // 改变每页显示的条数
      this.currentPage = 1; // 注意：在改变每页显示的条数时，要将页码显示到第一页
    },
    handleCurrentChange(val) {
      this.currentPage = val; // 改变默认的页数
    }
  }
};
</script>

<style scoped>
.app-pagination {
}
</style>
