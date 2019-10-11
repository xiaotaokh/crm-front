<template>
  <div class="index">
    <li v-for="(item,index) in evenNumbers" :key="index">{{ item }}</li>
    <!-- <li v-for="(n,m) in numbers.length" :key="m">主页</li> -->
    <input v-on:keyup.enter="onPageDown">
  </div>
</template>

<script>

export default {
  name: 'index',
  computed: {
    evenNumbers: function () {
      return this.numbers.filter(function (number) {
        return number % 2 === 0
      })
    }
  },
  watch: {
      
  },
  data () {
    return {
      numbers: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
    }
  },
  methods: {
    onPageDown() {
      console.log("enter");
    }
  },
  mounted(){
    
  }
}
</script>

<style scoped>
.index {
  width: 100%;
  height: 100%;
}
</style>
