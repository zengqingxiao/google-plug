window.saveCsv = saveCsv
new Vue({
  el: '#app',
  data: function () {
    return {
      isdownload: false, // 是否在拉取数据
      fileToType: 1, // 文件保存类型
      newData: [], // csv数据
      needRequestApiNum: '', //需要请求接口的次数
      requestApiNum: 0,// 请求接口次数
      conditionData: [
        {
          show: true,
          title: '日类型时间选择',
          label: '天',
          rande: [],
          timeToType: 'daterange',
          pickerOptions: {
            disabledDate: (time) => {
              return time.getTime() > moment(moment().add(-1, 'days').format("YYYY-MM-DD")).valueOf();
            }
          }
        },
        {
          show: true,
          title: '月类型时间选择',
          label: '月',
          rande: [],
          timeToType: 'monthrange',
          pickerOptions: {
            disabledDate: (time) => {
              // 设置上一个月
              return time.getTime() > moment(moment().add(-1, 'month').format("YYYY-MM")).valueOf();
            }
          },
        }
      ],
      // 条件数据
      pickerOptions: {
        disabledDate: (time) => {
          if (this.timeToType === "daterange") {
            return time.getTime() > moment(moment().add(-1, 'days').format("YYYY-MM-DD")).valueOf();
          }
          if (this.timeToType === "monthrange") {
            // 设置上一个月
            return time.getTime() > moment(moment().add(-1, 'month').format("YYYY-MM")).valueOf();
          }

        }
      },
      // 时间类型数据
      fileToTypeData: [
        {
          value: 1,
          label: '单个文件保存'
        },
        {
          value: 2,
          label: '多文件保存'
        }
      ],
      timestamp: Date.parse(new Date()), // 当前时间戳
      // 请求参数配置
      defaultParams: {
        callback: "jQuery350031175090202621925_1588149710640",
        brandStoreName: "汤臣倍健",
        brandStoreSn: 10000980,
        dateMode: 7,
        dateType: 'P',
        detailType: 'D',
        beginDate: '2020-04-28',
        endDate: '2020-04-28',
        chartType: '',
        _: this.timestamp
      },
      // 提示区域数据
      hintArea: {
        percentage: 0,
        predictData: '暂时无法判断',
        downloadFilename: '---'
      }
    }
  },
  methods: {
    /**
     * 判断类型
     **/
    getType (x) {
      return /^\[object (.*)\]$/.exec(Object.prototype.toString.call(x))[1]
    },
    // 对象字段过滤函数
    // item 是一个完整的对象
    handleFieldFilter (item) {
      let tempObj = {}
      let FilteObj = {
        '一级入口|index_0': '',
        '二级入口|index_1': '',
        '三级入口|index_2': '',
        '四级入口|index_3': '',
        '开始时间|beginDate': '',
        '结束时间|endDate': '',
        'UV去重|uv': '',
        'UV占比|uvPct': '',
        '销售额|sales': '',
        '销售占比|salesPct': '',
        '转化率|conversion': '',
        '客户数|customerCnt': '',
        '订单数|orderCnt': '',
        '销售量|goodsCnt': '',
        '客均金额|avgUserSalesAmount': ''
      }
      for ([k, v] of Object.entries(FilteObj)) {
        tempObj[k.split('|')[0]] = item[k.split('|')[1]]
      }
      return tempObj
    },
    /**
     * 回调函数
     * @param {Object} [item] 每一个遍历到的对象的值
     **/
    callback (item) {
      item._levalArr.forEach((v, i) => {
        item[`index_${i}`] = v
      })
      this.newData.push(item)
    },
    /**
     * 递归树状结构
     * @param {Array} [data] 需要遍历的对象
     * @param {String} [subsetKey] 下一级数组的key
     * @param {String || Number} [parentVal] 上一级的关键词，可以是名字或者ID
     * @param {String} [valKey] 获取项的key值
     * @param {Array} [parentArr] '[parentVal]'的数组集合
     * @param {String} [levalArr] 获取[valKey]的值的集合
     * @param {Function} [callback] 每遍历到一条数据就会执行的回调函数 
     **/
    recursion ({ data, subsetKey, parentVal = '', valKey, parentArr = [], levalArr = [], callback = () => { } } = {}) {
      if (this.getType(data) !== 'Array' || this.getType(subsetKey) !== 'String' || this.getType('valKey') !== 'String') return
      if (data.length < 1) return
      data.forEach(item => {
        item._levalArr = [...levalArr]
        item._levalArr.push(item[valKey])
        item._parentArr = [...parentArr]
        item._parentArr.push(parentVal)
        item._parent = parentVal // 父级
        callback(item)
        this.recursion({ data: item[subsetKey], subsetKey: subsetKey, parentVal: item[valKey], valKey: valKey, parentArr: item._parentArr, levalArr: item._levalArr, callback: callback })
      })
    },
    /**
     * 时间差
     * @param {Data || String} [item] 每一个不同类型的全部参数
     * @retuen {Number} 返回对比时间的差
     */
    handleTimeDifference (item) {
      let diff = 0
      if (item.timeToType === 'daterange' && item.rande && item.rande.length > 0) {
        diff = moment(item.rande[1]).diff(item.rande[0], 'days') + 1
      }
      if (item.timeToType === 'monthrange' && item.rande && item.rande.length > 0) {
        diff = moment(item.rande[1]).diff(item.rande[0], 'month') + 1
      }
      return diff
    },
    /**
     * 更新参数
     */
    handleParam (amount) {

    },
    /**
     * 点击爬取数据
     */
    handleClickbutton () {
      let normal = this.conditionData.some(item => {
        return item.rande && item.rande.length > 1
      })
      if (!normal) {
        this.$message.error('至少要有一个类型的时间范围');
        return
      }
      this.handleHintAreaEmpty() // 提示区域清空
      this.isdownload = true // 开始下载数据
      this.needRequestApiNum = this.handleGetAllfileNumber(this.conditionData)  //需要请求接口的全部次数
      this.hintArea.predictData = this.handlePredictDate(this.needRequestApiNum) //预计时间
      Promise.all(
        this.conditionData.map((item) => {
          return this.handleStartStealData(item)
        })).then(() => {
          this.requestApiNum = 0 // 请求次数归0
          this.handleDesktopNotification() // 桌面通知
          this.isdownload = false // 结束爬取数据
        })
    },
    /**
     * 提示区域清空
     */
    handleHintAreaEmpty () {
      this.hintArea.percentage = 0
      this.hintArea.predictData = '暂时无法判断'
      this.hintArea.downloadFilename = '---'
    },
    /**
     * 获取全部的需要爬取接口的次数
     * 1.天类型：一天+1
     * 2.月类型：一个月+1
     * @param {Array} [DataArr] conditionData数组
     * @retuen {String} 返回爬取接口的次数
     */
    handleGetAllfileNumber (DataArr = []) {
      let num = 0
      DataArr.forEach(item => {
        num += this.handleTimeDifference(item)
      })
      return num
    },
    /**
     * 开始爬取数据
     * @param {Object} [param = {}] 每一个不同类型的参数
     */
    async handleStartStealData (item) {
      // if (!item.rande[0] && !item.rande[1]) return
      if (!(item.rande && item.rande.length > 0)) return
      let monofileDate = [] // 单文件数据
      let diff = this.handleTimeDifference(item) // 一共选择多少天
      for (let i = 0; i < diff; i++) {
        let paramObj = {}
        if (item.timeToType === 'daterange') {
          paramObj = {
            beginDate: moment(item.rande[0]).add(i, 'days').format('YYYY-MM-DD'),
            endDate: moment(item.rande[0]).add(i, 'days').format('YYYY-MM-DD'),
            dateMode: 7,
            dateType: 'P',
            detailType: 'D',
          }
        }
        if (item.timeToType === 'monthrange') {
          paramObj = {
            beginDate: moment(item.rande[0]).add(i, 'month').startOf('month').format('YYYY-MM-DD'),
            endDate: moment(item.rande[0]).add(i, 'month').endOf('month').format('YYYY-MM-DD'),
            dateMode: 2,
            dateType: 'D',
            detailType: 'M'
          }
        }
        this.hintArea.downloadFilename = this.handlePredictFilename(`${paramObj.beginDate}-${paramObj.endDate}.csv`) // 文件名称
        let rem = await this.handleStealData(paramObj)
        this.newData = []
        this.recursion({ data: rem.singleResult.insideData, subsetKey: 'children', valKey: 'entry', callback: this.callback })
        this.recursion({ data: rem.singleResult.outsideData, subsetKey: 'children', valKey: 'entry', callback: this.callback })

        let tempnewData = this.newData.map(subitem => {
          return this.handleFieldFilter(Object.assign(subitem, { beginDate: paramObj.beginDate, endDate: paramObj.endDate }))
        })
        monofileDate = [...monofileDate, ...tempnewData] // 数据拼接
        this.requestApiNum++
        this.hintArea.percentage = this.handleAchievePercent(this.needRequestApiNum, this.requestApiNum) * 100 // 返回百分比
        if (this.fileToType === 2) {
          // 多文件
          window.saveCsv(tempnewData, { filename: `${item.label}_${paramObj.beginDate}-${paramObj.endDate}.csv` });
        }
      }
      if (this.fileToType === 1) {
        // 单文件
        window.saveCsv(monofileDate, { filename: `${item.label}_${item.rande[0]}-${item.rande[1]}.csv` });
      }
    },
    /**
     * 桌面通知
     * @param {String} [name = null] 通知的名字
     */
    handleDesktopNotification (name = null) {
      chrome.notifications.create(name, {
        type: 'basic',
        iconUrl: './images/wei.png',
        title: '唯品会插件通知',
        message: '您刚才爬取的唯品会流量数据已经完成！'
      });
    },
    /**
     * 设置当前爬取的文件名称
     * @param {String} [name] 当前执行的文件名称
     */
    handlePredictFilename (name) {
      return name
    },
    /**
     * 完成百分之多少
     * @param {String} [allData] 全部的数据条数
     * @param {String} [nowadayData] 当前的数据条数
     */
    handleAchievePercent (allData, nowadayData) {
      if (allData === 0) return 1
      return parseFloat((nowadayData / allData).toFixed(2))
    },
    /**
     * 预计时间
     * @param {String} [num] 全部的数据条数
     * @param {String} [Data] 一条数据是需要的时间
     */
    handlePredictDate (num, Data = 2) {
      return num * Data + '秒'
    },
    /**
     * Switch按钮状态改变的时候
     * @param {Boolean} [e] 当前Switch选择的值
     * @param {Object} [item] 当前switch所在的数据对象
     */
    handleSwitch (e, item) {
      if (!e) {
        item.rande = []
        this.$message({
          message: `移除${item.label}查询数据`,
          type: 'warning'
        });
      } else {
        this.$message({
          message: `添加${item.label}查询数据`,
          type: 'success'
        });
      }
    },
    // 模拟请求接口
    handleStealData (params) {
      return new Promise((resolve, reject) => {
        // 参数值修改
        Object.assign(this.defaultParams, params)
        axios.get('http://compass.vis.vip.com/flow/entranceDistributionAll', {
          params: this.defaultParams
        })
          .then(function (response) {
            let data = response.data.slice(42, response.data.length - 2)
            resolve(JSON.parse(data))
          })
          .catch(function (error) {
            reject(error)
          });
      })
    }

  }
})