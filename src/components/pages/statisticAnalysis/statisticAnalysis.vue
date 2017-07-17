<template>
  <div class="statistic-analysis">
    <el-collapse v-model="activeNames" @change="handleChangeCollapse">
      <el-collapse-item title="统计分析" name="1" class="top-box opened">
          <el-row :gutter="30">
            <el-col :span="12">
              <v-tree v-loading="methodTreeLoading" class="method-container" :data="methodTree" title="审计方法" @add="addMethod"></v-tree>
            </el-col>
            <el-col :span="12">
              <v-tree v-loading="companyListLoading" ref="companyList" class="company-container" :data="companyList" title="被审单位" @add="addCompany"></v-tree>
            </el-col>
          </el-row>
      </el-collapse-item>
      <el-collapse-item title="结果" name="2" class="table-container opened">
          <v-table v-loading="tableLoading" :tableData="tableData" @removeCompany="handleRemoveCompany" @removeMethod="handleRemoveMethod" @showDetail="handleShowDetail" @changeCompany="handleChangeCompany" @createChart="handleCreateChare" @clearData="handleClearData" @showChart="handleShowChart" @changeLevel="handleChangeLevel" @changeYear="handleChangeYear"></v-table>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="数据钻取" :visible.sync="dialogVisibleDetail" size="large">
      <el-table :data="detailData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisibleDetail = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisibleDetail = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="图表" :visible.sync="dialogVisibleBarChart" size="large">
      <v-bar-chart></v-bar-chart>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisibleDetail = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisibleBarChart = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="图表" :visible.sync="dialogVisiblePieChart" size="large">
      <v-pie-chart></v-pie-chart>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisibleDetail = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisiblePieChart = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'webpack-zepto'
import urlStore from '@/api/urlStore.js'
import vTree from './children/tree'
import vTable from './children/table2'
import vBarChart from './children/barChart'
import vPieChart from './children/pieChart'
export default {
  components: {
    vTree,
    vTable,
    vBarChart,
    vPieChart
  },
  data() {
    return {
      activeNames: ['1', '2'],
      methodTreeLoading: false,
      methodTree: null,
      companyListLoading: false,
      companyList: null,
      methodProps: {
        children: 'children',
        label: 'title'
      },
      selectedMethods: 
        [
          {
            "id": 382,
            "type": "method",
            "title": "部门项目支出预算与执行差异分析",
            "selected": 0,
            "methodCode": "SELECT [预算年度]\r\n      ,[预算单位编码]\r\n      ,[预算单位名称]\r\n      ,[预算项目名称]\r\n      ,[指标来源编码]\r\n      ,[指标来源名称]\r\n      ,[项目分类名称]\r\n      ,[预算类型名称]\r\n      ,[可执行指标金额]\r\n      ,[支付金额]\r\n      ,[差额]\r\n      ,[预算执行率]\r\n  FROM [03 部门项目支出预算与执行差异分析]",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "部门项目支出预算与执行差异分析",
            "params": [
              {
                "id": 2268,
                "name": "审计年度",
                "type": "string",
                "value": "2016",
                "isNull": 1,
                "style": "text"
              },
              {
                "id": 2269,
                "name": "预算年度",
                "type": "int",
                "value": "2017",
                "isNull": 1,
                "style": "text"
              }
            ]
          },
          {
            "id": 384,
            "type": "method",
            "title": "测试复制222",
            "selected": 0,
            "methodCode": "SELECT [预算年度]\r\n      ,[预算单位编码]\r\n      ,[预算单位名称]\r\n      ,[预算项目名称]\r\n      ,[指标来源编码]\r\n      ,[指标来源名称]\r\n      ,[项目分类名称]\r\n      ,[预算类型名称]\r\n      ,[可执行指标金额]\r\n      ,[支付金额]\r\n      ,[差额]\r\n      ,[预算执行率]\r\n  FROM [03 部门项目支出预算与执行差异分析]",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "部门项目支出预算与执行差异分析",
            "params": [
              {
                "id": 1269,
                "name": "审计年度",
                "type": "string",
                "value": "2016",
                "isNull": 1,
                "style": "text"
              }
            ]
          },
          {
            "id": 261,
            "type": "method",
            "title": "01 部门违规收取协会、学会的“赞助费”或“管理费”",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   \n       [ID]\n      ,[会计科目编号]\n      ,[会计科目名称]\n      ,[记账凭证摘要]\n      ,[记账凭证日期]\n      ,[业务日期]\n      ,[借方发生额]\n      ,[贷方发生额]\n      ,[记账凭证种类]\n      ,[记账凭证编号]\n      ,[附件数]\n      ,a.[会计年度]\n      ,[会计月份]\n      ,[财务主管]\n      ,[记账人员]\n      ,[出纳人员]\n      ,[审核人员]\n      ,[制单人员]\n      ,[源凭证号]\n      ,[金额]\n      ,[备注]\n      ,[凭证类型编号]\n      ,[借方外币金额]\n      ,[贷方外币金额]\n      ,[币种代码]\n      ,[币种名称]\n      ,[汇率]\n      ,[是否外币凭证]\n      ,[选择]\n      ,[票据号]\n      ,[记账凭证行号]\n      ,[记账标志]\n      ,a.[会计电子账簿编号]\n      ,[乡镇代码]\n      ,[AO单位代码]\n      ,[源数据包名称]\n      ,[年度]\n      ,a.[会计电子账簿名称] \n      ,[行政区划代码]\n      ,[对方科目名称]\n      ,[对方科目编码]\n      ,b.会计核算单位\n      ,b.单位代码\n  FROM  [czcw_gh].[dbo].[基础表_财务类_记账凭证表] a\n inner join (\n  select 单位代码,会计年度,会计电子账簿编号,会计电子账簿名称,会计核算单位 \n  FROM  [czcw_gh].[dbo].[基础表_财务类_电子账簿信息表]  \n  where 单位代码 like  '$单位编码$%'\n  ) b \n  on a.会计电子账簿编号 =b.会计电子账簿编号 and a.会计年度=b.会计年度\n  where   a.会计年度 in ($预算年度$)\n  \n and 会计科目名称  not like '%物业%' and [记账凭证摘要]  not like '%物业%'  \n and (会计科目名称 like '%赞助费%' or 会计科目名称 like '%管理费%' \n or [记账凭证摘要] like '%赞助费%' or [记账凭证摘要] like '%管理费%' )",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "可以通过两种方式审计。<br/>一、查询代开发票中收款方纳税人名称为预算单位，付款方纳税人名称为协会、学会的信息，根据发票开具内容进行延伸审计。如果预算单位收取费用未入账，可延伸审计该单位是否私设“小金库”。<br/>二、在预算单位财务账中，通过会计科目或摘要查询是否有对协会、学会等收取的“赞助费”或“管理费”等。",
            "params": [
              {
                "id": 185,
                "name": "单位编码",
                "type": "string",
                "value": "028",
                "isNull": 0,
                "style": "pop"
              },
              {
                "id": 186,
                "name": "预算年度",
                "type": "string",
                "value": "2016",
                "isNull": 0,
                "style": "text"
              }
            ]
          },
          {
            "id": 262,
            "type": "method",
            "title": "02 部门在协会、学会私设“小金库”和报销各类费用",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT  [编号]\n      ,[预算年度]\n      ,[交易凭证类型编码]\n      ,[交易凭证类型名称]\n      ,[业务科室编码]\n      ,[业务科室名称]\n      ,[预算单位编码]\n      ,[预算单位名称]\n      ,[预算科目编码]\n      ,[预算科目名称]\n      ,[项目分类编码]\n      ,[项目分类名称]\n      ,[资金性质编码]\n      ,[资金性质名称]\n      ,[预算项目编码]\n      ,[预算项目名称]\n      ,[指标特性编码]\n      ,[指标特性名称]\n      ,[指标来源编码]\n      ,[指标来源名称]\n      ,[指标文件编号]\n      ,[指标文件名称]\n      ,[支付方式编码]\n      ,[支付方式名称]\n      ,[预算类型编码]\n      ,[预算类型名称]\n      ,[支出经济项目分类编码]\n      ,[支出经济项目分类名称]\n      ,[支付金额]\n      ,[摘要]\n      ,[支付时间]\n      ,[清算时间]\n      ,[结算方式]\n      ,[供应商名称]\n      ,[银行账号]\n      ,[开户银行]\n      ,[付款账号]\n      ,[付款帐户]\n      ,[付款银行]\n      ,[生成人]\n      ,[生成时间]\n      ,[来源计划额度ID]\n      ,[行政区划代码]\n   \n  FROM [czcw_gh].[dbo].[基础表_支付凭证表]\n  where [预算单位编码] like  '$单位编码$%'\n    and [预算年度] in  ($预算年度$)\n  and [行政区划代码]='410000' \n  and [预算单位名称]<>[供应商名称]\n \n  and ([供应商名称] like '%协会%' or [供应商名称] like '%学会%')",
            "isEnable": 1,
            "sort": 2,
            "methodType": "model",
            "autidType": "自动",
            "description": "通过国库集中支付凭证表，查询预算单位向协会、协会拨付资金的情况，延伸资金的使用情况，重点关注是否形成“小金库”或者预算单位在协会、学会报销费用。",
            "params": [
              {
                "id": 187,
                "name": "单位编码",
                "type": "string",
                "value": "028",
                "isNull": 0,
                "style": "pop"
              },
              {
                "id": 188,
                "name": "预算年度",
                "type": "string",
                "value": "2016",
                "isNull": 0,
                "style": "text"
              }
            ]
          },
          {
            "id": 263,
            "type": "method",
            "title": "03 部门工作人员违规兼职取酬",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 3,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。审查预算单位下属部门或协会等的工资单或者补贴领取单据，关注预算单位本级人员领取工资或者补贴的记录。",
            "params": []
          },
          {
            "id": 264,
            "type": "method",
            "title": "04 协会、学会等中介机构利用部门的影响力违规收费",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT distinct [通用发票uuid]\r\n      ,[代开申请uuid]\r\n      ,[土地税源编号]\r\n      ,[房源编号]\r\n      ,[付款方名称]\r\n      ,[付款方登记序号]\r\n      ,[付款方身份证件号码]\r\n      ,[付款方身份证件种类代码]\r\n      ,[付款方纳税人识别号]\r\n      ,[蓝字发票号码]\r\n      ,[蓝字发票代码]\r\n      ,[联系电话]\r\n      ,a.[地址]\r\n      ,[收款方名称]\r\n      ,[收款方纳税人识别号]\r\n      ,[录入人代码]\r\n      ,[录入日期]\r\n      ,[修改人代码]\r\n      ,[修改日期]\r\n      ,[数据归属地区]\r\n      ,[收款方身份证件类型代码]\r\n      ,[收款方身份证件号码]\r\n      ,[数据同步时间]\r\n      ,[通用发票货劳uuid]\r\n      ,[货物劳务名称]\r\n      ,[规格型号]\r\n      ,[单位数量代码]\r\n      ,[货劳数量]\r\n      ,[单价]\r\n      ,[金额]\r\n      ,[发票开具信息uuid]\r\n      ,[代开发票类别代码]\r\n      ,[代开发票类别名称]\r\n      ,[开具税务机关代码]\r\n      ,[开票人代码]\r\n      ,[开具日期]\r\n      ,[登记序号]\r\n      ,[纳税人识别号]\r\n      ,[纳税人名称]\r\n\t  ,b.业务主管部门 纳税人业务主管部门\r\n      ,[发票种类代码]\r\n      ,[发票代码]\r\n      ,[发票号码]\r\n      ,[开票金额]\r\n      ,[特殊纳税人登记序号]\r\n      ,[发票库房代码]\r\nFROM [229].[datactr].[dbo].[分析表_发票_代开通用机打发票] a\r\n,[qthy_gh].[dbo].基础表_民政_社团基本信息_合并后 b\r\n,[czcw_gh].[dbo].[基础表_预算单位] c\r\nwhere c.[行政区划代码]='410000'\r\nand c.预算单位编码 like '$单位编码$%'\r\nand c.预算年度 in ($预算年度$) \r\nand left(a.开具日期,4 ) in ($预算年度$) \r\n\r\nand b.单位名称 not like '%学校%' \r\nand b.单位名称 not like '%学院%'\r\nand a.纳税人名称=b.单位名称\r\nand c.预算单位名称 like '%'+b.业务主管部门+'%'\r\nand (货物劳务名称 like '%咨询%'\r\n or 货物劳务名称 like '%管理%'\r\n or 货物劳务名称 like '%委托%'\r\n or 货物劳务名称 like '%服务%'\r\n or 货物劳务名称 like '%中介%'\r\n or 货物劳务名称 like '%培训%'\r\n or 货物劳务名称 like '%会议%'\r\n ) ",
            "isEnable": 1,
            "sort": 4,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询代开发票中收款方纳税人名称为协会、学会，发票内容为咨询费、管理费、委托费、服务费、中介费、培训费、会议费等的信息，延伸审计是否存在协会、学会等中介机构利用部门的影响力违规收费的问题。",
            "params": [
              {
                "id": 211,
                "name": "单位编码",
                "type": "string",
                "value": "028",
                "isNull": 0,
                "style": "pop"
              },
              {
                "id": 212,
                "name": "预算年度",
                "type": "string",
                "value": "2016",
                "isNull": 0,
                "style": "text"
              }
            ]
          }
        ],
      selectedCompany: 
        [
          {
            "id": 101,
            "title": "开封市工商局相国寺分局",
            "params": [],
            "externalDataSource": [
              "临时表_人员信息"
            ]
          },
          {
            "id": 102,
            "title": "开封市工商局夜市分局",
            "params": [],
            "externalDataSource": [
              "临时表_人员信息"
            ]
          }
        ],
      tableData: [],
      tableLoading: false,

      // 钻取数据
      dialogVisibleDetail: false,
      detailData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],

      // 图表
      dialogVisibleBarChart: false,
      dialogVisiblePieChart: false
    }
  },
  mounted() {
    this.loadMethodTree()
    this.loadCompanyList()
    this.tableData = this.getResult()
  },
  methods: {
    loadMethodTree() {
      // 加载方法树
      // this.methodTreeLoading = true
      // this.$http.get(urlStore.getDetail).then(res => {
      //   if (res.ok) {
      //     this.methodTree = res.body.tree
      //   }
      //   this.methodTreeLoading = false
      // }).catch(err => {
      //   this.methodTreeLoading = false
      // })
      this.methodTree = [{
        "id": 6,
        "type": "category",
        "title": "部门预算执行审计",
        "description": "预算执部门预算执行审计行情况",
        "isEnable": 1,
        "sort": 2,
        "children": [{
          "id": 13,
          "type": "issues",
          "title": "部门预算执行总体情况",
          "description": "部门预算执行总体情况",
          "isDefault": 1,
          "isEnable": 1,
          "sort": 1,
          "children": [{
            "id": 195,
            "type": "method",
            "title": "01 部门预算执行总体情况和执行率",
            "selected": 0,
            "accord": "定性依据",
            "methodCode": "SELECT [预算年度]\r\n      ,[预算单位编码]\r\n      ,[预算单位名称]\r\n      ,SUM([可执行指标金额]) as 预算批复总额\r\n      ,SUM([支付金额]) as 实际执行总额\r\n      ,CONVERT(decimal(16,2),\r\n         round(case when sum([可执行指标金额])=0 then 0\r\n                    else sum([支付金额])*100/\r\n                         sum([可执行指标金额])\r\n                  end\r\n               ,2)\r\n              ) as 总预算执行比例\r\n      ,sum(case when 指标来源编码 like '4%' then [可执行指标金额] else 0 end) as 年初预算批复金额\r\n      ,sum(case when 指标来源编码 like '4%' then [支付金额] else 0 end) as 年初预算实际执行金额\r\n      ,CONVERT(decimal(16,2),\r\n         round(case when sum(case when 指标来源编码 like '4%' then [可执行指标金额] else 0 end)=0 then 0\r\n                    else sum(case when 指标来源编码 like '4%' then [支付金额] else 0 end)*100/\r\n                         sum(case when 指标来源编码 like '4%' then [可执行指标金额] else 0 end)\r\n                  end\r\n               ,2)\r\n              ) as 年初预算执行比例\r\n      ,sum(case when 指标来源编码 like '4%' and left(项目分类编码,6) in ('001001','001002','001003') \r\n                then [可执行指标金额] else 0 end) as 年初预算批复金额_基本支出\r\n      ,sum(case when 指标来源编码 like '4%' and left(项目分类编码,6) in ('001001','001002','001003') \r\n                then [支付金额] else 0 end) as 年初预算实际执行金额_基本支出\r\n      ,CONVERT(decimal(16,2),\r\n         round(case when sum(case when 指标来源编码 like '4%' and left(项目分类编码,6) in ('001001','001002','001003') then [可执行指标金额] else 0 end)=0 then 0\r\n                    else sum(case when 指标来源编码 like '4%' and left(项目分类编码,6) in ('001001','001002','001003') \r\n                                  then [支付金额] else 0 end)*100/\r\n                         sum(case when 指标来源编码 like '4%' and left(项目分类编码,6) in ('001001','001002','001003') \r\n                                  then [可执行指标金额] else 0 end)\r\n                end\r\n                ,2)\r\n               ) as 年初预算执行比例_基本支出\r\n      ,sum(case when 指标来源编码 like '4%' and left(项目分类编码,6) not in ('001001','001002','001003') \r\n                then [可执行指标金额] else 0 end) as 年初预算批复金额_项目支出\r\n      ,sum(case when 指标来源编码 like '4%' and left(项目分类编码,6) not in ('001001','001002','001003') \r\n                then [支付金额] else 0 end) as 年初预算实际执行金额_项目支出\r\n      ,CONVERT(decimal(16,2),\r\n          round(case when sum(case when 指标来源编码 like '4%' and left(项目分类编码,6) not in ('001001','001002','001003') then [可执行指标金额] else 0 end)=0 then 0\r\n                     else sum(case when 指标来源编码 like '4%' and left(项目分类编码,6) not in ('001001','001002','001003') \r\n                                   then [支付金额] else 0 end)*100/\r\n                          sum(case when 指标来源编码 like '4%' and left(项目分类编码,6) not in ('001001','001002','001003') \r\n                                   then [可执行指标金额] else 0 end)\r\n                 end\r\n                ,2)\r\n               )  as 年初预算执行比例_项目支出\r\n      ,sum(case when 指标来源编码 not like '4%' then [可执行指标金额] else 0 end) as 追加预算批复金额\r\n      ,sum(case when 指标来源编码 not like '4%' then [支付金额] else 0 end) as 追加预算实际执行金额\r\n      ,CONVERT(decimal(16,2),\r\n         round(case when sum(case when 指标来源编码 not like '4%' then [可执行指标金额] else 0 end)=0 then 0\r\n                    else sum(case when 指标来源编码 not like '4%' then [支付金额] else 0 end)*100/\r\n                         sum(case when 指标来源编码 not like '4%' then [可执行指标金额] else 0 end)\r\n                 end\r\n               ,2)\r\n              ) as 追加预算执行比例\r\n  FROM czcw_gh.dbo.[分析表_模型_追踪_单位指标执行情况_new]\r\n  where [预算单位编码]  like '$单位编码$%' and [预算年度] in ( $预算年度$ ) and [行政区划代码]='410000'\r\n  group by [预算年度]      ,[预算单位编码]      ,[预算单位名称]\r\n order by [预算单位编码]",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "重点关注超预算支出情况（需要结合实际，客观分析）。该数据作为审计报告中基本情况的证据,在报告中要进行反映。因涉及年终结转、调账等情况，实际收支情况需要与预算单位沟通，以部门决算报表反映的为准。",
            "params": [{
              "id": 262,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 1,
              "style": "text"
            }, {
              "id": 263,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }]
          }, {
            "id": 196,
            "type": "method",
            "title": "02 支出预算编制情况分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT 年度\n      ,单位代码\n      ,单位名称\n      ,项目类别编码\n      ,项目类别名称\n      ,项目编码\n      ,项目名称\n      ,经济科目代码\n      ,经济科目名称\n      ,总计\n      ,财政拨款\n      ,纳入预算管理的行政事业性收费\n      ,专项收入\n      ,财政专户管理的教育收费或彩票发行费\n      ,债务收入\n      ,其他一般公共预算收入\n      ,中央专项转移支付\n      ,省级均衡性转移支付预留配套\n      ,政府性基金收入\n      ,事业收入_不含教育收费\n      ,国有资产资源有偿使用收入\n      ,经营收入\n      ,部门结转资金\n      ,用事业单位基金弥补收支差额\n      ,非本级财政拨款收入\n      ,使用单位原有账户资金\n      ,其他收入\n  FROM czcw_gh.dbo.基础表_部门预算_支出预算表\n  where (项目类别编码 not like '00010004%' and 经济科目代码 not like '*%'  or 项目类别编码 like '00010004%' ) and 总计<>0  \n  and 年度 in ($预算年度$)\n  and 单位代码 like '$单位编码$%'\norder by 单位代码,项目编码,经济科目代码",
            "isEnable": 1,
            "sort": 2,
            "methodType": "model",
            "autidType": "自动",
            "description": "从预算编制系统中，查询预算单位编报的预算，结合单位机构设置等情况进行延伸审计。重点关注以下几方面：<br/>一、应纳入预算的收入、支出未纳入预算。<br/>二、将非所属预算单位的收支纳入预算。<br/>三、编报自收自支单位预算。<br/>四、代报代编下属单位预算。<br/>五、动用以前年度结转结余资金未纳入预算。<br/>六、未经充分论证和研究编报项目预算。<br/>",
            "params": [{
              "id": 103,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 104,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 197,
            "type": "method",
            "title": "03 违规调整预算",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "select\n指标明细ID\n      ,去向指标额度ID\n      ,来源指标额度ID\n      ,区划编码\n      ,预算年度\n      ,单位编号\n      ,指标类型编码\n      ,指标类型名称\n      ,指标文号编号\n      ,指标文号名称\n      ,[业务处(科)室编码]\n      ,[业务处(科)室名称]\n      ,预算单位编码\n      ,预算单位名称\n      ,预算科目编码\n      ,预算科目名称\n      ,项目分类编码\n      ,项目分类名称\n      ,资金性质编码\n      ,资金性质名称\n      ,预算项目编码\n      ,预算项目名称\n      ,指标特性编码\n      ,指标特性名称\n      ,指标来源编码\n      ,指标来源名称\n      ,支付方式编码\n      ,支付方式名称\n      ,预算类型编码\n      ,预算类型名称\n      ,指标调整标志\n      ,指标调整类型编码\n      ,指标调整类型名称\n      ,执行情况\n      ,被调整指标明细ID\n      ,调整方向\n      ,申请预算金额\n      ,批准预算金额\n      ,录入人\n      ,录入时间\n      ,审核人\n      ,审核时间\n      ,生效日期\n      ,行政区划代码\nFROM czcw_gh.dbo.基础表_指标表 a\nwhere 行政区划代码='410000' \n and 预算年度 IN ($预算年度$)\n AND 单位编号 LIKE '$单位编码$%'\n and 指标调整标志 like '%调%' \nand exists (select 1 from czcw_gh.dbo.基础表_指标表 b where a.行政区划代码=b.行政区划代码 and a.预算年度=b.预算年度\n            and a.来源指标额度ID=b.去向指标额度ID and b.指标来源编码 like '4%' and b.指标类型编码 like '14%'\n            and 预算类型编码<>'002')\norder by 审核时间,来源指标额度ID,批准预算金额\n",
            "isEnable": 1,
            "sort": 3,
            "methodType": "model",
            "autidType": "自动",
            "description": "从预算指标表中，筛选出年初预算调整情况。重点关注以下几方面：<br/>一、未经财政部门批准随意调整本级和所属单位预算。<br/>二、未经批准在预算科目之间相互调剂使用（需要结合实际，客观分析）。",
            "params": [{
              "id": 105,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 106,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 198,
            "type": "method",
            "title": "04 预算单位人员情况分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT 年度,\n       单位代码,\n       单位名称,\n       机构规格代码,\n       机构规格名称,\n       单位驻地类型,\n       文明单位类型代码,\n       文明单位类型名称,\n       文明单位是否在届,\n       是否工资统发,\n       是否省垂直管理,\n       行政主管部门代码,\n       行政主管部门名称,\n       财务主管部门代码,\n       财务主管部门名称,\n       单位地址,\n       邮政编码,\n       传真,\n       单位负责人,\n       财务负责人,\n       财务负责人联系电话,\n       经办人,\n       联系电话,\n       手机,\n       email地址,\n       单位性质,\n       单位类别代码,\n       单位类别名称,\n       经费供给方式代码,\n       经费供给方式名称,\n       事业单位绩效工资标准代码,\n       事业单位绩效工资标准名称,\n       特殊情况备注,\n       编制合计,\n       行政编制小计,\n       行政编制数,\n       纪检编制数,\n       政法编制数,\n       行政工勤编制数,\n       参照公务员管理小计,\n       参照公务员管理编制,\n       参照公务员管理工勤编制,\n       事业编制小计,\n       全额事业编制,\n       差额事业编制,\n       自收自支编制,\n       事业工勤编制小计,\n       事业全供工勤编制,\n       事业差供工勤编制,\n       自收自支工勤编制,\n       长休人员,\n       待分流人员,\n       分流学习人员,\n       病休人员,\n       提前离岗人员,\n       超编人员,\n       强戒人数,\n       劳教人数,\n       劳改人数,\n       辅助管理人员,\n       罪犯技术辅导人数,\n       关键要害岗位人数,\n       运动员人数,\n       教练员人数,\n       集训人数,\n       公务用车编制数小计,\n       一般公务用车编制数,\n       省级领导干部用车编制数,\n       执法执勤用车编制数,\n       特种专业用车编制数,\n       其他用车编制数\nFROM   czcw_gh.dbo.基础表_部门预算_单位基本情况表\nWHERE  年度 in ($预算年度$)\n       AND 单位代码 like '$单位编码$%'\nand 单位名称 is not null\nand 机构规格代码 is not null\n\n\n \n",
            "isEnable": 1,
            "sort": 4,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询预算单位的人员情况。",
            "params": [{
              "id": 107,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 108,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 199,
            "type": "method",
            "title": "05 预算单位资产情况分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT 年度,\n       单位代码,\n       单位名称,\n       固定资产大类,\n       固定资产分类代码,\n       固定资产分类名称,\n       固定资产名称,\n       型号,\n       类别代码,\n       类别名称,\n       竣工_购进日期,\n       投入使用日期,\n       使用管理状况代码,\n       使用管理状况名称,\n       固定资产原值,\n       建筑面积,\n       使用面积,\n       费用开支渠道,\n       车船牌照号码,\n       用途,\n       上次大修日期,\n       使用单位,\n       产权归属,\n       备注\nFROM   (SELECT 年度,\n               单位代码,\n               单位名称,\n               '房屋及建筑物' AS 固定资产大类,\n               固定资产分类代码,\n               固定资产分类名称,\n               房屋建筑物名称  AS 固定资产名称,\n               NULL     AS 型号,\n               类别代码,\n               类别名称,\n               竣工日期     AS 竣工_购进日期,\n               投入使用日期   AS 投入使用日期,\n               使用管理状况代码,\n               使用管理状况名称,\n               固定资产原值,\n               建筑面积     AS 建筑面积,\n               使用面积,\n               NULL     AS 费用开支渠道,\n               NULL     AS 车船牌照号码,\n               NULL     AS 用途,\n               上次维修日期   AS 上次大修日期,\n               使用单位,\n               产权归属,\n               备注\n        FROM   czcw_gh.dbo.基础表_部门预算_房屋及建筑物情况表\n        UNION ALL\n        SELECT 年度,\n               单位代码,\n               单位名称,\n               '交通工具' AS 固定资产大类,\n               固定资产分类代码,\n               固定资产分类名称,\n               交通工具名称 AS 固定资产名称,\n               型号,\n               车辆分类代码 AS 类别代码,\n               车辆分类名称 AS 类别名称,\n               购进日期   AS 竣工_购进日期,\n               购进日期   AS 投入使用日期,\n               使用管理状况代码,\n               使用管理状况名称,\n               固定资产原值,\n               NULL   AS 建筑面积,\n               NULL   AS 使用面积,\n               费用开支渠道,\n               车船牌照号码 AS 车船牌照号码,\n               用途,\n               上次大修日期 AS 上次大修日期,\n               NULL   AS 使用单位,\n               NULL   AS 产权归属,\n               NULL   AS 备注\n        FROM   czcw_gh.dbo.基础表_部门预算_交通工具情况表) t\n        where 单位代码 is not null\n        and 年度 in ($预算年度$)\n        and 单位代码 like '$单位编码$%'\n",
            "isEnable": 1,
            "sort": 5,
            "methodType": "model",
            "autidType": "自动",
            "description": "分析各预算单位的资产（包括房屋建筑物及交通工具）情况。",
            "params": [{
              "id": 109,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 110,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 200,
            "type": "method",
            "title": "06 预算单位基本情况异常分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [年度],\n       [单位代码],\n       [单位名称],\n       [本年编制人数合计],\n       [人员实有数],\n       [实有人数与编制人数差异],\n       [本年公务用车编制数],\n       [车船实有数],\n       [车辆实有数与编制数差异]\nFROM   czcw_gh.dbo.[分析表_模型_部门预算执行_预算单位基本情况异常分析] a\nWHERE  a.[年度] in ($预算年度$)\n    and a.[单位代码] like '$单位编码$%'",
            "isEnable": 1,
            "sort": 6,
            "methodType": "model",
            "autidType": "自动",
            "description": "检查各预算单位登记的人数及交通工具的异常情况。",
            "params": [{
              "id": 111,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 112,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 201,
            "type": "method",
            "title": "07 年度部门间预算调整占比分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   [预算年度],\n         [预算单位编码],\n         [预算单位名称],\n         [正常预算金额],\n         [调增金额],\n         [调减金额],\n         [调增预算占正常预算比例],\n         [调减预算占正常预算比例]\nFROM     czcw_gh.dbo.[分析表_模型_部门预算执行_年度部门间预算调整占比分析]\nWHERE    预算年度 in ($预算年度$)\n         and [预算单位编码] like '$单位编码$%'\nORDER BY 预算单位编码\n",
            "isEnable": 1,
            "sort": 7,
            "methodType": "model",
            "autidType": "自动",
            "description": "对比分析预算指标的调增、调减情况，同时计算调整预算占正常预算的比例。",
            "params": [{
              "id": 113,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 114,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 202,
            "type": "method",
            "title": "08 预算指标未执行_支付金额为0",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "\r\nSELECT [去向指标额度ID],\r\n        [预算年度],\r\n        [指标文号编号],\r\n        [指标文号名称],\r\n        [业务处(科)室编码],\r\n        [业务处(科)室名称],\r\n        [预算单位编码],\r\n        [预算单位名称],\r\n        [预算科目编码],\r\n        [预算科目名称],\r\n        [项目分类编码],\r\n        [项目分类名称],\r\n        [资金性质编码],\r\n        [资金性质名称],\r\n        [预算项目编码],\r\n        [预算项目名称],\r\n        [指标特性编码],\r\n        [指标特性名称],\r\n        [指标来源编码],\r\n        [指标来源名称],\r\n        [支付方式编码],\r\n        [支付方式名称],\r\n        [预算类型编码],\r\n        [预算类型名称],\r\n        [批准预算金额],\r\n        [冻结金额],\r\n        [解冻金额],\r\n        [可执行指标金额],\r\n        [指标结余],\r\n        [计划批复金额],\r\n        [计划冻结金额],\r\n        [计划收回金额],\r\n        [已收回计划冻结金额],\r\n        [可用计划金额],\r\n        [计划结余],\r\n        [支付金额],\r\n        [行政区划代码]\r\n FROM   czcw_gh.dbo.[分析表_模型_追踪_单位指标执行情况_new]\r\n WHERE  批准预算金额<>0 and 支付金额 = 0\r\n        AND 行政区划代码 = (SELECT Min(行政区划代码)\r\n                      FROM   czcw_gh.dbo.基础表_预算单位)\r\n        AND 预算年度 in ( 2016 )\r\n        and 预算单位编码 not like '999%'\r\n        and 预算单位编码  like  '$单位编码$%'\r\n order by 预算单位编码\r\n",
            "isEnable": 1,
            "sort": 8,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询预算单位有预算而未支付的情况。",
            "params": [{
              "id": 115,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 116,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 203,
            "type": "method",
            "title": "09 年度部门追加预算指标执行率分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   a.预算年度,\n         a.预算单位编码,\n         b.预算单位名称,\n         Sum(a.可执行指标金额) AS 可执行指标金额,\n         Sum(a.计划批复金额)  AS 计划批复金额,\n         Sum(a.支付金额)    AS 支付金额,\n         CASE\n           WHEN Sum(a.可执行指标金额) = 0\n           THEN 0\n           ELSE Sum(a.支付金额)*100/Sum(a.可执行指标金额)\n         END            AS 预算执行率\nFROM     czcw_gh.dbo.分析表_模型_追踪_单位指标执行情况_new a\n         LEFT JOIN czcw_gh.dbo.基础表_预算单位 b\n         ON a.预算年度=b.预算年度 AND a.预算单位编码=b.预算单位编码 AND a.行政区划代码=b.行政区划代码\nWHERE    a.行政区划代码 = (SELECT Min(行政区划代码)\n                     FROM   czcw_gh.dbo.基础表_预算单位)\n         AND 指标来源编码 LIKE '5%'\nGROUP BY a.预算年度,\n         a.预算单位编码,\n         b.预算单位名称\nHAVING  a.预算年度 in ($预算年度$)\n  and a.预算单位编码 like '$单位编码$%'\n        AND (Sum(a.可执行指标金额) <> 0\n             OR Sum(a.计划批复金额) <> 0\n             OR Sum(a.支付金额) <> 0)\nORDER BY a.预算单位编码\n",
            "isEnable": 1,
            "sort": 9,
            "methodType": "model",
            "autidType": "自动",
            "description": "对比分析预算单位的全年追加预算指标的执行率。",
            "params": [{
              "id": 117,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 118,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }]
        }, {
          "id": 15,
          "type": "issues",
          "title": "基本支出预算管理情况",
          "description": "基本支出预算管理情况",
          "isDefault": 1,
          "isEnable": 1,
          "sort": 2,
          "children": [{
            "id": 204,
            "type": "method",
            "title": "01 基本支出明细查询",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT 编号,\n       预算年度,\n       交易凭证类型编码,\n       交易凭证类型名称,\n       业务科室编码,\n       业务科室名称,\n       预算单位编码,\n       预算单位名称,\n       预算科目编码,\n       预算科目名称,\n       项目分类编码,\n       项目分类名称,\n       资金性质编码,\n       资金性质名称,\n       预算项目编码,\n       预算项目名称,\n       指标特性编码,\n       指标特性名称,\n       指标来源编码,\n       指标来源名称,\n       指标文件编号,\n       指标文件名称,\n       支付方式编码,\n       支付方式名称,\n       预算类型编码,\n       预算类型名称,\n       支出经济项目分类编码,\n       支出经济项目分类名称,\n       支付金额,\n       摘要,\n       支付时间,\n       清算时间,\n       结算方式,\n       供应商名称,\n       银行账号,\n       开户银行,\n       付款账号,\n       付款帐户,\n       付款银行,\n       生成人,\n       生成时间,\n       来源计划额度id,\n       行政区划代码\nFROM   czcw_gh.dbo.基础表_支付凭证表\nWHERE  行政区划代码 = (SELECT Min(行政区划代码)\n                 FROM   czcw_gh.dbo.基础表_预算单位)\n       AND Left(项目分类编码,6) in  ('001001','001002','001003')\n       AND 预算年度 in ($预算年度$)\n       AND 预算单位编码 like '$单位编码$%'\n",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询基本支出的支付记录。",
            "params": [{
              "id": 119,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 120,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 205,
            "type": "method",
            "title": "02 基本支出人均执行情况分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [预算年度],\n       [预算单位编码],\n       [预算单位名称],\n       [基本支出总额],\n       [编制人数],\n       [人均基本支出]\nFROM   czcw_gh.dbo.[分析表_模型_部门预算执行_基本支出人均执行情况分析]\nWHERE    预算单位编码 like '$单位编码$%'\n         and [预算年度] in ($预算年度$)\norder by 预算年度\n",
            "isEnable": 1,
            "sort": 2,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询预算单位的基本支出人均金额，关注是否存在虚报人数多报预算多领财政资金的问题。",
            "params": [{
              "id": 121,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 122,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 206,
            "type": "method",
            "title": "03 人均工资福利支出预算编制情况分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [预算年度],\n       [预算单位编码],\n       [预算单位名称],\n       [支出经济项目分类编码],\n       [支出经济项目分类名称],\n       [支出总额],\n       [编制人数],\n       [人均工资福利支出]\nFROM   czcw_gh.dbo.[分析表_模型_部门预算执行_工资福利支出人均支出情况_预算执行]\nwhere 预算年度  in   ($预算年度$)  \n      and [预算单位编码] like  '$单位编码$%'\norder by 预算单位编码,支出经济项目分类编码\n",
            "isEnable": 1,
            "sort": 3,
            "methodType": "model",
            "autidType": "自动",
            "description": "从预算编制系统中，查询预算单位预算编制的工资福利支出预算人均金额。",
            "params": [{
              "id": 123,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 124,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 207,
            "type": "method",
            "title": "04 财务账载工资福利支出人均支出情况",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [单位代码],\n       [会计核算单位],\n       [账套类别],\n       stuff([会计电子账簿编号],5,4,'') as 账套编号,\n       [会计电子账簿名称],\n       [会计年度],\n       [科目全称],\n       [辅助类型],\n       [辅助编码],\n       [辅助名称],\n       [支出总额],\n       [编制合计],\n       [人均支出金额]\nFROM   czcw_gh.dbo.[分析表_模型_部门预算执行_工资福利支出人均支出情况_财务]\nwhere 会计年度 in ($预算年度$) \n    and [单位代码] like '$单位编码$%'\norder by 会计年度,单位代码,科目全称,辅助编码\n",
            "isEnable": 1,
            "sort": 4,
            "methodType": "model",
            "autidType": "自动",
            "description": "从预算单位财务账中，查询工资福利实际人均支出金额。",
            "params": [{
              "id": 125,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 126,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 208,
            "type": "method",
            "title": "05 “吃空饷”问题",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 5,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。利用财政统发工资的人员信息，再获取预算单位的打卡或者其他考勤信息，比对分析考勤信息为空却一直领工资的人员信息，进一步延伸落实。",
            "params": []
          }, {
            "id": 209,
            "type": "method",
            "title": "06 虚列支出",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 6,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。",
            "params": []
          }, {
            "id": 210,
            "type": "method",
            "title": "07 自定项目发放津补贴或者擅自提高标准发放津补贴",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 7,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。需根据单位性质、资金性质获取津补贴的发放标准，再与财务账中实际发放标准进行比对分析。",
            "params": []
          }, {
            "id": 211,
            "type": "method",
            "title": "08 人员经费支出挤占公用经费支出",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [编号],\n       [预算年度],\n       [交易凭证类型编码],\n       [交易凭证类型名称],\n       [业务科室编码],\n       [业务科室名称],\n       [预算单位编码],\n       [预算单位名称],\n       [预算科目编码],\n       [预算科目名称],\n       [项目分类编码],\n       [项目分类名称],\n       [资金性质编码],\n       [资金性质名称],\n       [预算项目编码],\n       [预算项目名称],\n       [指标特性编码],\n       [指标特性名称],\n       [指标来源编码],\n       [指标来源名称],\n       [指标文件编号],\n       [指标文件名称],\n       [支付方式编码],\n       [支付方式名称],\n       [预算类型编码],\n       [预算类型名称],\n       [支出经济项目分类编码],\n       [支出经济项目分类名称],\n       [支付金额],\n       [摘要],\n       [支付时间],\n       [清算时间],\n       [结算方式],\n       [供应商名称],\n       [银行账号],\n       [开户银行],\n       [付款账号],\n       [付款帐户],\n       [付款银行],\n       [生成人],\n       [生成时间],\n       [来源计划额度ID],\n       [行政区划代码]\nFROM   czcw_gh.dbo.[基础表_支付凭证表]\nwhere 行政区划代码=(select MIN(行政区划代码) from czcw_gh.dbo.基础表_预算单位)\n  and 预算年度 in ( $预算年度$ ) \n  and  [预算单位编码] like '$单位编码$%'\n  and left(支出经济项目分类编码,3) in ('301','303')\n  and left(项目分类编码,6)='001002'\norder by 预算单位编码\n",
            "isEnable": 1,
            "sort": 8,
            "methodType": "model",
            "autidType": "自动",
            "description": "从基础表_支付凭证表中查询项目分类为商品和服务支出且支出经济项目分类为人员经费的信息，审查预算单位是否存在公用经费弥补人员经费的情况。",
            "params": [{
              "id": 127,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 128,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 212,
            "type": "method",
            "title": "09 福利费支出超预算",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT a.年度,\r\n       a.单位代码,\r\n       a.单位名称,\r\n       a.经济科目代码,\r\n       a.经济科目名称,\r\n       a.支出预算金额,\r\n       isnull(d.支付金额,0) as 支付金额_按经济分类,\r\n       isnull(e.支付金额,0) as 支付金额_按摘要,\r\n       isnull(d.支付金额,0)+isnull(e.支付金额,0) as 支付总额,\r\n      a.支出预算金额-isnull(d.支付金额,0)-isnull(e.支付金额,0) as 差额\r\nFROM   (SELECT   年度,\r\n                 单位代码,\r\n                 单位名称,\r\n                 经济科目代码,\r\n                 经济科目名称,\r\n                 Sum(总计) * 10000 AS 支出预算金额\r\n        FROM     czcw_gh.dbo.基础表_部门预算_支出预算表 a\r\n        WHERE    (a.经济科目代码='30229')\r\n                 AND a.总计 <> 0\r\n        GROUP BY 年度,\r\n                 单位代码,\r\n                 单位名称,\r\n                 经济科目代码,\r\n                 经济科目名称) a\r\n       LEFT JOIN (SELECT \r\n                   预算年度,\r\n                   预算单位编码,\r\n                   预算单位名称,\r\n                   支出经济项目分类编码 as     经济科目代码,\r\n                   支出经济项目分类名称 as     经济科目名称,\r\n                   Sum(支付金额) AS 支付金额 \r\n                  FROM czcw_gh.dbo.基础表_支付凭证表 \r\n                  WHERE 行政区划代码=(SELECT Min(行政区划代码) FROM czcw_gh.dbo.基础表_预算单位) \r\n                  AND 预算单位编码 IS NOT NULL \r\n                  AND 预算单位名称 IS NOT NULL \r\n                  and 支出经济项目分类编码='30229'\r\n                  and 交易凭证类型名称<>'年终结转'\r\n                  GROUP BY \r\n                  预算年度,预算单位编码,预算单位名称,\r\n                  支出经济项目分类编码,支出经济项目分类名称) d\r\n       ON a.单位代码=d.预算单位编码 AND a.年度=d.预算年度 and a.经济科目代码=d.经济科目代码\r\n      LEFT JOIN (SELECT \r\n                   预算年度,\r\n                   预算单位编码,\r\n                   预算单位名称,\r\n                   Sum(支付金额) AS 支付金额 \r\n                  FROM czcw_gh.dbo.基础表_支付凭证表 \r\n                  WHERE 行政区划代码=(SELECT Min(行政区划代码) FROM czcw_gh.dbo.基础表_预算单位) \r\n                  AND 预算单位编码 IS NOT NULL \r\n                  AND 预算单位名称 IS NOT NULL \r\n                  and [摘要] like '%福利%' \r\n                  and [摘要] not like '%工资%' \r\n                  and [摘要] not like '%福利处%' \r\n                  and [摘要] not like '%儿童福利%' \r\n                  and [摘要] not like '%社会福利%' \r\n                  and [摘要] not like '%福利司%' \r\n                  and 支出经济项目分类编码<>'30229'\r\n                  and 交易凭证类型名称<>'年终结转'\r\n                  GROUP BY \r\n                  预算年度,预算单位编码,预算单位名称) e\r\n         on a.单位代码=e.预算单位编码 AND a.年度=e.预算年度\r\nWHERE\r\n\ta.年度 in ($预算年度$)  \r\n\tand a.支出预算金额-isnull(d.支付金额,0)-isnull(e.支付金额,0)<0\r\n    AND a.单位代码 like '$单位编码$%'\r\norder by a.单位代码",
            "isEnable": 1,
            "sort": 9,
            "methodType": "model",
            "autidType": "自动",
            "description": "反映了部分预算单位实际的福利费支出超出年初预算安排的问题",
            "params": [{
              "id": 199,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 1,
              "style": "text"
            }, {
              "id": 200,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }]
          }, {
            "id": 213,
            "type": "method",
            "title": "10 事业单位绩效工资发放超过规定总额",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SQLCode",
            "isEnable": 1,
            "sort": 10,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。财政厅审计中，收集了省人社厅、省财政厅批复6个预算单位所属事业单位绩效工资总量的文件，审计中可核实实际发放金额与省人社厅批复的标准是否一致，是否存在超额发放事业单位工资的问题。",
            "params": []
          }]
        }, {
          "id": 17,
          "type": "issues",
          "title": "项目支出预算管理情况",
          "description": "项目支出预算管理情况",
          "isDefault": 1,
          "isEnable": 1,
          "sort": 3,
          "children": [{
            "id": 214,
            "type": "method",
            "title": "01 项目支出明细查询",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT 行政区划代码,\n       [预算年度],\n       [预算单位编码],\n       [预算单位名称],\n       [项目分类编码],\n       [项目分类名称],\n       [交易凭证类型编码],\n       [交易凭证类型名称],\n       [预算科目编码],\n       [预算科目名称],\n       [资金性质编码],\n       [资金性质名称],\n       [预算项目编码],\n       [预算项目名称],\n       [支付方式编码],\n       [支付方式名称],\n       [预算类型编码],\n       [预算类型名称],\n       [支出经济项目分类编码],\n       [支出经济项目分类名称],\n       [支付金额],\n       [摘要],\n       [支付时间],\n       [清算时间],\n       [结算方式],\n       [供应商名称],\n       [银行账号],\n       [开户银行],\n       [付款账号],\n       [付款帐户],\n       [付款银行]\nFROM   czcw_gh.dbo.[基础表_支付凭证表]\nWHERE  行政区划代码 = (SELECT Min(行政区划代码)\n                 FROM   czcw_gh.dbo.基础表_预算单位)\n       AND 预算年度 in ($预算年度$)\n       AND Left(项目分类编码,6) not in  ('001001','001002','001003')\n       AND 预算单位编码 like '$单位编码$%'",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询项目支出明细信息。",
            "params": [{
              "id": 129,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 130,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 215,
            "type": "method",
            "title": "02 项目支出经济科目构成分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   预算年度,\n         预算单位编码,\n         预算单位名称,\n         支出经济项目分类编码,\n         支出经济项目分类名称,\n         Sum(支付金额) AS 支付金额,\n         行政区划代码\nFROM     czcw_gh.dbo.基础表_支付凭证表\nWHERE    行政区划代码 = (SELECT Min(行政区划代码)\n                   FROM   czcw_gh.dbo.基础表_预算单位)\n         AND Left(项目分类编码,6) NOT IN ('001001','001002','001003')\n         AND 预算年度 in ($预算年度$)\n         AND 预算单位编码  like '$单位编码$%'\nGROUP BY 预算年度,\n         预算单位编码,\n         预算单位名称,\n         支出经济项目分类编码,\n         支出经济项目分类名称,\n         行政区划代码",
            "isEnable": 1,
            "sort": 2,
            "methodType": "model",
            "autidType": "自动",
            "description": "分析项目支出支付凭证的经济科目构成。",
            "params": [{
              "id": 131,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 132,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 216,
            "type": "method",
            "title": "03 部门项目支出预算与执行差异分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "\r\nSELECT   预算年度,\r\n         预算单位编码,\r\n         预算单位名称,\r\n         预算项目名称,\r\n         指标来源编码,\r\n         指标来源名称,\r\n         项目分类名称,\r\n         预算类型名称,\r\n         Sum(批准预算金额)                          AS 可执行指标金额,\r\n         Sum(支付金额)                                                   AS 支付金额,\r\n         Sum(批准预算金额)-Sum(支付金额) as 差额,\r\n         CONVERT( NUMERIC(5,3), (Sum(支付金额))*1.0/(Sum(批准预算金额))) AS 预算执行率\r\n         \r\nFROM     (SELECT   a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   c.项目分类名称,\r\n                   a.预算类型名称,\r\n                   Sum(isnull(调整方向,1)*abs(批准预算金额)) AS 批准预算金额,\r\n                   0           AS 支付金额\r\n          FROM     czcw_gh.dbo.基础表_指标表 a\r\n                   LEFT JOIN czcw_gh.dbo.基础表_预算单位 b  ON a.预算年度=b.预算年度 AND a.预算单位编码=b.预算单位编码 AND a.行政区划代码=b.行政区划代码\r\n                   left join czcw_gh.dbo.代码表_项目分类 c  ON a.预算年度=c.年度 AND a.项目分类编码=c.项目分类编码 AND a.行政区划代码=c.行政区划代码\r\n          WHERE    a.指标类型编码 LIKE '14%' and isnull(a.指标调整类型名称,'') not like '%冻%'\r\n                   AND a.行政区划代码 = (select min(行政区划代码) from  czcw_gh.dbo.基础表_预算单位)\r\n          GROUP BY a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   c.项目分类名称,\r\n                   a.预算类型名称\r\n          union all\r\n          SELECT   a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   c.项目分类名称,\r\n                   a.预算类型名称,\r\n                   -Sum(批准预算金额) AS 批准预算金额,\r\n                   0           AS 支付金额\r\n          FROM     czcw_gh.dbo.基础表_指标表 a\r\n                   LEFT JOIN czcw_gh.dbo.基础表_预算单位 b  ON a.预算年度=b.预算年度 AND a.预算单位编码=b.预算单位编码 AND a.行政区划代码=b.行政区划代码\r\n                   left join czcw_gh.dbo.代码表_项目分类 c  ON a.预算年度=c.年度 AND a.项目分类编码=c.项目分类编码 AND a.行政区划代码=c.行政区划代码\r\n          WHERE    a.指标类型编码 LIKE '14%' and a.指标调整类型名称 like '%冻结%'\r\n                   AND a.行政区划代码 = (select min(行政区划代码) from  czcw_gh.dbo.基础表_预算单位)\r\n          GROUP BY a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   c.项目分类名称,\r\n                   a.预算类型名称\r\n          union all\r\n          SELECT   a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   c.项目分类名称,\r\n                   a.预算类型名称,\r\n                   Sum(批准预算金额) AS 批准预算金额,\r\n                   0           AS 支付金额\r\n          FROM     czcw_gh.dbo.基础表_指标表 a\r\n                   LEFT JOIN czcw_gh.dbo.基础表_预算单位 b  ON a.预算年度=b.预算年度 AND a.预算单位编码=b.预算单位编码 AND a.行政区划代码=b.行政区划代码\r\n                   left join czcw_gh.dbo.代码表_项目分类 c  ON a.预算年度=c.年度 AND a.项目分类编码=c.项目分类编码 AND a.行政区划代码=c.行政区划代码\r\n          WHERE    a.指标类型编码 LIKE '14%' and a.指标调整类型名称 like '%解冻%'\r\n                   AND a.行政区划代码 = (select min(行政区划代码) from  czcw_gh.dbo.基础表_预算单位)\r\n          GROUP BY a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   c.项目分类名称,\r\n                   a.预算类型名称\r\n\r\n          UNION ALL\r\n          SELECT   a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   c.项目分类名称,\r\n                   a.预算类型名称,\r\n                   0         AS 批准预算金额,\r\n                   Sum(支付金额) AS 支付金额\r\n          FROM     czcw_gh.dbo.基础表_支付凭证表 a\r\n                   LEFT JOIN czcw_gh.dbo.基础表_预算单位 b  ON a.预算年度=b.预算年度 AND a.预算单位编码=b.预算单位编码 AND a.行政区划代码=b.行政区划代码\r\n                   left join czcw_gh.dbo.代码表_项目分类 c  ON a.预算年度=c.年度 AND a.项目分类编码=c.项目分类编码 AND a.行政区划代码=c.行政区划代码\r\n          WHERE    a.行政区划代码 = (select min(行政区划代码) from  czcw_gh.dbo.基础表_预算单位)\r\n                   and 交易凭证类型名称<>'年终结转'\r\n          GROUP BY a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   c.项目分类名称,\r\n                   a.预算类型名称\r\n  ) t\r\nGROUP BY 预算年度,\r\n         预算单位编码,\r\n         预算单位名称,\r\n         预算项目名称,\r\n         指标来源编码,\r\n         指标来源名称,\r\n         项目分类名称, \r\n         预算类型名称\r\n         HAVING 预算单位编码 IS NOT NULL\r\n\t\t\tAND 预算年度 in ($预算年度$)   \r\n\t\t\tand 预算单位编码 like  '$单位编码$%'\r\n\t\tORDER BY 预算单位编码,12\r\n",
            "isEnable": 1,
            "sort": 3,
            "methodType": "model",
            "autidType": "自动",
            "description": "分析项目支出预算与执行情况的差异，重点关注项目执行率较低的，以及超预算支付的项目，揭示预算单位虚报预算规模、虚构预算项目等套取预算资金的问题。",
            "params": [{
              "id": 133,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 134,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 217,
            "type": "method",
            "title": "04 基本支出挤占项目支出",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [编号],\n       [预算年度],\n       [交易凭证类型编码],\n       [交易凭证类型名称],\n       [业务科室编码],\n       [业务科室名称],\n       [预算单位编码],\n       [预算单位名称],\n       [预算科目编码],\n       [预算科目名称],\n       [项目分类编码],\n       [项目分类名称],\n       [资金性质编码],\n       [资金性质名称],\n       [预算项目编码],\n       [预算项目名称],\n       [指标特性编码],\n       [指标特性名称],\n       [指标来源编码],\n       [指标来源名称],\n       [指标文件编号],\n       [指标文件名称],\n       [支付方式编码],\n       [支付方式名称],\n       [预算类型编码],\n       [预算类型名称],\n       [支出经济项目分类编码],\n       [支出经济项目分类名称],\n       [支付金额],\n       [摘要],\n       [支付时间],\n       [清算时间],\n       [结算方式],\n       [供应商名称],\n       [银行账号],\n       [开户银行],\n       [付款账号],\n       [付款帐户],\n       [付款银行],\n       [生成人],\n       [生成时间],\n       [来源计划额度ID],\n       [行政区划代码]\nFROM   czcw_gh.dbo.[分析表_模型_部门预算执行_违规挪用专项资金]\nwhere 预算年度 in ($预算年度$)\n and     [预算单位编码] like '$单位编码$%'",
            "isEnable": 1,
            "sort": 4,
            "methodType": "model",
            "autidType": "自动",
            "description": "查看资金来源为“专款”、“专项资金”、“项目支出”，并且：<br/>1.资金用途备注为：“奖金”、“补贴”、“奖励”等补贴类支付数据；<br/>2.收款单位为“酒店”、“餐饮”、“培训中心”等记录进行延伸审计核实。",
            "params": [{
              "id": 135,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 136,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 218,
            "type": "method",
            "title": "05 年初预算项目支出执行进度分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [预算年度],\n       [预算单位编码],\n       [预算单位名称],\n       [批准预算金额],\n       [冻结金额],\n       [解冻金额],\n       [可执行指标金额],\n       [支付金额],\n       [全年执行率],\n       [截止6月30日支付金额],\n       [截止6月30日执行率],\n       [截止9月30日支付金额],\n       [截止9月30日执行率],\n       [截止10月31日支付金额],\n       [截止10月31日执行率]\nFROM   czcw_gh.dbo.[分析表_模型_部门预算执行_年初预算项目支出执行进度分析]\nwhere 预算年度 in ( $预算年度$ )   --\n and [预算单位编码] like '$单位编码$%'\norder by 预算单位编码\n",
            "isEnable": 1,
            "sort": 5,
            "methodType": "model",
            "autidType": "自动",
            "description": "按照3个时间节点，统计项目的执行进度，对项目执行进度缓慢的或者集中在年底支付的进行重点关注，对项目制定的科学性进行评价，揭示项目前期论证不充分，执行不到位，项目资金大量结余等问题。",
            "params": [{
              "id": 137,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 138,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 219,
            "type": "method",
            "title": "06 项目竣工后未及时办理财务竣工决算",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 6,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。",
            "params": []
          }, {
            "id": 220,
            "type": "method",
            "title": "07 自行改变项目实际用途",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 7,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。",
            "params": []
          }, {
            "id": 221,
            "type": "method",
            "title": "08 虚列支出",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 8,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。",
            "params": []
          }]
        }, {
          "id": 18,
          "type": "issues",
          "title": "预算资金拨付",
          "description": "预算资金拨付",
          "isDefault": 1,
          "isEnable": 1,
          "sort": 4,
          "children": [{
            "id": 222,
            "type": "method",
            "title": "01 资金支付凭证明细查询",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "select  * \nfrom czcw_gh.dbo.基础表_支付凭证表 a\nwhere a.预算年度 in ($预算年度$)\nand a.预算单位编码 like '$单位编码$%'  and 行政区划代码='410000'",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询各预算单位的资金支付凭证。",
            "params": [{
              "id": 139,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 140,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 223,
            "type": "method",
            "title": "02 直接拨付下属单位",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "select  *  from  czcw_gh.dbo.基础表_支付凭证表 a\r\nwhere 预算单位编码  LIKE '%101'\r\n\tAND 预算单位编码 like '$单位编码$%'\r\n\tAND 预算年度 IN  ($预算年度$)\r\n    AND a. 供应商名称 in  (\r\n\t\tselect 预算单位名称  from czcw_gh.dbo.基础表_预算单位 a\r\n\t\twhere 预算单位编码 not LIKE '%101'\r\n\t\t\t  AND 预算单位编码 like '$单位编码$%'\r\n\t\t\t  AND 预算年度 IN ($预算年度$)\r\n\t\t\t  AND len(预算单位编码)<> 3\r\n\t)\r\n",
            "isEnable": 1,
            "sort": 2,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询预算单位向下级单位支付的情况。",
            "params": [{
              "id": 141,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 142,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 224,
            "type": "method",
            "title": "03 同一主管部门的二级预算单位之间由零余额账户向对方实拨资金账户转移资金",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [编号],\n       [预算年度],\n       [交易凭证类型编码],\n       [交易凭证类型名称],\n       [业务科室编码],\n       [业务科室名称],\n       [预算单位编码],\n       [预算单位名称],\n       [预算科目编码],\n       [预算科目名称],\n       [项目分类编码],\n       [项目分类名称],\n       [资金性质编码],\n       [资金性质名称],\n       [预算项目编码],\n       [预算项目名称],\n       [指标特性编码],\n       [指标特性名称],\n       [指标来源编码],\n       [指标来源名称],\n       [指标文件编号],\n       [指标文件名称],\n       [支付方式编码],\n       [支付方式名称],\n       [预算类型编码],\n       [预算类型名称],\n       [支出经济项目分类编码],\n       [支出经济项目分类名称],\n       [支付金额],\n       [摘要],\n       [支付时间],\n       [清算时间],\n       [结算方式],\n       [供应商名称],\n       [银行账号],\n       [供应商银行账户性质],\n       [开户银行],\n       [付款账号],\n       [付款帐户],\n       [付款银行],\n       [生成人],\n       [生成时间],\n       [来源计划额度ID],\n       [行政区划代码]\nFROM   czcw_gh.dbo.[分析表_模型_部门预算执行_同一主管部门的二级预算单位之间由零余额账户向对方实拔资金账户转移资金]\nWHERE  预算年度 IN ($预算年度$)\n AND  [预算单位名称] LIKE  '$单位编码$%'\norder by 预算单位编码\n",
            "isEnable": 1,
            "sort": 3,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询同一系统二级机构之间的支付信息。",
            "params": [{
              "id": 207,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }, {
              "id": 208,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 1,
              "style": "pop"
            }]
          }, {
            "id": 225,
            "type": "method",
            "title": "04 零余额账户与基本账户之间转拨款的合规合法性审查",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   \n         a.[编号],\n         a.[预算年度],\n         a.[交易凭证类型编码],\n         a.[交易凭证类型名称],\n         a.业务科室编码,\n         a.业务科室名称,\n         a.预算单位编码,\n         a.预算单位名称,\n         a.供应商名称,\n         a.银行账号 as 供应商银行账号,\n         b.账户性质 as 供应商银行账户性质,\n         a.开户银行,\n         a.付款账号,\n         '零余额账户' as 付款账户性质,\n         a.付款帐户,\n         a.付款银行,\n         a.支付金额,\n         a.摘要,\n         a.指标文件编号,\n         a.指标文件名称,\n         a.预算科目编码,\n         a.预算科目名称,\n         a.项目分类编码,\n         a.项目分类名称,\n         a.资金性质编码,\n         a.资金性质名称,\n         a.预算项目编码,\n         a.预算项目名称,\n         a.指标特性编码,\n         a.指标特性名称,\n         a.指标来源编码,\n         a.指标来源名称,\n         a.支付方式编码,\n         a.支付方式名称,\n         a.预算类型编码,\n         a.预算类型名称,\n         a.支出经济项目分类编码,\n         a.支出经济项目分类名称,\n         a.支付时间,\n         a.清算时间,\n         a.结算方式,\n         a.生成人,\n         a.生成时间,\n         a.来源计划额度id,\n         a.行政区划代码\nFROM    czcw_gh.dbo.基础表_支付凭证表 a\nleft join (select distinct 账号,账户性质 \n  from  czcw_gh.dbo.基础表_单位银行账户表 \n  where isnull(账户性质,'')<>'') b on a.[银行账号]=b.账号\nLEFT JOIN  (SELECT Min(行政区划代码) as 行政区划代码 \n  FROM   czcw_gh.dbo.基础表_预算单位) T \n  ON T.行政区划代码= a.行政区划代码\nWHERE  a.预算年度 in ($预算年度$) --\n       and a.预算单位编码 like '$单位编码$%'\n       and a.[付款帐户]=a.[预算单位名称]\n       and exists(select 1 from czcw_gh.dbo.基础表_单位银行账户表 t where a.付款账号=t.账号 and t.账户性质 like '%零余额%')\n       and (b.账户性质 like '%基本%' or b.账户性质 like '%一般%')",
            "isEnable": 1,
            "sort": 4,
            "methodType": "model",
            "autidType": "自动",
            "description": "通过国库集中支付凭证表，查询从预算单位零余额账户向预算单位非零余额账户拨付资金的信息，审查其合法合规性。",
            "params": [{
              "id": 145,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 146,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 226,
            "type": "method",
            "title": "05 零余额账户与基本账户之间转拨款的合规合法性审查_财务",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "select b.会计核算单位,\n       stuff(a.[会计电子账簿编号],5,4,'') as 账套编号,\n       a.[会计电子账簿名称] as 账套名称,\n       a.[会计年度],\n       a.[会计月份],\n       convert(varchar(10),a.[记账凭证日期],112) as 记账凭证日期,\n       a.[记账凭证摘要],\n       a.[记账凭证种类],\n       a.[记账凭证编号],\n       a.[会计科目编号],\n       a.[会计科目名称],\n       a.[借方发生额],\n       a.[贷方发生额],\n       a.[附件数],\n       a.[对方科目编码],\n       a.[对方科目名称],\n       a.[记账凭证行号]\nfrom czcw_gh.dbo.基础表_财务类_记账凭证表 a\njoin czcw_gh.dbo.基础表_财务类_电子账簿信息表 b on a.[行政区划代码]=b.[行政区划代码] and a.[会计电子账簿编号]=b.[会计电子账簿编号]\njoin czcw_gh.dbo.基础表_财务类_会计科目表 c on a.[行政区划代码]=c.[行政区划代码] and a.[会计电子账簿编号]=c.[会计电子账簿编号] and a.会计科目编号=c.会计科目编号\nwhere left(a.[会计电子账簿编号],4)='1009' and b.账套类别 in ('行政','事业','学校')\n  and a.会计年度 in ($预算年度$)\n  and b.单位代码 like  '$单位编码$%'\n  and c.会计科目编号_标准='1011' and 贷方发生额<>0\n  and (对方科目编码 like '102%' and 对方科目编码 not like '1021%'\n    or 对方科目编码 like '1002%'\n    or 对方科目编码 like '%,102%' and 对方科目编码 not like '%1021%'\n    or 对方科目编码 like '%,1002%')\norder by stuff(a.[会计电子账簿编号],5,4,'') ,a.会计年度,cast(a.会计月份 as int),a.记账凭证种类,a.记账凭证编号\n\n\n \n\n\n",
            "isEnable": 1,
            "sort": 5,
            "methodType": "model",
            "autidType": "自动",
            "description": "从预算单位财务账中，查询各预算单位零余额账户与基本账户之间转拨款的信息，审查其合法合规性。",
            "params": [{
              "id": 209,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }, {
              "id": 210,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 1,
              "style": "pop"
            }]
          }, {
            "id": 227,
            "type": "method",
            "title": "06 违反账户管理规定",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "select  * from czcw_gh.dbo.基础表_单位银行账户表 \n\nwhere 所属单位编码 like  '$单位编码$%'",
            "isEnable": 1,
            "sort": 6,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询预算单位的账户设立情况表，重点关注以下几方面：一、未按规定设立银行账户；二、银行账户清理不彻底；三、出租、出借银行结算账户（需要结合银行对账单，以及集中支付凭证表中异常金额、异常供应商等，进行手工审计和甄别）。",
            "params": [{
              "id": 149,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }]
          }, {
            "id": 228,
            "type": "method",
            "title": "07 单位基本户存量资金情况",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   [单位代码],\n         [单位名称],\n         [会计电子账簿编号],\n         [会计电子账簿名称],\n         [行政区划代码],\n         [会计年度],\n         [会计科目编号],\n         [科目全称],\n         [上年余额],\n         [本年收入],\n         [本年支出],\n         [其中_收回金额],\n         [年末余额]\nFROM     czcw_gh.dbo.[分析表_模型_部门预算执行_单位基本户存量资金情况]\nWHERE    会计年度 in ($预算年度$)\n         AND 单位代码 like  '$单位编码$%'\nORDER BY 单位代码,\n         [会计电子账簿编号],\n         [会计科目编号]",
            "isEnable": 1,
            "sort": 7,
            "methodType": "model",
            "autidType": "自动",
            "description": "本方法的数据仅供参考，还需要进行人工审计和核实。根据要求，部门预算结余资金以及结转两年以上的资金（包括基建资金和非基建资金），由同级财政收回统筹使用。但在清理各单位基本账户存量资金时，各单位可能没有如实填报基本账户存量资金的形成年度和性质，部门存在存量资金应收回未收回的问题。同时，可以分析基本账户的资金来源渠道，分析其中上级部门拨入资金、本级财政拨入资金、其他个人或单位缴款等几种形式。",
            "params": [{
              "id": 150,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 151,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 229,
            "type": "method",
            "title": "08 年终支出真实性审查_12月份支付",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   [预算年度],\n         [交易凭证类型编码],\n         [交易凭证类型名称],\n         [业务科室编码],\n         [业务科室名称],\n         [预算单位编码],\n         [预算单位名称],\n         [预算科目编码],\n         [预算科目名称],\n         [项目分类编码],\n         [项目分类名称],\n         [资金性质编码],\n         [资金性质名称],\n         [预算项目编码],\n         [预算项目名称],\n         [指标特性编码],\n         [指标特性名称],\n         [指标来源编码],\n         [指标来源名称],\n         [指标文件编号],\n         [指标文件名称],\n         [支付方式编码],\n         [支付方式名称],\n         [预算类型编码],\n         [预算类型名称],\n         [支出经济项目分类编码],\n         [支出经济项目分类名称],\n         [支付金额],\n         [摘要],\n         [支付时间],\n         [清算时间],\n         [结算方式],\n         [供应商名称],\n         [银行账号],\n         [开户银行],\n         [付款账号],\n         [付款帐户],\n         [付款银行],\n         [生成人],\n         [生成时间],\n         [来源计划额度ID]\nFROM     czcw_gh.dbo.[基础表_支付凭证表]\nWHERE    right(rtrim(支付时间),4) >= '1201'\n         AND right(rtrim(支付时间),4) <= '1231'\n         AND 预算年度 in ($预算年度$) \n         AND 预算单位编码 like '$单位编码$%'\n         and 行政区划代码=(select min(行政区划代码) from czcw_gh.dbo.基础表_预算单位)\nORDER BY 预算单位编码,\n         支付时间\n",
            "isEnable": 1,
            "sort": 8,
            "methodType": "model",
            "autidType": "自动",
            "description": "部分单位为了减少财政结余结转资金，通过向二级单位、宾馆或其他供应商，在没有实际发生购买服务的情况下，提前拨付资金。如某部门的培训业务按照计划应在下年2月发生，部门财务为了增加本年的支出，在本年12月底，将财政下达的专项经费提前拨付给某宾馆。规划、设计、咨询、培训等服务类支出容易产生上述问题。",
            "params": [{
              "id": 152,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 153,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 230,
            "type": "method",
            "title": "09 项目集中在年底支出",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   预算年度,\r\n         预算单位编码,\r\n         预算单位名称,\r\n         预算项目名称,\r\n         指标来源编码,\r\n         指标来源名称,\r\n         预算类型名称,\r\n         Sum(全年支付金额)   AS 支付金额,\r\n         SUM(十二月份支付金额) as 十二月份支付金额,\r\n         case when Sum(全年支付金额)=0 then 0 else  convert(decimal(16,2),round(SUM(十二月份支付金额)*100/(Sum(全年支付金额)),2)) end as 十二月份支付占比\r\n\r\nFROM     (\r\n          SELECT   a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   a.预算类型名称,\r\n                   Sum(支付金额) as 全年支付金额,\r\n                   0   AS 十二月份支付金额\r\n          FROM     czcw_gh.dbo.基础表_支付凭证表 a\r\n           LEFT JOIN czcw_gh.dbo.基础表_预算单位 b\r\n                   ON a.预算年度=b.预算年度 AND a.预算单位编码=b.预算单位编码 AND a.行政区划代码=b.行政区划代码\r\n          WHERE    a.行政区划代码 = (select min(行政区划代码) from  czcw_gh.dbo.基础表_预算单位)\r\n               and left(项目分类编码,6) not in ('001001','001002','001003')\r\n               and 交易凭证类型名称<>'年终结转'\r\n               and a.预算年度 in ($预算年度$) \r\n               and a.预算单位编码 like '$单位编码$%'\r\n              --and 指标来源编码 like '4%'\r\n          GROUP BY a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   a.预算类型名称\r\n          union all\r\n          SELECT   a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   a.预算类型名称,                   \r\n                   0 as 全年支付金额,\r\n                   Sum(支付金额) AS 十二月份支付金额\r\n          FROM     czcw_gh.dbo.基础表_支付凭证表 a\r\n           LEFT JOIN czcw_gh.dbo.基础表_预算单位 b\r\n                   ON a.预算年度=b.预算年度 AND a.预算单位编码=b.预算单位编码 AND a.行政区划代码=b.行政区划代码\r\n          WHERE    a.行政区划代码 = (select min(行政区划代码) from  czcw_gh.dbo.基础表_预算单位)\r\n               and left(项目分类编码,6) not in ('001001','001002','001003')\r\n               and 交易凭证类型名称<>'年终结转'\r\n               and a.预算年度 in ($预算年度$) \r\n               and a.预算单位编码 like '$单位编码$%'\r\n              --and 指标来源编码 like '4%'\r\n               and substring(isnull(支付时间,生成时间),5,2)='12'\r\n          GROUP BY a.预算年度,\r\n                   a.预算单位编码,\r\n                   b.预算单位名称,\r\n                   a.预算项目名称,\r\n                   a.指标来源编码,\r\n                   a.指标来源名称,\r\n                   a.预算类型名称                   \r\n                   ) t\r\nGROUP BY 预算年度,\r\n         预算单位编码,\r\n         预算单位名称,\r\n         预算项目名称,\r\n         指标来源编码,\r\n         指标来源名称,\r\n         预算类型名称\r\n         HAVING 预算单位编码 IS NOT NULL \r\n         AND 预算年度 in( $预算年度$ )  and   预算单位编码 like '$单位编码$%'\r\n         --AND 预算年度 in( 2016 )  and     预算单位编码 like '028%'\r\n\tORDER BY 预算年度,预算单位编码\r\n\r\n",
            "isEnable": 1,
            "sort": 9,
            "methodType": "model",
            "autidType": "自动",
            "description": "反应了12月份支出金额占预算50%以上的明细项目，审计中重点核实是否存在虚构事项转拨资金或经济事项实际未发生预拨资金等问题；",
            "params": [{
              "id": 191,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 1,
              "style": "text"
            }, {
              "id": 192,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }]
          }, {
            "id": 231,
            "type": "method",
            "title": "10 工会经费实际支出超预算",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "/****** Script for SelectTopNRows command from SSMS  ******/\r\nselect a.年度\r\n\t  ,a.[单位代码]\r\n      ,a.[单位名称]\r\n      ,'30228' as [支出经济项目分类编码]\r\n      ,'工会经费' as [支出经济项目分类名称]\r\n      ,a.[预算金额]\r\n      ,isnull(b.[支付金额],0.00) as [支付金额_按经济分类]\r\n      ,isnull(c.[支付金额],0.00) as [支付金额_按摘要]\r\n      ,isnull(b.[支付金额],0.00)+isnull(c.[支付金额],0.00) as 支付总额\r\n      ,a.[预算金额]-(isnull(b.[支付金额],0.00)+isnull(c.[支付金额],0.00)) as 差额\r\n      --into abc2016.dbo.分析表_模型_部门预算执行_工会经费实际支出超预算\r\nfrom\r\n(SELECT 年度\r\n\t  ,[单位代码]\r\n      ,[单位名称]\r\n      ,[总计]*10000 as [预算金额]\r\n  FROM [czcw_gh].[dbo].[基础表_部门预算_支出预算表]\r\n  where 经济科目代码='30228' )a\r\n  left join\r\n  (SELECT [预算年度]\r\n\t  ,[预算单位编码]\r\n      ,[预算单位名称]\r\n      ,[支出经济项目分类编码]\r\n      ,[支出经济项目分类名称]\r\n      ,sum([支付金额]) as [支付金额]   \r\n  FROM [czcw_gh].[dbo].[基础表_支付凭证表]\r\n  where [支出经济项目分类编码]='30228' and [交易凭证类型名称] !='年终结转' and [行政区划代码]='410000'\r\n  group by [预算年度],[预算单位编码],[预算单位名称],[支出经济项目分类编码],[支出经济项目分类名称])b\r\n  on a.[单位代码]=b.预算单位编码 and a.年度=b.预算年度\r\n  left join \r\n  (SELECT \r\n       预算年度\r\n      ,[预算单位编码]\r\n      ,[预算单位名称]\r\n      ,sum([支付金额]) as [支付金额] \r\n  FROM [czcw_gh].[dbo].[基础表_支付凭证表]\r\n  where [摘要] like '%工会%' and [支出经济项目分类编码] !='30228'  and [交易凭证类型名称] !='年终结转' and [行政区划代码]='410000'\r\n  group by 预算年度\r\n      ,[预算单位编码]\r\n      ,[预算单位名称])c\r\n      on a.[单位代码]=c.预算单位编码  and a.年度=c.预算年度\r\nwhere a.[预算金额]-(isnull(b.[支付金额],0.00)+isnull(c.[支付金额],0.00))<'0.00'\r\n  and a.年度 IN  ($预算年度$) AND A.单位代码 LIKE '$单位编码$%'\r\n  order by a.[单位代码]",
            "isEnable": 1,
            "sort": 10,
            "methodType": "model",
            "autidType": "自动",
            "description": "反映了部分预算单位实际的工会经费超出年初预算安排的问题",
            "params": [{
              "id": 195,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 1,
              "style": "text"
            }, {
              "id": 196,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }]
          }, {
            "id": 232,
            "type": "method",
            "title": "11 非工会资金拨入工会账户",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [编号]\r\n      ,[预算年度]\r\n      ,[交易凭证类型编码]\r\n      ,[交易凭证类型名称]\r\n      ,[业务科室编码]\r\n      ,[业务科室名称]\r\n      ,[预算单位编码]\r\n      ,[预算单位名称]\r\n      ,[预算科目编码]\r\n      ,[预算科目名称]\r\n      ,[项目分类编码]\r\n      ,[项目分类名称]\r\n      ,[资金性质编码]\r\n      ,[资金性质名称]\r\n      ,[预算项目编码]\r\n      ,[预算项目名称]\r\n      ,[指标特性编码]\r\n      ,[指标特性名称]\r\n      ,[指标来源编码]\r\n      ,[指标来源名称]\r\n      ,[指标文件编号]\r\n      ,[指标文件名称]\r\n      ,[支付方式编码]\r\n      ,[支付方式名称]\r\n      ,[预算类型编码]\r\n      ,[预算类型名称]\r\n      ,[支出经济项目分类编码]\r\n      ,[支出经济项目分类名称]\r\n      ,[支付金额]\r\n      ,[摘要]\r\n      ,[支付时间]\r\n      ,[清算时间]\r\n      ,[结算方式]\r\n      ,[供应商名称]\r\n      ,[银行账号]\r\n      ,[开户银行]\r\n      ,[付款账号]\r\n      ,[付款帐户]\r\n      ,[付款银行]\r\n      ,[生成人]\r\n      ,[生成时间]\r\n      ,[来源计划额度ID]\r\n      ,[行政区划代码]\r\n\r\n  FROM [czcw_gh].[dbo].[基础表_支付凭证表] \r\n  where \r\n\t预算年度 in ($预算年度$)  \r\n    and  行政区划代码='410000'\r\n    and 预算单位编码 like '$单位编码$%'\r\n    and [供应商名称] like '%工会%' \r\n    and [预算项目名称]<>'工会经费' \r\n    and 预算单位名称 not like '%工会%'\r\n    and [预算项目名称] not like '%三代%'\r\n    and 交易凭证类型名称<>'年终结转'\r\n\r\n  order by [预算年度],[预算单位编码],支付金额  desc",
            "isEnable": 1,
            "sort": 11,
            "methodType": "model",
            "autidType": "自动",
            "description": "反映了部分单位将非工会经费拨入工会账户的问题，实际也形成了超预算支出工会经费的问题",
            "params": [{
              "id": 197,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 1,
              "style": "text"
            }, {
              "id": 198,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }]
          }, {
            "id": 233,
            "type": "method",
            "title": "12 违规向个人账户转拨资金",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [编号]\r\n      ,[预算年度]\r\n      ,[交易凭证类型编码]\r\n      ,[交易凭证类型名称]\r\n      ,[业务科室编码]\r\n      ,[业务科室名称]\r\n      ,[预算单位编码]\r\n      ,[预算单位名称]\r\n      ,[预算科目编码]\r\n      ,[预算科目名称]\r\n      ,[项目分类编码]\r\n      ,[项目分类名称]\r\n      ,[资金性质编码]\r\n      ,[资金性质名称]\r\n      ,[预算项目编码]\r\n      ,[预算项目名称]\r\n      ,[指标特性编码]\r\n      ,[指标特性名称]\r\n      ,[指标来源编码]\r\n      ,[指标来源名称]\r\n      ,[指标文件编号]\r\n      ,[指标文件名称]\r\n      ,[支付方式编码]\r\n      ,[支付方式名称]\r\n      ,[预算类型编码]\r\n      ,[预算类型名称]\r\n      ,[支出经济项目分类编码]\r\n      ,[支出经济项目分类名称]\r\n      ,[支付金额]\r\n      ,[摘要]\r\n      ,[支付时间]\r\n      ,[清算时间]\r\n      ,[结算方式]\r\n      ,[供应商名称]\r\n      ,[银行账号]\r\n      ,[开户银行]\r\n      ,[付款账号]\r\n      ,[付款帐户]\r\n      ,[付款银行]\r\n      ,[生成人]\r\n      ,[生成时间]\r\n      ,[来源计划额度ID]\r\n      ,[行政区划代码]\r\n  FROM [czcw_gh].[dbo].基础表_支付凭证表\r\nwhere [行政区划代码]=(select MIN([行政区划代码]) from czcw_gh.dbo.基础表_预算单位)\r\n  and 预算年度  in  ($预算年度$)  \r\n  and [支出经济项目分类编码]='30226'\r\n  and LEN(供应商名称)<=3\r\n  and 交易凭证类型名称<>'年终结转'\r\n  and 支付金额>=10000\r\n  --and 摘要 like '%借%'\r\n  and 预算单位编码 like '$单位编码$%'\r\norder by 预算单位编码,支付时间",
            "isEnable": 1,
            "sort": 12,
            "methodType": "model",
            "autidType": "自动",
            "description": "反映了支付给个人、金额超过1万元的劳务费支出",
            "params": [{
              "id": 201,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 1,
              "style": "text"
            }, {
              "id": 202,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }]
          }, {
            "id": 234,
            "type": "method",
            "title": "13 当月多笔支付总额为整数",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   [预算年度],\r\n         Substring(支付时间,5,2) AS 月份,\r\n         [预算单位编码],\r\n         [预算单位名称],\r\n         [供应商名称],\r\n         Sum([支付金额])         AS [支付金额],\r\n         Count(1)            AS 笔数,\r\n         行政区划代码\r\nFROM     czcw_gh.dbo.[基础表_支付凭证表]\r\nwhere   行政区划代码 = (SELECT Min(行政区划代码) FROM   czcw_gh.dbo.基础表_预算单位)\r\n  AND [预算年度] in ($预算年度$) -- $预算年度$\r\n  AND 预算单位编码 like '$单位编码$%'\r\nGROUP BY [预算年度],\r\n         [预算单位编码],\r\n         [预算单位名称],\r\n         Substring(支付时间,5,2),\r\n         [供应商名称],\r\n         行政区划代码 HAVING Sum([支付金额])%10000 = 0\r\n                       AND Sum([支付金额]) <> 0\r\n                       AND Count(1) > 1\r\n                      \r\n\r\n",
            "isEnable": 1,
            "sort": 13,
            "methodType": "model",
            "autidType": "自动",
            "description": "单月支付给同一供应商多笔，且合计金额能被1万整除，可能存在化整为零躲避政府采购的问题。",
            "params": [{
              "id": 154,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 155,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 235,
            "type": "method",
            "title": "14 向社团拨付资金",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT \n       [编号]\n      ,[预算年度]\n      ,[交易凭证类型编码]\n      ,[交易凭证类型名称]\n      ,[业务科室编码]\n      ,[业务科室名称]\n      ,[预算单位编码]\n      ,[预算单位名称]\n      ,[预算科目编码]\n      ,[预算科目名称]\n      ,[项目分类编码]\n      ,[项目分类名称]\n      ,[资金性质编码]\n      ,[资金性质名称]\n      ,[预算项目编码]\n      ,[预算项目名称]\n      ,[指标特性编码]\n      ,[指标特性名称]\n      ,[指标来源编码]\n      ,[指标来源名称]\n      ,[指标文件编号]\n      ,[指标文件名称]\n      ,[支付方式编码]\n      ,[支付方式名称]\n      ,[预算类型编码]\n      ,[预算类型名称]\n      ,[支出经济项目分类编码]\n      ,[支出经济项目分类名称]\n      ,[支付金额]\n      ,[摘要]\n      ,[支付时间]\n      ,[清算时间]\n      ,[结算方式]\n      ,[供应商名称]\n      ,a.[银行账号]\n      ,a.[开户银行]\n      ,[付款账号]\n      ,[付款帐户]\n      ,[付款银行]\n      ,[生成人]\n      ,[生成时间]\n      ,[来源计划额度ID]\n      ,[行政区划代码]\n      ,b.[登记年度] as 单位登记年度\n      ,b.[登记时间] as 单位登记时间\n      ,b.[登记部门] as 单位登记部门\n      ,b.[部门登记证号]\n      ,b.[法定代表人]\n      ,b.[电话] as 单位电话\n      ,b.[地址] as 单位地址\n      ,b.[邮编]\n      ,b.[行业分类]\n      ,b.[单位类别]\n      ,b.[民政分类]\n      ,b.[业务主管部门]\n      ,b.[业务主管部门全称]\n      ,b.[单位所在地行政区划代码]\n      ,b.[行政区划]\n  FROM czcw_gh.dbo.[基础表_支付凭证表] a\n  join qthy_gh.dbo.[基础表_民政_社团基本信息] b on a.[供应商名称]=b.[单位名称]\n  where 预算年度 in ($预算年度$)\n  and 预算单位编码 like  '$单位编码$%'\n  and 行政区划代码=(select min(行政区划代码)   from czcw_gh.dbo.基础表_预算单位)\n",
            "isEnable": 1,
            "sort": 14,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询预算单位向社团转拨资金的情况，重点审查是否有实际业务发生。",
            "params": [{
              "id": 156,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 157,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 236,
            "type": "method",
            "title": "15 向本部门实拨资金账户转款",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [编号],\n       [预算年度],\n       [交易凭证类型编码],\n       [交易凭证类型名称],\n       [业务科室编码],\n       [业务科室名称],\n       [预算单位编码],\n       [预算单位名称],\n       [预算科目编码],\n       [预算科目名称],\n       [项目分类编码],\n       [项目分类名称],\n       [资金性质编码],\n       [资金性质名称],\n       [预算项目编码],\n       [预算项目名称],\n       [指标特性编码],\n       [指标特性名称],\n       [指标来源编码],\n       [指标来源名称],\n       [指标文件编号],\n       [指标文件名称],\n       [支付方式编码],\n       [支付方式名称],\n       [预算类型编码],\n       [预算类型名称],\n       [支出经济项目分类编码],\n       [支出经济项目分类名称],\n       [支付金额],\n       [摘要],\n       [支付时间],\n       [清算时间],\n       [结算方式],\n       [供应商名称],\n       [银行账号],\n       [开户银行],\n       [付款账号],\n       [付款帐户],\n       [付款银行],\n       [生成人],\n       [生成时间],\n       [来源计划额度ID],\n       [行政区划代码]\nFROM   czcw_gh.dbo.[基础表_支付凭证表]\nwhere 行政区划代码=(select MIN(行政区划代码) from czcw_gh.dbo.基础表_预算单位)\n  and 预算年度 in ($预算年度$)  --\n  and 预算单位名称 like '$单位编码$%'\n  and 供应商名称=预算单位名称\n  and left(支出经济项目分类编码,3) not in ('301','303')\n  and left(项目分类编码,6) not in ('001001','001003')\n  and 结算方式 like '%转账%'",
            "isEnable": 1,
            "sort": 15,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询预算单位零余额账户资金转拨到基本户的情况，审查是否存在资金脱离财政监管的情况。",
            "params": [{
              "id": 158,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 159,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 237,
            "type": "method",
            "title": "16 未通过转移支付直接向下级财政专户拨付经费",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [编号],\n       [预算年度],\n       [交易凭证类型编码],\n       [交易凭证类型名称],\n       [业务科室编码],\n       [业务科室名称],\n       [预算单位编码],\n       [预算单位名称],\n       [预算科目编码],\n       [预算科目名称],\n       [项目分类编码],\n       [项目分类名称],\n       [资金性质编码],\n       [资金性质名称],\n       [预算项目编码],\n       [预算项目名称],\n       [指标特性编码],\n       [指标特性名称],\n       [指标来源编码],\n       [指标来源名称],\n       [指标文件编号],\n       [指标文件名称],\n       [支付方式编码],\n       [支付方式名称],\n       [预算类型编码],\n       [预算类型名称],\n       [支出经济项目分类编码],\n       [支出经济项目分类名称],\n       [支付金额],\n       [摘要],\n       [支付时间],\n       [清算时间],\n       [结算方式],\n       [供应商名称],\n       [银行账号],\n       [开户银行],\n       [付款账号],\n       [付款帐户],\n       [付款银行],\n       [生成人],\n       [生成时间],\n       [来源计划额度ID],\n       [行政区划代码]\n  FROM czcw_gh.dbo.[基础表_支付凭证表]\n  where ([供应商名称] like '%财政局%' or [供应商名称] like '%财政所%')\n  and 行政区划代码=(select MIN(行政区划代码) from czcw_gh.dbo.基础表_预算单位)\n  and 预算单位编码 not like '999%'\n  and 预算年度 in ($预算年度$) \n  and 预算单位编码 like '$单位编码$%'\norder by 预算单位编码\n",
            "isEnable": 1,
            "sort": 16,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询未通过转移支付直接向下级财政专户拨付经费的情况，需延伸审计资金性质和业务情况。",
            "params": [{
              "id": 160,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 161,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }]
        }, {
          "id": 21,
          "type": "issues",
          "title": "中央八项规定精神和国务院“约法三章”要求的落实情况",
          "description": "中央八项规定精神和国务院“约法三章”要求的落实情况",
          "isDefault": 1,
          "isEnable": 1,
          "sort": 5,
          "children": [{
            "id": 238,
            "type": "method",
            "title": "01 三公经费和会议费数据分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "select\n t.预算年度,t.预算单位编码,t.预算单位名称\n,sum(t.公务用车运行维护) as 公务用车运行维护\n,sum(t.公务接待费) as 公务接待费\n,sum(t.[因公出国（境）费]) as [因公出国（境）费]\n,sum(t.会议费) as 会议费\n,sum(t.公务用车运行维护)+sum(t.公务接待费)+sum(t.[因公出国（境）费])+sum(t.会议费) as 三公经费总额\nfrom\n(\n  select 预算年度,预算单位编码,预算单位名称\n     ,SUM(支付金额) as 公务用车运行维护  \n      ,0 as 公务接待费\n      ,0 as[因公出国（境）费]  \n     ,0 as 会议费\n  from czcw_gh.dbo.基础表_支付凭证表\n  where 支出经济项目分类编码 in ('30231','30242')\n  and 预算单位编码 like '$单位编码$%'\n        and 预算年度 in ($预算年度$)\n  and 行政区划代码=(select min(行政区划代码) from czcw_gh.dbo.基础表_预算单位)\n  group by  预算年度,预算单位编码,预算单位名称\nunion all\n  select 预算年度,预算单位编码,预算单位名称\n     ,0 as 公务用车运行维护\n     ,SUM(支付金额) as 公务接待费  \n     ,0 as[因公出国（境）费]  \n     ,0 as 会议费\n  from czcw_gh.dbo.基础表_支付凭证表\n  where 支出经济项目分类编码='30217'\n  and 预算单位编码 like '$单位编码$%'\n        and 预算年度 in ($预算年度$)  \n  and 行政区划代码=(select min(行政区划代码) from czcw_gh.dbo.基础表_预算单位)\n  group by  预算年度,预算单位编码,预算单位名称\nunion all\n  select 预算年度,预算单位编码,预算单位名称\n     ,0 as 公务用车运行维护\n     ,0  as 公务接待费  \n     ,SUM(支付金额) as [因公出国（境）费]\n     ,0 as 会议费\n  from czcw_gh.dbo.基础表_支付凭证表\n  where 支出经济项目分类编码='30212'\n  and 预算单位编码 like '$单位编码$%'\n        and 预算年度 in ($预算年度$)\n  and 预算单位名称 is not null\n  and 行政区划代码=(select min(行政区划代码) from czcw_gh.dbo.基础表_预算单位)\n  group by  预算年度,预算单位编码,预算单位名称\nunion all\n select 预算年度,预算单位编码,预算单位名称\n    ,0 as 公务用车运行维护\n    ,0 as 公务接待费  \n    ,0 as [因公出国（境）费]\n    ,SUM(支付金额) as 会议费  \n from czcw_gh.dbo.基础表_支付凭证表\n where 支出经济项目分类编码='30215'\n and 预算单位编码 like '$单位编码$%'\n and 预算年度 in ($预算年度$)\n and 预算单位名称 is not null\n and 行政区划代码=(select min(行政区划代码) from czcw_gh.dbo.基础表_预算单位)\n group by  预算年度,预算单位编码,预算单位名称\n) t\ngroup by  预算年度,预算单位编码,预算单位名称\n\n",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "通过国库集中支付凭证表，统计预算单位三公经费和会议费的财政支付情况",
            "params": [{
              "id": 162,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 163,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 239,
            "type": "method",
            "title": "02 三公经费凭证分录明细",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [会计电子账簿编号],\n       [会计电子账簿名称],\n       [会计年度],\n       convert(int,会计月份) as 会计月份,\n       [记账凭证日期],\n       [记账凭证种类],\n       [记账凭证编号],\n       [会计科目编号],\n       [会计科目名称],\n       [科目全称],\n       [记账凭证摘要],\n       [借方发生额],\n       [贷方发生额],\n       [辅助类型],\n       [辅助编码],\n       [辅助名称],\n       [三公经费项目名称],\n       [记账凭证行号],\n       [行政区划代码]\nFROM   czcw_gh.dbo.[分析表_财务类_预算单位三公经费凭证分录明细]\nWHERE  Stuff(会计电子账簿编号,5,4,'') = '$会计核算账套$' \n       AND 会计年度 in ($预算年度$)\norder by 会计年度,会计月份,记账凭证编号",
            "isEnable": 1,
            "sort": 2,
            "methodType": "model",
            "autidType": "自动",
            "description": "从预算单位财务账中，查询“三公经费”的凭证分录信息。",
            "params": [{
              "id": 164,
              "name": "会计核算账套",
              "type": "string",
              "value": "10090281010001",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 165,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 240,
            "type": "method",
            "title": "03 三公经费多年趋势分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [会计电子账簿编号]\n      ,[会计电子账簿名称]\n      ,[会计年度] as 会计年度\n      ,三公经费项目名称\n      ,sum([借方发生额]-[贷方发生额]) as 支出金额\n  FROM czcw_gh.dbo.[分析表_财务类_预算单位三公经费凭证分录明细]\n  where stuff(会计电子账簿编号,5,4,'')=  '$会计核算账套$'  \n  and [会计年度] in ($预算年度$)\n  --and ? like '%'''+三公经费项目名称+'''%'\n  group by [会计电子账簿编号],[会计电子账簿名称],[会计年度],三公经费项目名称\n  order by 三公经费项目名称,会计年度\n\n ",
            "isEnable": 1,
            "sort": 3,
            "methodType": "model",
            "autidType": "自动",
            "description": "从预算单位财务账中，多年度对比分析某一预算单位三公经费的支出情况。对每年递增或者降幅不明显的进行重点审计。",
            "params": [{
              "id": 166,
              "name": "会计核算账套",
              "type": "string",
              "value": "10090281010001",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 167,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 241,
            "type": "method",
            "title": "04 三公经费占全年支出比例",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT Stuff(t1.会计电子账簿编号,5,4,'')  AS 账套编号,\n       t1.会计电子账簿名称,\n       t1.会计年度,\n       t2.三公经费项目名称,\n       Isnull(t1.支出总额,0)                                                                                                    AS 支出总额,\n       Isnull(t2.三公经费支出金额,0)                                                                                                    AS 三公经费支出金额,\n       Convert(DECIMAL(16,2),CASE WHEN Isnull(t1.支出总额,0)=0 THEN 0 ELSE Isnull(t2.三公经费支出金额,0)/Isnull(t1.支出总额,0)*100 END) AS 三公经费支出占比\nFROM   (SELECT a.会计电子账簿编号\n      ,b.[会计电子账簿名称]\n      ,a.会计年度 \n      ,sum(a.借方发生额-a.贷方发生额) as 支出总额\n  FROM czcw_gh.dbo.基础表_财务类_记账凭证表 a\nleft join czcw_gh.dbo.基础表_财务类_电子账簿信息表 b on a.[会计电子账簿编号]=b.[会计电子账簿编号] and a.行政区划代码=b.行政区划代码\nleft join czcw_gh.dbo.基础表_财务类_会计科目表 c on a.[会计电子账簿编号]=c.[会计电子账簿编号] and a.会计科目编号=c.会计科目编号 and a.行政区划代码=c.行政区划代码\nwhere   a.[会计电子账簿编号] like '1009%'  and a.会计科目编号 like '5%'\n and not exists (select 1 from czcw_gh.dbo.基础表_财务类_记账凭证表 q \n    where q.[会计电子账簿编号] like '1009%' and q.会计科目编号 like '3%' \n                  and (q.记账凭证摘要 like '%结转%'  or q.记账凭证摘要 like '%转结余%' or q.记账凭证摘要 like '%结账%' or q.记账凭证摘要 like '%结帐%')\n                  and q.[会计电子账簿编号]=a.[会计电子账簿编号] and q.会计月份=a.会计月份 \n                  and q.记账凭证编号=a.记账凭证编号  and q.行政区划代码=a.行政区划代码)\n        GROUP BY a.会计电子账簿编号,\n                 b.[会计电子账簿名称],\n                 a.会计年度) t1\n       LEFT JOIN (SELECT 会计电子账簿编号,会计电子账簿名称,会计年度,三公经费项目名称,Sum(借方发生额-贷方发生额) AS 三公经费支出金额 \n                 FROM czcw_gh.dbo.分析表_财务类_预算单位三公经费凭证分录明细 \n                 GROUP BY 会计电子账簿编号,会计电子账簿名称,会计年度,三公经费项目名称) t2\n       ON t1.会计电子账簿编号=t2.会计电子账簿编号 AND t1.会计年度=t2.会计年度\nWHERE  t2.三公经费支出金额 IS NOT NULL\n       AND Stuff(t1.会计电子账簿编号,5,4,'')= '$会计核算账套$' \n       AND t1.会计年度 in ($预算年度$)\n",
            "isEnable": 1,
            "sort": 4,
            "methodType": "model",
            "autidType": "自动",
            "description": "从预算单位财务账中，统计某一预算单位“三公经费”占全年支出的比例。",
            "params": [{
              "id": 168,
              "name": "会计核算账套",
              "type": "string",
              "value": "10090281010001",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 169,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 242,
            "type": "method",
            "title": "05 三公经费支出超预算",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT a.年度,\r\n       a.单位代码,\r\n       a.单位名称,\r\n       a.经济科目代码,\r\n       a.经济科目名称,\r\n       a.支出预算金额,\r\n       isnull(d.支付金额,0) as 支付金额,\r\n      a.支出预算金额-isnull(d.支付金额,0) as 差额\r\nFROM   (SELECT   年度,\r\n                 单位代码,\r\n                 单位名称,\r\n                 case when 经济科目代码='30242' then '30231' else 经济科目代码 end as 经济科目代码,\r\n                 case when 经济科目代码 in ('30231','30242') then '公务用车运行维护费' else 经济科目名称 end as 经济科目名称,\r\n                 Sum(总计) * 10000 AS 支出预算金额\r\n        FROM     czcw_gh.dbo.基础表_部门预算_支出预算表 a\r\n        WHERE    a.经济科目代码 in ('30217','30212','30231','30242')\r\n                 AND a.总计 <> 0\r\n        GROUP BY 年度,\r\n                 单位代码,\r\n                 单位名称,\r\n                 case when 经济科目代码='30242' then '30231' else 经济科目代码 end,\r\n                 case when 经济科目代码 in ('30231','30242') then '公务用车运行维护费' else 经济科目名称 end\r\n                 ) a\r\n       LEFT JOIN (SELECT \r\n                   预算年度,\r\n                   预算单位编码,\r\n                   预算单位名称,\r\n                   支出经济项目分类编码 as     经济科目代码,\r\n                   支出经济项目分类名称 as     经济科目名称,\r\n                   Sum(支付金额) AS 支付金额 \r\n                  FROM czcw_gh.dbo.基础表_支付凭证表\r\n                  WHERE 行政区划代码=(SELECT Min(行政区划代码) FROM czcw_gh.dbo.基础表_预算单位) \r\n                  AND 预算单位编码  like '$单位编码$%'\r\n                  AND 预算单位名称 IS NOT NULL \r\n                  and 支出经济项目分类编码 in ('30217','30212','30231')\r\n                  and 交易凭证类型名称<>'年终结转'\r\n                 \r\n                  GROUP BY \r\n                  预算年度,预算单位编码,预算单位名称,\r\n                  支出经济项目分类编码,支出经济项目分类名称) d\r\n       ON a.单位代码=d.预算单位编码 AND a.年度=d.预算年度 and a.经济科目代码=d.经济科目代码\r\nWHERE  a.年度 in( $预算年度$ )\r\n  and isnull(d.支付金额,0)>a.支出预算金额\r\n       AND a.单位代码  like '$单位编码$%'",
            "isEnable": 1,
            "sort": 5,
            "methodType": "model",
            "autidType": "自动",
            "description": "对比某单位“三公经费”预算编制情况和财务实际核算情况，若差异较大，则可能存在无预算列支三公经费的问题。反映了三公经费实际支出超出年初预算的问题，审计组需要向被审计单位进行核实。",
            "params": [{
              "id": 193,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 1,
              "style": "text"
            }, {
              "id": 194,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }]
          }, {
            "id": 243,
            "type": "method",
            "title": "06 公务接待费支出不规范",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT a.[会计电子账簿编号],\n       a.[会计电子账簿名称],\n       a.[会计科目编号],\n       a.[会计科目名称],\n       科目全称,\n       [记账凭证摘要],\n       Convert(CHAR(8),[记账凭证日期],112) AS [记账凭证日期],\n       [借方发生额],\n       [贷方发生额],\n       [记账凭证种类],\n       [记账凭证编号],\n       [附件数],\n       a.[会计年度],\n       [会计月份],\n       [财务主管],\n       [记账人员],\n       [出纳人员],\n       [审核人员],\n       [制单人员],\n       [源凭证号],\n       a.[行政区划代码]\nFROM   czcw_gh.dbo.[基础表_财务类_记账凭证表] a\njoin  czcw_gh.dbo.基础表_财务类_会计科目表 b \n on a.会计电子账簿编号=b.会计电子账簿编号 and a.行政区划代码=b.行政区划代码 and a.会计科目编号=b.会计科目编号\nWHERE  ([记账凭证摘要] LIKE '%招待费%'\n        OR [记账凭证摘要] LIKE '%接待费%')\n       AND Left(a.[会计电子账簿编号],4) = '1009'\n       AND Left(a.[会计电子账簿编号],11) <> '10092015800'\n       and left(a.会计科目编号,1)='5'\n       AND 科目全称 NOT LIKE '%待费%'\n       AND 借方发生额 > 0\n       AND a.[会计年度]  in ($预算年度$)\n       and Stuff(a.[会计电子账簿编号],5,4,'')= '$会计核算账套$' \n",
            "isEnable": 1,
            "sort": 6,
            "methodType": "model",
            "autidType": "自动",
            "description": "将实际发生的“公务接待费”在其他科目反映，重点关注在会议费、误餐费科目下，列支招待费、接待费的情况。",
            "params": [{
              "id": 170,
              "name": "会计核算账套",
              "type": "string",
              "value": "10090281010001",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 171,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 244,
            "type": "method",
            "title": "07 车辆运行费列入差旅费",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT a.[会计电子账簿编号],\n       a.[会计电子账簿名称],\n       a.[会计科目编号],\n       a.[会计科目名称],\n       科目全称,\n       [记账凭证摘要],\n       Convert(CHAR(8),[记账凭证日期],112) AS [记账凭证日期],\n       [借方发生额],\n       [贷方发生额],\n       [记账凭证种类],\n       [记账凭证编号],\n       [附件数],\n       a.[会计年度],\n       [会计月份],\n       [财务主管],\n       [记账人员],\n       [出纳人员],\n       [审核人员],\n       [制单人员],\n       [源凭证号],\n       a.[行政区划代码]\nFROM   czcw_gh.dbo.[基础表_财务类_记账凭证表] a\njoin  czcw_gh.dbo.基础表_财务类_会计科目表 b \n on a.会计电子账簿编号=b.会计电子账簿编号 and a.行政区划代码=b.行政区划代码 and a.会计科目编号=b.会计科目编号\nWHERE  [记账凭证摘要] LIKE '%车辆运行%'\n       AND Left(a.[会计电子账簿编号],4) = '1009'\n       AND Left(a.[会计电子账簿编号],11) <> '10092015800'\n       AND 科目全称 LIKE '%差旅%' \n       AND 借方发生额 > 0\n       AND a.[会计年度] IN ($预算年度$)\r\n       AND Stuff(a.[会计电子账簿编号],5,4,'')= '$会计核算账套$'\n",
            "isEnable": 1,
            "sort": 7,
            "methodType": "model",
            "autidType": "自动",
            "description": "根据摘要分析将车辆运行费列入差旅费的情况。",
            "params": [{
              "id": 172,
              "name": "会计核算账套",
              "type": "string",
              "value": "10090281010001",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 173,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }]
        }, {
          "id": 14,
          "type": "issues",
          "title": "非税收入征缴情况",
          "description": "非税收入征缴情况",
          "isDefault": 1,
          "isEnable": 1,
          "sort": 6,
          "children": [{
            "id": 245,
            "type": "method",
            "title": "01 部门非税收入增长情况分析",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [年度],\n       [执收单位编码],\n       [执收单位名称],\n       [收费项目编码],\n       [收费项目名称],\n       [上年收入金额],\n       [本年收入金额],\n       [比上年增长金额],\n       [比上年增长比例]\nFROM   czcw_gh.dbo.[分析表_模型_部门预算执行_部门非税收入增长情况分析]\nwhere 执收单位编码 like '$单位编码$%'\n and [年度]  in ($预算年度$)\norder by 执收单位编码,收费项目编码,年度",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "对比分析各预算单位多年非税收入增长情况。",
            "params": [{
              "id": 174,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 175,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 246,
            "type": "method",
            "title": "02 违反规定设立非税收入项目",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 2,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。设立和征收非税收入，应当依据法律、法规的规定或者按照主管部门的规定设立和征收。具体参考《政府非税收入管理办法》。",
            "params": []
          }, {
            "id": 247,
            "type": "method",
            "title": "03 预算单位有收费项目没有实际收入",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT a.*,c.管理方式代码,c.管理方式名称\r\n      ,isnull(b.金额,0) as 收费金额\r\nFROM [czcw_gh].[dbo].[基础表_非税_执收单位收费项目表] a\r\nleft join (select left(开票日期,4) as 年度,执收单位编码,执收单位名称\r\n           ,收费项目编码,收费项目名称,sum(金额) as  金额\r\n           from  czcw_gh.dbo.基础表_非税_非税收入明细\r\n           group by left(开票日期,4),执收单位编码,执收单位名称\r\n           ,收费项目编码,收费项目名称\r\n           having left(开票日期,4)in ($预算年度$)   ) b \r\n      on a.执收单位编码=b.执收单位编码 and a.收费项目编码=b.收费项目编码\r\nleft join (select distinct 收费项目编码,管理方式代码,管理方式名称 \r\n\t\t\tfrom  czcw_gh.dbo.基础表_非税_收费项目表) c\r\n  on a.收费项目编码=c.收费项目编码\r\nwhere isnull(b.金额,0)=0 \r\n  and a.执收单位编码 like '$单位编码$%'\r\n  and c.管理方式代码 in ('001','002')\r\n  and a.收费项目名称 not like '%国有资%%' \r\n  and a.终止时间 is null\r\norder by a.执收单位编码,a.收费项目编码",
            "isEnable": 1,
            "sort": 3,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询省财政、省发改委对预算单位审批有收费项目，但非税系统里并没有显示实际的征收信息。",
            "params": [{
              "id": 203,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 1,
              "style": "text"
            }, {
              "id": 204,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }]
          }, {
            "id": 248,
            "type": "method",
            "title": "04 预算单位有票据领用没有实际收入",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT a.*,isnull(b.金额,0) as 收费金额  \r\nFROM czcw_gh.dbo.[基础表_非税_购领出库单发售明细信息] a  \r\nleft join (select left(开票日期,4) as 年度,执收单位编码,执收单位名称 ,收费项目编码,收费项目名称,sum(金额) as  金额             \r\nfrom  czcw_gh.dbo.基础表_非税_非税收入明细             \r\n\tgroup by left(开票日期,4),执收单位编码,执收单位名称  ,收费项目编码,收费项目名称            \r\n\thaving left(开票日期,4)  in ($预算年度$)   ) b         \r\non a.[购领单位编码]=b.执收单位编码 --and a.收费项目编码=b.收费项目编码  \r\nwhere isnull(b.金额,0)=0    and a.[购领单位编码] like '$单位编码$%'    \r\n\tand (a.[票据名称] like '%行政事业%费%'       or a.[票据名称] like '%罚%')    \r\n\tand a.发放类型='执收单位'  \r\n\tand 行政区划代码='410000'\r\norder by a.[购领单位编码]\r\n",
            "isEnable": 1,
            "sort": 4,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询省财政对预算单位发放了有关行政事业性收费或基金票据，但非税系统里并没有显示实际的征收信息。",
            "params": [{
              "id": 205,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 1,
              "style": "text"
            }, {
              "id": 206,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }]
          }]
        }, {
          "id": 20,
          "type": "issues",
          "title": "政府采购",
          "description": "政府采购",
          "isDefault": 1,
          "isEnable": 1,
          "sort": 7,
          "children": [{
            "id": 249,
            "type": "method",
            "title": "01 化整为零规避政府采购",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   [预算年度],\r\n         Substring(支付时间,5,2) AS 月份,\r\n         [预算单位编码],\r\n         [预算单位名称],\r\n         [供应商名称],\r\n         Sum([支付金额])         AS [支付金额],\r\n         Count(1)            AS 笔数,\r\n         行政区划代码\r\nFROM     czcw_gh.dbo.[基础表_支付凭证表]\r\nwhere   行政区划代码 = (SELECT Min(行政区划代码) FROM   czcw_gh.dbo.基础表_预算单位)\r\n  AND [预算年度] in ($预算年度$) -- $预算年度$\r\n  AND 预算单位编码 like '$单位编码$%'\r\nGROUP BY [预算年度],\r\n         [预算单位编码],\r\n         [预算单位名称],\r\n         Substring(支付时间,5,2),\r\n         [供应商名称],\r\n         行政区划代码 HAVING Sum([支付金额])%10000 = 0\r\n                       AND Sum([支付金额]) <> 0\r\n                       AND Count(1) > 1\r\n                      \r\n\r\n",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "审查有无违反集中采购目录、采购限额标准和采购方式规定，采取化整为零等方式规避政府采购的问题。筛选单月支付给同一供应商多笔，且合计金额能被1万整除的疑点，可能存在化整为零躲避政府采购的问题。",
            "params": [{
              "id": 213,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 214,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 250,
            "type": "method",
            "title": "02 政府采购程序不合规",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 2,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。如，审查单一来源采购项目是否按照规定报批，协议供货和网上竞价是否规范等问题。",
            "params": []
          }, {
            "id": 251,
            "type": "method",
            "title": "03 政府采购涉嫌围标、串标",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 3,
            "methodType": "model",
            "autidType": "人工",
            "description": "手工与计算机审计结合，可采用三种方式。<br/><br/>一、完善参与投标公司的代理人姓名和身份证号码信息，将该信息与企业养老保险信息进行比对，查询是否存在多个公司的投标代理人在同一企业缴纳养老保险的情况。<br/><br/>二、从工商登记信息中查询参与投标公司的投资人信息，比对分析是否存在同一人是多家投标公司股东的情况。<br/><br/>三、要求被审计单位提供投标公司的电子投标文件，利用word的“审阅”——“比较”功能，对多公司的投标书进行相似度分析，重点关注实质性内容重复，如施工方案、技术方案、投标参数、运维保障方案、服务承诺等。",
            "params": []
          }, {
            "id": 252,
            "type": "method",
            "title": "04 擅自变更中标结果、随意追加合同",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 4,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。",
            "params": []
          }]
        }, {
          "id": 16,
          "type": "issues",
          "title": "决算草案审计",
          "description": "决算草案审计",
          "isDefault": 1,
          "isEnable": 1,
          "sort": 8,
          "children": [{
            "id": 253,
            "type": "method",
            "title": "01 部门决算收支编报的完整性",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。审查决算报表编报范围是否涵盖了所有应报送决算的单位，编制内容是否完整反映了经济事项和会计记录；部门是否按规定汇总所属单位的决算，是否存在部门与所属单位未剔除重复项目导致重复列报财政收支的现象；是否存在将应计入收支的资金，在往来账核算，造成决算收支不够真实完整的问题。<br/>",
            "params": []
          }, {
            "id": 254,
            "type": "method",
            "title": "02 部门决算收支编报的真实性",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 2,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。审查是否存在由于部门预算执行不严格、不规范，以及挤占挪用、虚列支出等人为调整决算支出造成决算支出数据不真实的情况。年度预算收支、往来款项、各项财产物资、各类资产等是否进行及时、全面清理，做到账实相符，据实编入部门决算。<br/>",
            "params": []
          }, {
            "id": 255,
            "type": "method",
            "title": "03 部门预决算公开情况",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 3,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。关注部门预决算公开的时间、内容、载体、细化程度是否符合相关规定，决算公开的数据是否存在人为修改、账表不符等问题。",
            "params": []
          }]
        }, {
          "id": 19,
          "type": "issues",
          "title": "账务综合分析 ",
          "description": "账务综合分析 ",
          "isDefault": 1,
          "isEnable": 1,
          "sort": 9,
          "children": [{
            "id": 256,
            "type": "method",
            "title": "01 部门反方向发生额凭证分录查询",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   b.会计核算单位,         a.[会计电子账簿编号],\n         b.[会计电子账簿名称],\n         a.[会计年度],\n         [会计月份],\n         [记账凭证编号],\n         Convert(VARCHAR(8),[记账凭证日期],112) AS [记账凭证日期],\n         a.[会计科目编号],\n         c.科目全称,\n         [记账凭证摘要],\n         [借方发生额],\n         [贷方发生额],\n         [附件数],\n         [记账凭证行号]\nFROM     czcw_gh.dbo.[基础表_财务类_记账凭证表] a\nLEFT JOIN czcw_gh.dbo.基础表_财务类_电子账簿信息表 b  ON a.行政区划代码=b.行政区划代码 and a.会计电子账簿编号=b.会计电子账簿编号 AND a.会计年度=b.会计年度\nleft join  czcw_gh.dbo.基础表_财务类_会计科目表 c on a.行政区划代码=c.行政区划代码 and a.会计电子账簿编号=c.会计电子账簿编号 AND a.会计年度=c.会计年度 and a.会计科目编号=c.会计科目编号\nWHERE    LEFT(a.会计电子账簿编号,4)='1009'\n         and  a.会计年度 in ($预算年度$)        \n         and Stuff(a.[会计电子账簿编号],5,4,'')= '$会计核算账套$'\n         \n         AND (c.余额方向=1 and a.借方发生额=0 and a.贷方发生额<>0\n          or c.余额方向=-1 and a.借方发生额<>0 and a.贷方发生额=0)\n         and (LEFT(a.会计科目编号,1)='4' and a.借方发生额<>0 and a.贷方发生额=0\n           or LEFT(a.会计科目编号,1)='5' and a.借方发生额=0 and a.贷方发生额<>0)\n         and LEFT(a.会计科目编号,1) not in ('1','2')\n         and 记账凭证摘要 NOT LIKE '%转%'\n         AND 记账凭证摘要 NOT LIKE '%期末%'\n         AND 记账凭证摘要 NOT LIKE '%结转%'\n         AND 记账凭证摘要 NOT LIKE '%结账%'\n         AND 记账凭证摘要 NOT LIKE '%结帐%'\n         AND 记账凭证摘要 NOT LIKE '%转结余%'\nORDER BY a.[会计电子账簿编号],\n         Convert(INT,a.[会计月份]),\n         a.[记账凭证行号]\n",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "筛选收入、支出、结余科目发生额与正常的发生额方向相反的凭证分录，并进行分析。",
            "params": [{
              "id": 176,
              "name": "会计核算账套",
              "type": "string",
              "value": "10090281010001",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 177,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 257,
            "type": "method",
            "title": "02 部门凭证分录负值查询",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   b.会计核算单位,\n         b.[会计电子账簿编号],\n         b.会计电子账簿名称,\n         a.[会计年度],\n         a.[会计月份],\n         Convert(CHAR(8),[记账凭证日期],112) AS 记账凭证日期,\n         [记账凭证编号],\n         a.[记账凭证摘要],\n         a.[会计科目编号],\n         c.科目全称,\n         [借方发生额],\n         [贷方发生额],\n         [附件数],\n         [记账凭证行号]\nFROM     czcw_gh.dbo.基础表_财务类_记账凭证表 a\n         JOIN czcw_gh.dbo.基础表_财务类_电子账簿信息表 b\n         ON a.行政区划代码=b.行政区划代码 AND a.会计电子账簿编号=b.会计电子账簿编号 AND a.会计年度=b.会计年度\n         LEFT JOIN czcw_gh.dbo.基础表_财务类_会计科目表 c\n         ON a.行政区划代码=c.行政区划代码 AND a.会计电子账簿编号=c.会计电子账簿编号 AND a.会计科目编号=c.会计科目编号\nWHERE    Left(a.会计电子账簿编号,4) = '1009'\n         AND a.会计年度 in ($预算年度$)\n         and Stuff(a.[会计电子账簿编号],5,4,'')= '$会计核算账套$'\n              \n         AND (a.借方发生额 < 0\n              OR a.贷方发生额 < 0)\nORDER BY a.会计电子账簿编号,\n         Convert(INT,a.[会计月份]),\n         a.[记账凭证行号]\n",
            "isEnable": 1,
            "sort": 2,
            "methodType": "model",
            "autidType": "自动",
            "description": "筛选记账凭证借方或贷方发生额是负数的凭证分录，并进行分析。",
            "params": [{
              "id": 178,
              "name": "会计核算账套",
              "type": "string",
              "value": "10090281010001",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 179,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 258,
            "type": "method",
            "title": "03 大额购买支出未入固定资产",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   b.会计核算单位,\n         a.[会计电子账簿编号],\n         b.[会计电子账簿名称],\n         a.[会计年度],\n         [会计月份],\n         [记账凭证编号],\n         Convert(VARCHAR(8),[记账凭证日期],112) AS [记账凭证日期],\n         a.[会计科目编号],\n         c.科目全称,\n         [记账凭证摘要],\n         [借方发生额],\n         [贷方发生额],\n         [附件数],\n         [记账凭证行号]\nFROM     czcw_gh.dbo.基础表_财务类_记账凭证表 a\n         JOIN czcw_gh.dbo.基础表_财务类_电子账簿信息表 b\n         ON a.[行政区划代码]=b.[行政区划代码] AND a.[会计电子账簿编号]=b.[会计电子账簿编号]\n         JOIN czcw_gh.dbo.基础表_财务类_会计科目表 c\n         ON a.[行政区划代码]=c.[行政区划代码] AND a.[会计电子账簿编号]=c.[会计电子账簿编号] AND a.会计科目编号=c.会计科目编号\nWHERE    Left(a.[会计电子账簿编号],4) = '1009'\n         and stuff(a.[会计电子账簿编号],5,4,'')= '$会计核算账套$'\n         AND b.账套类别 IN ('行政','事业','学校')\n         AND a.记账凭证摘要 LIKE '购%'\n         AND a.记账凭证摘要 NOT LIKE '%书%'\n         AND a.记账凭证摘要 NOT LIKE '%耗材%'\n         AND a.记账凭证摘要 NOT LIKE '%酒%'\n         AND a.记账凭证摘要 NOT LIKE '%卡%'\n         AND a.记账凭证摘要 NOT LIKE '%油%'\n         AND a.记账凭证摘要 NOT LIKE '%办公用品%'\n         AND a.记账凭证摘要 NOT LIKE '%票%'\n         AND a.借方发生额 > $金额下限$\n         AND a.会计科目编号 NOT LIKE '1%'\n         AND c.科目全称 NOT LIKE '固定资产%'\n         AND NOT EXISTS(SELECT 1 FROM \n   czcw_gh.dbo.基础表_财务类_记账凭证表 t \n   JOIN czcw_gh.dbo.基础表_财务类_会计科目表 x \n   ON t.[行政区划代码]=x.[行政区划代码] AND t.[会计电子账簿编号]=x.[会计电子账簿编号] AND t.会计科目编号=x.会计科目编号 \n   WHERE \n\n    a.[行政区划代码]=t.[行政区划代码] AND a.[会计电子账簿编号]=t.[会计电子账簿编号] \n    AND a.会计年度=t.会计年度 AND t.会计科目编号 LIKE '1%' \n    AND x.科目全称 LIKE '固定资产%' AND a.借方发生额=t.借方发生额\n   )\n         AND a.会计年度 in ($预算年度$)\nORDER BY b.会计核算单位,\n         a.[会计电子账簿编号],\n         Cast(会计月份 AS INT),\n         记账凭证编号\n",
            "isEnable": 1,
            "sort": 3,
            "methodType": "model",
            "autidType": "自动",
            "description": "筛选金额较大、未登记固定资产科目的购买支出，审查是否是未入账的固定资产。",
            "params": [{
              "id": 180,
              "name": "会计核算账套",
              "type": "string",
              "value": "10090281010001",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 181,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }, {
              "id": 182,
              "name": "金额下限",
              "type": "string",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 259,
            "type": "method",
            "title": "04 应收款项账龄分析",
            "selected": 0,
            "accord": "定性依据",
            "methodCode": "SELECT [会计核算单位],\r\n       [账套编号],\r\n       [会计电子账簿名称],\r\n       [账套类别],\r\n       [截止年度],\r\n       [会计科目编号],\r\n       [科目全称],\r\n       [年末余额],\r\n       [一年以内],\r\n       [一至三年],\r\n       [三年以上]\r\nFROM   czcw_gh.dbo.[分析表_模型_部门预算执行_应收款项账龄分析]\r\nwhere 截止年度 in ($预算年度$)\r\n \r\nand 账套编号= '$会计核算账套$'\r\n\r\norder by 账套编号,截止年度,会计科目编号\r\n",
            "isEnable": 1,
            "sort": 4,
            "methodType": "model",
            "autidType": "自动",
            "description": "分析应收账款的账龄，重点关注连年结转且金额较大的应收账款。",
            "params": [{
              "id": 264,
              "name": "会计核算账套",
              "type": "string",
              "value": "10090281010001",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 265,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 260,
            "type": "method",
            "title": "05 财政改革制度推进情况",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 5,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。关注国库集中收付、非税收入征管、公务卡结算、国有资产管理使用和执行工程招投标和政府采购制度等情况，促进预算单位财务管理更加规范。",
            "params": []
          }, {
            "id": 265,
            "type": "method",
            "title": "06 应付款项账龄分析 ",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT [会计核算单位],        [账套编号],        [会计电子账簿名称],        [账套类别],        [截止年度],        [会计科目编号],        [科目全称],        [年末余额],        [一年以内],        [一至三年],        [三年以上] \r\nFROM   czcw_gh.dbo.[分析表_模型_部门预算执行_应付款项账龄分析] \r\nwhere 截止年度 in ($预算年度$)   \r\n\tand 账套编号= '$会计核算账套$'  \r\norder by 账套编号,截止年度,会计科目编号 ",
            "isEnable": 1,
            "sort": 6,
            "methodType": "model",
            "autidType": "自动",
            "description": "分析应付账款的账龄，重点关注连年结转且金额较大的应付账款。",
            "params": [{
              "id": 215,
              "name": "会计核算账套",
              "type": "string",
              "value": "10090281010001",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 216,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }]
        }, {
          "id": 12,
          "type": "issues",
          "title": "部门相关的行业协会和学会合规运行情况",
          "description": "部门相关的行业协会和学会合规运行情况",
          "isDefault": 1,
          "isEnable": 1,
          "sort": 10,
          "children": [{
            "id": 261,
            "type": "method",
            "title": "01 部门违规收取协会、学会的“赞助费”或“管理费”",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT   \n       [ID]\n      ,[会计科目编号]\n      ,[会计科目名称]\n      ,[记账凭证摘要]\n      ,[记账凭证日期]\n      ,[业务日期]\n      ,[借方发生额]\n      ,[贷方发生额]\n      ,[记账凭证种类]\n      ,[记账凭证编号]\n      ,[附件数]\n      ,a.[会计年度]\n      ,[会计月份]\n      ,[财务主管]\n      ,[记账人员]\n      ,[出纳人员]\n      ,[审核人员]\n      ,[制单人员]\n      ,[源凭证号]\n      ,[金额]\n      ,[备注]\n      ,[凭证类型编号]\n      ,[借方外币金额]\n      ,[贷方外币金额]\n      ,[币种代码]\n      ,[币种名称]\n      ,[汇率]\n      ,[是否外币凭证]\n      ,[选择]\n      ,[票据号]\n      ,[记账凭证行号]\n      ,[记账标志]\n      ,a.[会计电子账簿编号]\n      ,[乡镇代码]\n      ,[AO单位代码]\n      ,[源数据包名称]\n      ,[年度]\n      ,a.[会计电子账簿名称] \n      ,[行政区划代码]\n      ,[对方科目名称]\n      ,[对方科目编码]\n      ,b.会计核算单位\n      ,b.单位代码\n  FROM  [czcw_gh].[dbo].[基础表_财务类_记账凭证表] a\n inner join (\n  select 单位代码,会计年度,会计电子账簿编号,会计电子账簿名称,会计核算单位 \n  FROM  [czcw_gh].[dbo].[基础表_财务类_电子账簿信息表]  \n  where 单位代码 like  '$单位编码$%'\n  ) b \n  on a.会计电子账簿编号 =b.会计电子账簿编号 and a.会计年度=b.会计年度\n  where   a.会计年度 in ($预算年度$)\n  \n and 会计科目名称  not like '%物业%' and [记账凭证摘要]  not like '%物业%'  \n and (会计科目名称 like '%赞助费%' or 会计科目名称 like '%管理费%' \n or [记账凭证摘要] like '%赞助费%' or [记账凭证摘要] like '%管理费%' )",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "可以通过两种方式审计。<br/>一、查询代开发票中收款方纳税人名称为预算单位，付款方纳税人名称为协会、学会的信息，根据发票开具内容进行延伸审计。如果预算单位收取费用未入账，可延伸审计该单位是否私设“小金库”。<br/>二、在预算单位财务账中，通过会计科目或摘要查询是否有对协会、学会等收取的“赞助费”或“管理费”等。",
            "params": [{
              "id": 185,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 186,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 262,
            "type": "method",
            "title": "02 部门在协会、学会私设“小金库”和报销各类费用",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT  [编号]\n      ,[预算年度]\n      ,[交易凭证类型编码]\n      ,[交易凭证类型名称]\n      ,[业务科室编码]\n      ,[业务科室名称]\n      ,[预算单位编码]\n      ,[预算单位名称]\n      ,[预算科目编码]\n      ,[预算科目名称]\n      ,[项目分类编码]\n      ,[项目分类名称]\n      ,[资金性质编码]\n      ,[资金性质名称]\n      ,[预算项目编码]\n      ,[预算项目名称]\n      ,[指标特性编码]\n      ,[指标特性名称]\n      ,[指标来源编码]\n      ,[指标来源名称]\n      ,[指标文件编号]\n      ,[指标文件名称]\n      ,[支付方式编码]\n      ,[支付方式名称]\n      ,[预算类型编码]\n      ,[预算类型名称]\n      ,[支出经济项目分类编码]\n      ,[支出经济项目分类名称]\n      ,[支付金额]\n      ,[摘要]\n      ,[支付时间]\n      ,[清算时间]\n      ,[结算方式]\n      ,[供应商名称]\n      ,[银行账号]\n      ,[开户银行]\n      ,[付款账号]\n      ,[付款帐户]\n      ,[付款银行]\n      ,[生成人]\n      ,[生成时间]\n      ,[来源计划额度ID]\n      ,[行政区划代码]\n   \n  FROM [czcw_gh].[dbo].[基础表_支付凭证表]\n  where [预算单位编码] like  '$单位编码$%'\n    and [预算年度] in  ($预算年度$)\n  and [行政区划代码]='410000' \n  and [预算单位名称]<>[供应商名称]\n \n  and ([供应商名称] like '%协会%' or [供应商名称] like '%学会%')",
            "isEnable": 1,
            "sort": 2,
            "methodType": "model",
            "autidType": "自动",
            "description": "通过国库集中支付凭证表，查询预算单位向协会、协会拨付资金的情况，延伸资金的使用情况，重点关注是否形成“小金库”或者预算单位在协会、学会报销费用。",
            "params": [{
              "id": 187,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 188,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }, {
            "id": 263,
            "type": "method",
            "title": "03 部门工作人员违规兼职取酬",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "isEnable": 1,
            "sort": 3,
            "methodType": "model",
            "autidType": "人工",
            "description": "需要手工审计。审查预算单位下属部门或协会等的工资单或者补贴领取单据，关注预算单位本级人员领取工资或者补贴的记录。",
            "params": []
          }, {
            "id": 264,
            "type": "method",
            "title": "04 协会、学会等中介机构利用部门的影响力违规收费",
            "selected": 0,
            "accord": "定性依据",
            "externalDataSource": "",
            "innerDataSource": "",
            "methodCode": "SELECT distinct [通用发票uuid]\r\n      ,[代开申请uuid]\r\n      ,[土地税源编号]\r\n      ,[房源编号]\r\n      ,[付款方名称]\r\n      ,[付款方登记序号]\r\n      ,[付款方身份证件号码]\r\n      ,[付款方身份证件种类代码]\r\n      ,[付款方纳税人识别号]\r\n      ,[蓝字发票号码]\r\n      ,[蓝字发票代码]\r\n      ,[联系电话]\r\n      ,a.[地址]\r\n      ,[收款方名称]\r\n      ,[收款方纳税人识别号]\r\n      ,[录入人代码]\r\n      ,[录入日期]\r\n      ,[修改人代码]\r\n      ,[修改日期]\r\n      ,[数据归属地区]\r\n      ,[收款方身份证件类型代码]\r\n      ,[收款方身份证件号码]\r\n      ,[数据同步时间]\r\n      ,[通用发票货劳uuid]\r\n      ,[货物劳务名称]\r\n      ,[规格型号]\r\n      ,[单位数量代码]\r\n      ,[货劳数量]\r\n      ,[单价]\r\n      ,[金额]\r\n      ,[发票开具信息uuid]\r\n      ,[代开发票类别代码]\r\n      ,[代开发票类别名称]\r\n      ,[开具税务机关代码]\r\n      ,[开票人代码]\r\n      ,[开具日期]\r\n      ,[登记序号]\r\n      ,[纳税人识别号]\r\n      ,[纳税人名称]\r\n\t  ,b.业务主管部门 纳税人业务主管部门\r\n      ,[发票种类代码]\r\n      ,[发票代码]\r\n      ,[发票号码]\r\n      ,[开票金额]\r\n      ,[特殊纳税人登记序号]\r\n      ,[发票库房代码]\r\nFROM [229].[datactr].[dbo].[分析表_发票_代开通用机打发票] a\r\n,[qthy_gh].[dbo].基础表_民政_社团基本信息_合并后 b\r\n,[czcw_gh].[dbo].[基础表_预算单位] c\r\nwhere c.[行政区划代码]='410000'\r\nand c.预算单位编码 like '$单位编码$%'\r\nand c.预算年度 in ($预算年度$) \r\nand left(a.开具日期,4 ) in ($预算年度$) \r\n\r\nand b.单位名称 not like '%学校%' \r\nand b.单位名称 not like '%学院%'\r\nand a.纳税人名称=b.单位名称\r\nand c.预算单位名称 like '%'+b.业务主管部门+'%'\r\nand (货物劳务名称 like '%咨询%'\r\n or 货物劳务名称 like '%管理%'\r\n or 货物劳务名称 like '%委托%'\r\n or 货物劳务名称 like '%服务%'\r\n or 货物劳务名称 like '%中介%'\r\n or 货物劳务名称 like '%培训%'\r\n or 货物劳务名称 like '%会议%'\r\n ) ",
            "isEnable": 1,
            "sort": 4,
            "methodType": "model",
            "autidType": "自动",
            "description": "查询代开发票中收款方纳税人名称为协会、学会，发票内容为咨询费、管理费、委托费、服务费、中介费、培训费、会议费等的信息，延伸审计是否存在协会、学会等中介机构利用部门的影响力违规收费的问题。",
            "params": [{
              "id": 211,
              "name": "单位编码",
              "type": "string",
              "value": "028",
              "isNull": 0,
              "style": "pop"
            }, {
              "id": 212,
              "name": "预算年度",
              "type": "string",
              "value": "2016",
              "isNull": 0,
              "style": "text"
            }]
          }]
        }]
      }, {
        "id": 11,
        "type": "category",
        "title": "测试审计底稿",
        "description": "测试审计底稿",
        "isEnable": 1,
        "sort": 3,
        "children": [{
          "id": 28,
          "type": "issues",
          "title": "测试审计底稿",
          "description": "测试审计底稿",
          "isDefault": 1,
          "isEnable": 1,
          "sort": 1,
          "children": [{
            "id": 382,
            "type": "method",
            "title": "部门项目支出预算与执行差异分析",
            "selected": 0,
            "methodCode": "SELECT [预算年度]\r\n      ,[预算单位编码]\r\n      ,[预算单位名称]\r\n      ,[预算项目名称]\r\n      ,[指标来源编码]\r\n      ,[指标来源名称]\r\n      ,[项目分类名称]\r\n      ,[预算类型名称]\r\n      ,[可执行指标金额]\r\n      ,[支付金额]\r\n      ,[差额]\r\n      ,[预算执行率]\r\n  FROM [03 部门项目支出预算与执行差异分析]",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "部门项目支出预算与执行差异分析",
            "params": [{
              "id": 2268,
              "name": "审计年度",
              "type": "string",
              "value": "2016",
              "isNull": 1,
              "style": "text"
            }, {
              "id": 2269,
              "name": "预算年度",
              "type": "int",
              "value": "2017",
              "isNull": 1,
              "style": "text"
            }]
          }, {
            "id": 384,
            "type": "method",
            "title": "测试复制222",
            "selected": 0,
            "methodCode": "SELECT [预算年度]\r\n      ,[预算单位编码]\r\n      ,[预算单位名称]\r\n      ,[预算项目名称]\r\n      ,[指标来源编码]\r\n      ,[指标来源名称]\r\n      ,[项目分类名称]\r\n      ,[预算类型名称]\r\n      ,[可执行指标金额]\r\n      ,[支付金额]\r\n      ,[差额]\r\n      ,[预算执行率]\r\n  FROM [03 部门项目支出预算与执行差异分析]",
            "isEnable": 1,
            "sort": 1,
            "methodType": "model",
            "autidType": "自动",
            "description": "部门项目支出预算与执行差异分析",
            "params": [{
              "id": 1269,
              "name": "审计年度",
              "type": "string",
              "value": "2016",
              "isNull": 1,
              "style": "text"
            }]
          }]
        }]
      }]
    },
    loadCompanyList() {
      // 加载单位
      // this.companyListLoading = true
      // this.$http.get(urlStore.findMethods).then(res => {
      //   if (res.ok) {
      //     this.companyList = res.body.data
      //   }
      //   this.companyListLoading = false
      // }).catch(err => {
      //   this.companyListLoading = false
      // })
      this.companyList = [{
        "id": 1,
        "title": "安阳市工商局高新开发区分局",
        "params": [{
          "id": 1,
          "name": "p01",
          "type": "int",
          "value": "-99",
          "isNull": 1,
          "style": "pop"
        }, {
          "id": 2,
          "name": "p02",
          "type": "string",
          "value": "default Vales",
          "isNull": 1
        }],
        "externalDataSource": [
          "账户表"
        ]
      }, {
        "id": 2,
        "title": "濮阳市工商局开发区分局",
        "params": [{
          "id": 3,
          "name": "p03",
          "type": "int",
          "value": "-99",
          "isNull": 1
        }, {
          "id": 4,
          "name": "p04",
          "type": "boolean",
          "value": "0",
          "isNull": 1
        }],
        "externalDataSource": [
          "t2_ex1",
          "t2_ex2"
        ]
      }, {
        "id": 3,
        "title": "河南省财政厅农业综合开发资金专户",
        "params": [{
          "id": 13,
          "name": "p13",
          "type": "int",
          "value": "-99",
          "isNull": 1
        }, {
          "id": 14,
          "name": "p14",
          "type": "date",
          "value": "1900-01-01 00:00:00",
          "isNull": 0
        }],
        "externalDataSource": [
          "t7_ex1",
          "t7_ex2"
        ]
      }, {
        "id": 8,
        "title": "河南省农业综合开发公司",
        "params": [{
          "id": 15,
          "name": "p15",
          "type": "int",
          "value": "-99",
          "isNull": 1
        }, {
          "id": 16,
          "name": "p16",
          "type": "float",
          "value": "-99.99",
          "isNull": 0
        }],
        "externalDataSource": [
          "t8_ex1",
          "t8_ex2"
        ]
      }, {
        "id": 94,
        "title": "开封市工商局机关",
        "params": [{
          "id": 91,
          "name": "预算年度",
          "type": "string",
          "isNull": 1
        }, {
          "id": 92,
          "name": "单位编码",
          "type": "string",
          "isNull": 0
        }],
        "externalDataSource": [
          "s"
        ]
      }, {
        "id": 99,
        "title": "开封市经济检查支队",
        "params": [],
        "externalDataSource": [
          "临时表_人员信息"
        ]
      }, {
        "id": 100,
        "title": "开封市工商行政管理局经济技术开发区分局",
        "params": [],
        "externalDataSource": [
          "临时表_人员信息"
        ]
      }, {
        "id": 101,
        "title": "开封市工商局相国寺分局",
        "params": [],
        "externalDataSource": [
          "临时表_人员信息"
        ]
      }, {
        "id": 102,
        "title": "开封市工商局夜市分局",
        "params": [],
        "externalDataSource": [
          "临时表_人员信息"
        ]
      }]
    },
    handleChangeCollapse(activeNames){
      if(activeNames.length == 1){
        $(this.$el).find('.el-collapse').addClass('one')
      }else{
        $(this.$el).find('.el-collapse').removeClass('one')
      }
    },
    addMethod(data) {
      let filteredData = []
      data.forEach(item => {
        if(!this.selectedMethods.some(method => method.id == item.id)){
          filteredData.push(item)
        }
      })
      if(filteredData.length){
        this.selectedMethods = this.selectedMethods.concat(filteredData)
        this.tableData = this.getResult()
      }
    },
    addCompany(data) {
      if(!this.selectedCompany.some(company => company.id == data.id)){
        this.selectedCompany.push(data)
        this.tableData = this.getResult()
      }
    },
    getResult() {
      let ret = []
      this.selectedMethods.forEach(method => {
        let obj = {}
        let sum = 0
        obj.method = {
          methodId: method.id,
          methodName: method.title
        }
        obj.companies = []
        this.selectedCompany.forEach((company, index) => {
          let issuesNum = Math.ceil(Math.random() * 10)
          obj.companies.push({
            companyId: company.id,
            companyName: company.title,
            issues: issuesNum,
            subCompany: company.subCompany
          })
          sum += issuesNum
        })
        obj.sum = sum
        ret.push(obj)
      })
      return ret
    },
    handleRemoveCompany(companyName) {
      this.tableLoading = true
      let noMatch = this.selectedCompany.every((item, index) => {
        if (item.title == companyName) {
          this.selectedCompany.splice(index, 1)
          this.tableData = [] //this.getResult()
          setTimeout(() => {
            this.tableData = this.getResult()
            this.tableLoading = false
          }, 0)
          return false
        }
        return true
      })
      if (noMatch) {
        this.tableLoading = false
      }
    },
    handleRemoveMethod(methodId) {
      this.selectedMethods.every((item, index) => {
        if (item.id == methodId) {
          this.selectedMethods.splice(index, 1)
          this.tableData = this.getResult()
          return false
        }
        return true
      })
    },
    handleShowDetail(data) {
      this.dialogVisibleDetail = true
    },
    handleChangeCompany(parentCompany, childCompany) {
      this.selectedCompany.every(item => {
        if (item.id == parentCompany) {
          if (item.subCompany && childCompany.id == item.subCompany.id) {
            return false
          }
          if (childCompany.level == 1 && !item.subCompany) {
            return false
          }
          if (childCompany.level == 1) {
            item.subCompany = null
            this.tableData = this.getResult()
            return false
          }
          item.subCompany = childCompany
          this.tableData = this.getResult()
          return false
        }
        return true
      })
    },
    handleCreateChare(level, methodId) {
      this.dialogVisibleBarChart = true
    },
    handleClearData() {
      this.$confirm('是否清空当前表格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectedCompany = []
        this.selectedMethods = []
        this.tableData = []
        this.loadMethodTree()
        this.loadCompanyList()
        this.$message({
          type: 'success',
          message: '已清空!'
        });
      }).catch(() => {

      })
    },
    handleShowChart(){
      this.dialogVisiblePieChart = true
    },
    handleChangeLevel(level){
      console.log(level)
      this.tableData = this.getResult()
    },
    handleChangeYear(year){
      console.log(year)
      this.tableData = this.getResult()
    }
  }
}
</script>
<style lang="scss">
.statistic-analysis {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0 auto;
  padding: 10px;
  .el-collapse{
    height: 100%;
    border: none;
    &.one{
      .el-collapse-item.is-active{
        height: calc(100% - 43px);
      }
    }
    .el-collapse-item{
      height: auto;
      &.is-active{
        height: 50%;
      }
      .el-collapse-item__wrap{
        height: calc(100% - 43px);
        .el-collapse-item__content{
          height: 100%;
        }
      }
    }
  }
  .top-box {
    // height: 50%;
    .search-input {
      h4 {
        font-weight: normal;
        line-height: 50px;
        margin: 0;
      }
      form {
        top: 5px;
      }
      input[type="text"] {
        background-color: #fff;
        padding-left: 0;
        color: #000;
      }
    }
    .tree-btn {
      float: right;
      padding: 0 15px;
      opacity: 0;
    }
    .el-tree-node__content:hover {
      .tree-btn {
        opacity: 1;
      }
    }
    .el-card__body,
    .el-row,
    .el-col,
    .method-container,
    .company-container {
      height: 100%;
    }
    .method-tree,
    .company-list {
      height: calc(100% - 50px);
    }
  }
  .table-container {
    // height: calc(50% - 20px);
    // margin-top: 20px;
    // margin-bottom: 20px;
    .el-card__body {
      height: 100%;
    }
  }
  .el-loading-mask {
    background-color: rgba(255, 255, 255, .9);
  }
}
</style>
