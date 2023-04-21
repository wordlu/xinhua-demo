import {
  selectData
} from '../libs/termData';
import * as servdeal from '@api/bondYield';
import {
  removeNullInObject,
  initData
} from '@utils/util';
import {
  mapGetters
} from 'vuex';

export default {
  data() {
    return {
      selectData: {
        ...selectData
      },
      pickerOptions: {
        disabledDate: (time) => {
          return !this.ableDate.includes(this.$moment(time).format('YYYYMMDD'));
        }
      },
      pageNum: 1,
      pageSize: 6,
      queryVal: "",
      bizDate: ''
    };
  },
  computed: {
    ...mapGetters({
      ableDate: 'ableDate'
    })
  },
  mounted() {
    this.initDict();
  },
  methods: {
    // 获取行业
    getIndustry(params) {
      return servdeal.getIndustryList(params);
    },
    // 穿梭框 - 右侧输入框双击 给数据重新赋值
    getResult(data) {
      this.selectData.selectedData = data;
    },
    // 获取左侧穿梭框数据
    getTransferData(data) {
      let params = removeNullInObject(data);
      if (params.orgList.length === 1) {
        if (this.selectData.setOptions.orgList.length === 0) {
          params.boxCode = params.orgList
          params.boxCode = params.boxCode.join('')
          delete params.orgList
        }
      }

      servdeal.getMainList(params).then((res) => {
        if (res) {
          let {
            list
          } = res.data;
          this.selectData.transferData = list;
          // this.$refs.customTransfer.selectedLeft = []
        }
      });
    },
    initDict() {
      let params = this.globalDictMap(2060).map((item) => {
        return item.code;
      });
      // 申万行业
      this.getIndustry(params[2]).then((res) => {
        if (res) {
          this.$set(this.selectData.setOptions, 'swIndustryList', res.data);
        };
      });
      // 新华内部行业
      this.getIndustry(params[1]).then((res) => {
        this.$set(this.selectData.setOptions, 'innerIndustryList', res.data);
      });
      // 新华GICS行业
      this.getIndustry(params[0]).then((res) => {
        this.$set(this.selectData.setOptions, 'gicsIndustryList', res.data);
      });
      // 主体所属分析师
      servdeal.getOrgAnalystList(params).then((res) => {
        this.$set(this.selectData.setOptions, 'orgAnalystList', res.data);
      });
    },
    // 主体选择器中 form表单中某些项更改，触发trigger
    selectTrigger(formData, item) {
      this.$set(this.selectData.formData, 'initData', formData);
      if (item.key === 'orgList') {
        this.getItemRemoteMethod();
      }
    },
    // 选择器中 form表单 select远程搜索
    getItemRemoteMethod(val, item) {
      if (!(!val || val === null || val === undefined || Array.isArray(val))) {
        let {
          initData
        } = this.selectData.formData;
        if (!initData.bizDate) {
          this.$message.warning('请先选择日期');
          return;
        }
        this.queryVal = val
        this.bizDate = initData.bizDate
        this.getDataList(val, initData.bizDate, item)
      }
    },
    // 获取表格数据
    getDataList(val, bizDate, item) {
      let params = {};
      params.bizDate = bizDate;
      params.code = val;
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      servdeal.getSubjNameList(params).then((res) => {
        this.loading = false;
        if (res) {
          let {
            list,
            total
          } = res.data;
          this.$set(this.selectData.setOptions, 'orgList', list);
          this.selectData.formData.renderFrom[1].getPageInfo.total = total
        }
      });
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getDataList(this.queryVal, this.bizDate);
    },
    blurValue(item) {
      let current = this.$refs.select.$refs.searchForm.useData.initData[item.key]
      if (current.length === 0 || current === '' && !this.queryVal) {
        this.$refs.select.$refs.searchForm.useData.initData[item.key] = [this.queryVal]
        this.selectData.setOptions[item.key] = []
        this.queryVal = ''
      }
    }
  },
  beforeDestroy() {
    // 将主体选择器中 form表单内容清空
    this.$set(this.selectData.formData, 'initData', initData(this.selectData.formData.renderFrom));
  }
};