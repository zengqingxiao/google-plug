window.saveCsv = saveCsv
new Vue({
  el: '#app',
  data: function () {
    return {
      isdownload: false, // 是否在拉取数据
      timeToType: "daterange", // 时间组件类型
      fileToType: 1, // 文件保存类型
      startDate: '', // 开始时间
      endDate: '', // 选择的结束时间
      disabled: true, // 爬取按钮是否可以点击
      rande: [],
      newData: [], // csv数据
      conditionData: [
        {
          title: '日类型时间选择',
          rande: [],
          startDate: '',
          endDate: '',
          show: true
        },
        {
          title: '月类型时间选择',
          rande: [],
          startDate: '',
          endDate: '',
          show: true
        }
      ], // 条件数据
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
      // 日期类型数据
      timeToTypeData: [
        {
          value: "daterange",
          label: '日'
        },
        {
          value: "monthrange",
          label: '月'
        }
      ],
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
     * 时间组件值发生改变
     * 1.赋值开始和结束值
     * 2.爬取按钮是否可以点击
     * @param {Array} [val = []] 
     */
    handleDateValue (val = []) {
      if (this.getType(val) === 'Array' && val[0] && val[1]) {
        this.startDate = val[0]
        this.endDate = val[1]
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    /**
     * 时间差
     * @param {Data || String} [end] 结束时间
     * @param {Data || String} [start] 开始时间
     * @retuen {Number} 返回对比时间的差
     */
    handleTimeDifference (end, start) {
      let diff
      if (this.timeToType === 'daterange') {
        diff = moment(end).diff(start, 'days')
      }
      if (this.timeToType === 'monthrange') {
        diff = moment(end).diff(start, 'month')
      }
      return diff
    },
    /**
     * 更新参数
     */
    handleParam (amount) {

    },
    /**
     * 开始爬取数据
     * @param {Object} [param = {}] 需要修改的参数
     */
    async handleStartStealData () {
      if (!this.endDate && !this.startDate) return
      let monofileDate = [] // 单文件数据
      this.isdownload = true // 是否开始下载数据
      let diff = this.handleTimeDifference(this.endDate, this.startDate) // 一共选择多少天
      this.hintArea.predictData = this.handlePredictDate(diff + 1) //预计时间
      for (let i = 0; i < diff + 1; i++) {
        let paramObj = {}
        if (this.timeToType === 'daterange') {
          paramObj = {
            beginDate: moment(this.startDate).add(i, 'days').format('YYYY-MM-DD'),
            endDate: moment(this.startDate).add(i, 'days').format('YYYY-MM-DD'),
            dateMode: 7,
            dateType: 'P',
            detailType: 'D',
          }
        }
        if (this.timeToType === 'monthrange') {
          paramObj = {
            beginDate: moment(this.startDate).add(i, 'month').startOf('month').format('YYYY-MM-DD'),
            endDate: moment(this.startDate).add(i, 'month').endOf('month').format('YYYY-MM-DD'),
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
        let tempnewData = this.newData.map(item => {
          return this.handleFieldFilter(Object.assign(item, { beginDate: paramObj.beginDate, endDate: paramObj.endDate }))
        })
        monofileDate = [...monofileDate, ...tempnewData] // 数据拼接
        this.hintArea.percentage = this.handleAchievePercent(diff, i) * 100 // 返回百分比
        if (this.fileToType === 2) {
          window.saveCsv(tempnewData, { filename: `${paramObj.beginDate}-${paramObj.endDate}.csv` });
        }
      }
      if (this.fileToType === 1) {
        window.saveCsv(monofileDate, { filename: `${this.startDate}-${this.endDate}.csv` });
      }
      this.isdownload = false
      // 桌面通知
      this.handleDesktopNotification()
    },
    /**
     * 桌面通知
     * @param {String} [name = null] 通知的名字
     */
    handleDesktopNotification (name = null) {
      chrome.notifications.create(name, {
        type: 'basic',
        iconUrl: './images/get_started32.png',
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
    handlePredictDate (num, Data = 0.5) {
      return num * Data + '秒'
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