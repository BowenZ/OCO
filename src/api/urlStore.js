let devMode = true
if(process.env.NODE_ENV === 'production'){
  devMode = false
}
devMode = false
const ip = devMode ? 'http://localhost:3000/' : 'http://192.168.101.100:9898/WQB_economy_responsibility_audit/'

const urls = {
  // 多方法执行
  root: ip + '',
  findList: ip + 'auditJob/findList.do',
  getDetail: ip + 'auditJob/getDetail.do',
  getExecuteMethods: ip + 'autidMethodInstance/getExecuteMethods.do',
  saveJob: ip + 'auditJob/saveJob.do',
  addJob: ip + 'auditJob/addJob.do',
  deleteById: ip + 'auditJob/deleteById.do',
  renameJob: ip + 'auditJob/renameJob.do',
  exportResult: ip + 'auditResult/exportResult.do',
  exportBatch: ip + 'auditResult/exportBatch.do',

  // 单方法执行
  findMethods: ip + 'auditMethodModel/findMethods.do',
  getExecuteSingleMethod: ip + 'autidMethodInstance/getExecuteSingleMethod.do',
  downLoadTemplate: ip + 'auditMethodModel/downLoadTemplate.do',
  uploadExternaldatasource: ip + 'auditMethodModel/uploadExternaldatasource.do',
  saveSingleMehtodJob: ip + 'auditJob/saveSingleMehtodJob.do',
  isCanExecute: ip + 'auditJob/isCanExecute.do',

  // 基础数据
  findBasicMethod: ip + 'auditMethodModel/findBasicMethod.do',
  getExecuteBasicMethod: ip + 'autidMethodInstance/getExecuteBasicMethod.do',

  // 文档管理
  uploadDocument: ip + 'auditDocument/uploadDocument.do',
  deleteDocuments: ip + 'auditDocument/deleteDocuments.do',
  downloadDocuments: ip + 'auditDocument/downloadDocuments.do',

  login: ip + 'sysUser/login.do',

  // 模型维护
  getAllTree: ip + 'auditCategory/getAllTree.do',
  addAuditCategory: ip + 'auditCategory/add.do',
  updateAuditCategory: ip + 'auditCategory/update.do',
  deleteAuditCategory: ip + 'auditCategory/delete.do',

  addAuditItem: ip + 'auditItem/add.do',
  updateAuditItem: ip + 'auditItem/update.do',
  deleteAuditItem: ip + 'auditItem/delete.do',

  addAuditMethodModel: ip + 'auditMethodModel/add.do',
  updateAuditMethodModel: ip + 'auditMethodModel/update.do',
  deleteAuditMethodModel: ip + 'auditMethodModel/delete.do',

  copyMethod: ip + 'auditMethodModel/copy.do',
  approveMethod: ip + 'auditMethodModel/pass.do',
  queryParamKeyValues: ip + 'paramModel/queryParamKeyValues.do',

  stopJob: ip + 'auditJob/stopJob.do',

  findAllListWithAuditItemAndAuditMethodModel: ip + 'auditCategory/findAllListWithAuditItemAndAuditMethodModel.do',
  findUnitsList: ip + 'unitsBasicInfo/findList.do',
  findUnitTreeByPcode: ip + 'unitsBasicInfo/findUnitTreeByPcode.do',
  statisticQuery: ip + 'auditResultStore/statisticQuery.do',
  dataDrillByPcode: ip + 'auditResultStore/dataDrillByPcode.do',
  viewResultData: ip + 'auditResult/viewResultData.do',
  export: ip + 'auditResultStore/export.do',
  findLevel3ByLevel2: ip + 'auditResult/findLevel3ByLevel2.do',
  exportStatisticData: ip + 'auditResultStore/exportStatisticData.do'
}

export default urls
