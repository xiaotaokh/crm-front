<template>
  <div class="index">
    主页
  </div>
</template>

<script>
export default {
  name: "index",
  computed: {
    // evenNumbers: function () {
    //   return this.numbers.filter(function (number) {
    //     return number % 2 === 0
    //   })
    // }
  },
  watch: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {
    // let formData = {
    //   userName: this.username,
    //   password: this.password
    // };
    // var url = "http://localhost:3001/api/action/menuManage";
    // this.$axios.post(url,formData).then(res => {
    //   console.log(res.data);
    // })
  }
};
</script>

<style scoped>
.index {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 10px;
}
</style>
