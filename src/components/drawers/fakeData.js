export default {
  listData: {
    'status': 'success',
    'isCanExecute': 0,
    'data': [{
      'id': 1,
      'title': '部门预算执行总体情况和执行率',
      'params': [{
        'id': 1,
        'name': 'liyakun',
        'type': 'int',
        'value': '-99',
        'isNull': 1
      }, {
        'id': 2,
        'name': 'p02',
        'type': 'string',
        'value': 'default Vales',
        'isNull': 1
      }],
      'externalDataSource': [
        '账户表'
      ]
    }, {
      'id': 2,
      'title': '预算项目执行情况',
      'params': [{
        'id': 3,
        'name': 'p03',
        'type': 'int',
        'value': '-99',
        'isNull': 1
      }, {
        'id': 4,
        'name': 'p04',
        'type': 'boolean',
        'value': '0',
        'isNull': 1
      }],
      'externalDataSource': [
        't2_ex1',
        't2_ex2'
      ]
    }, {
      'id': 7,
      'title': '年底向宾馆培训中心招待所等大额转款',
      'params': [{
        'id': 13,
        'name': 'p13',
        'type': 'int',
        'value': '-99',
        'isNull': 1
      }, {
        'id': 14,
        'name': 'p14',
        'type': 'date',
        'value': '1900-01-01 00:00:00',
        'isNull': 0
      }],
      'externalDataSource': [
        't7_ex1',
        't7_ex2'
      ]
    }, {
      'id': 8,
      'title': '工会经费实际支出超预算',
      'params': [{
        'id': 15,
        'name': 'p15',
        'type': 'int',
        'value': '-99',
        'isNull': 1
      }, {
        'id': 16,
        'name': 'p16',
        'type': 'float',
        'value': '-99.99',
        'isNull': 0
      }],
      'externalDataSource': [
        't8_ex1',
        't8_ex2'
      ]
    }, {
      'id': 94,
      'title': '福利费支出超预算',
      'params': [{
        'id': 91,
        'name': '预算年度',
        'type': 'string',
        'isNull': 1
      }, {
        'id': 92,
        'name': '单位编码',
        'type': 'string',
        'isNull': 0
      }],
      'externalDataSource': [
        's'
      ]
    }, {
      'id': 99,
      'title': '财政供养人员经商办企业',
      'params': [],
      'externalDataSource': [
        '临时表_人员信息'
      ]
    }, {
      'id': 100,
      'title': '财政供养人员经商办企业且相关企业是集中支付供应商',
      'params': [],
      'externalDataSource': [
        '临时表_人员信息'
      ]
    }, {
      'id': 101,
      'title': '财政供养人员是企业股东',
      'params': [],
      'externalDataSource': [
        '临时表_人员信息'
      ]
    }, {
      'id': 102,
      'title': '财政供养人员是企业股东且相关企业是集中支付供应商',
      'params': [],
      'externalDataSource': [
        '临时表_人员信息'
      ]
    }]
  },
  resultData: {
    'status': 'success',
    'jobId': 3,
    'data': [{
      'itemId': 5,
      'itemName': '部门预算编报与执行情况',
      'children': [{
        'methodId': 3,
        'methodName': '部门预算执行总体情况和执行率',
        'status': 'loading',
        'tableData': [{
          date: '2016-05-02',
          name: 'liyakun',
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
        }]
      }]
    }]
  }

}
