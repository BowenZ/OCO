<template>
  <div class="user-statistic">
    <el-card class="box-card">
      <div slot="header" class="">
        <h2 class="card-title">审计方法执行统计</h2>
      </div>
      <el-table :data="methodData" border max-height="500">
        <el-table-column prop="methodName" label="审计名称">
        </el-table-column>
        <el-table-column prop="executionTotalCount" label="执行次数" width="100">
        </el-table-column>
        <el-table-column prop="resultCount" label="疑点数" width="100">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="">
        <h2 class="card-title">登录统计</h2>
      </div>
      <el-table :data="loginData" border max-height="500">
        <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column prop="logins" label="登录次数">
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录时间">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="">
        <h2 class="card-title">行为统计</h2>
      </div>
      <el-table :data="behaviorData" border max-height="500">
        <el-table-column prop="executeAudit" label="执行审计">
        </el-table-column>
        <el-table-column prop="viewDoubt" label="查看疑点">
        </el-table-column>
        <el-table-column prop="exportData" label="导出疑点">
        </el-table-column>
        <el-table-column prop="viewReport" label="查看报表">
        </el-table-column>
        <el-table-column prop="dimontionAnalysis" label="维度分析">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import urlStore from '@/api/urlStore.js'
export default {
  data: function() {
    return {
      methodData: [],
      loginData: [],
      behaviorData: []
    }
  },
  computed: {
    currentDrawerIndex: function() {
      return this.$store.state.currentDrawerIndex
    },
    currentDrawerPage: function() {
      return this.$store.state.currentDrawerPage
    }
  },
  created() {
    this.loadMethodData()
    this.loadLoginData()
    this.loadBehaviorData()
  },
  methods: {
    loadMethodData() {
      this.$http.get(urlStore.executeStatistics).then(res => {
        if (res.ok) {
          this.methodData = res.body.methods
        }
      })
    },
    loadLoginData() {
      this.$http.get(urlStore.loginStatistics).then(res => {
        if (res.ok) {
          this.loginData = res.body.users
        }
      })
    },
    loadBehaviorData() {
      this.$http.get(urlStore.findBehaviorList).then(res => {
        if (res.ok) {
          let tmpData = {}
          res.body.rows.forEach(item => {
            if (item.typeID == 1) {
              tmpData.executeAudit = item.counts
            }
            if (item.typeID == 2) {
              tmpData.viewDoubt = item.counts
            }
            if (item.typeID == 3) {
              tmpData.exportData = item.counts
            }
            if (item.typeID == 4) {
              tmpData.viewReport = item.counts
            }
            if (item.typeID == 5) {
              tmpData.dimontionAnalysis = item.counts
            }
          })
          this.behaviorData = [tmpData]
        }
      })
    }
  },
  watch: {
    currentDrawerIndex: function(newVal) {
      if (newVal == 6) {
        this.loadMethodData()
		    this.loadLoginData()
		    this.loadBehaviorData()
      }
    },
    currentDrawerPage: function(newVal) {
      if (newVal == 1) {
        this.loadMethodData()
		    this.loadLoginData()
		    this.loadBehaviorData()
      }
    }
  }
}

</script>
<style lang="scss"></style>
