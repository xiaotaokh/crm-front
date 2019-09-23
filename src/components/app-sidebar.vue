<template>
  <div class="app-sidebar">
    <el-menu 
      :default-active="this.$route.path"
      router
      unique-opened
      class="el-menu-vertical-demo">
      <!-- <el-submenu v-for="(item,i) in navList" :key="i" v-show="item.second" :index="item.name">
         <template slot="title">{{ item.navItem }}</template>
         <el-submenu v-show="item.third" v-for="(sec,j) in item.third" :key="j" :index="sec.name">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
         <el-menu-item v-for="(sec,j) in item.second" :key="j" :index="sec.name">{{ sec.navItem }}</el-menu-item>
      </el-submenu> -->
      <!-- <el-menu-item v-for="(item,i) in navList" :key="i" v-show="!item.second" :index="item.name">
        {{ item.navItem }}
      </el-menu-item> -->
      <el-submenu v-for="(item,i) in navList" :key="i" :index="item.name">
         <template slot="title">{{ item.navItem }}</template>
         <!-- 三级标题存在 -->
         <el-submenu v-for="(sec,j) in item.second" :key="'A'+j" v-show="sec.third" :index="sec.name">
          <template slot="title">{{ sec.navItem }}</template>
          <el-menu-item v-for="(thi,k) in sec.third" :key="k" :index="thi.name">{{ thi.navItem }}</el-menu-item>
        </el-submenu>
        <!-- 三级标题不存在 -->
        <el-menu-item v-for="(m,n) in item.second" :key="'B'+n" v-show="!m.third" :index="m.name">{{ m.navItem }}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: "app-sidebar",
    computed: {
      
    },
    data() {
      return {
        navList:[
          {
            name:'/appMain/caidanyi',
            navItem:'菜单一',
            second:[
              {
                name:'/appMain/figure',
                navItem:'数据图',
                third:[
                  {
                    name:'/appMain/figure',
                    navItem:'数据图'
                  },
                  {
                    name:'/appMain/f1',
                    navItem:'f1'
                  },
                  {
                    name:'/appMain/f2',
                    navItem:'f2'
                  },
                  {
                    name:'/appMain/f3',
                    navItem:'f3'
                  },
                  {
                    name:'/appMain/f4',
                    navItem:'f4'
                  },
                  {
                    name:'/appMain/f5',
                    navItem:'f5'
                  }
                ]
              },
              {
                name:'/appMain/f1',
                navItem:'f1'
              },
              {
                name:'/appMain/f2',
                navItem:'f2'
              },
              {
                name:'/appMain/f3',
                navItem:'f3'
              },
              {
                name:'/appMain/f4',
                navItem:'f4'
              },
              {
                name:'/appMain/f5',
                navItem:'f5'
              }
            ]
          },
          {
            name:'/appMain/2',
            navItem:'菜单一',
            second:[
              {
                name:'/appMain/21',
                navItem:'数据图'
              },
              {
                name:'/appMain/22',
                navItem:'f1'
              },
              {
                name:'/appMain/34',
                navItem:'f2'
              },
              {
                name:'/appMain/56',
                navItem:'f3'
              },
              {
                name:'/appMain/7',
                navItem:'f4'
              },
              {
                name:'/appMain/9',
                navItem:'f5'
              }
            ]
          }
        ]
      };
    },
    methods: {
      
    },
    mounted(){
      // console.log(this.$route.path)
    }
  };
</script>

<style>
  
</style>
