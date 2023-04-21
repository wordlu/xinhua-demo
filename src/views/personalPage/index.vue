<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="'债券交易信息查询'" />
      <div class="querySearch">
        <el-row class="chose">
          <el-col class="choseMain" :offset="1">
            <el-button class="chooseBtn" type="primary" size="small" @click="dialogVisible = true"
              >选择主体<i class="el-icon-upload el-icon--right"></i
            ></el-button>
            <div class="selected">
              <p v-for="(item, index) in choseList" :key="'item' + index" class="selectedItem">
                {{ item }}
                <i class="delBodyItem el-icon-close"></i>
              </p>
            </div>
            <el-button>清空</el-button>
          </el-col>
          <el-col class="choseMain" :offset="1">
            <el-button class="chooseBtn" type="primary" size="small"
              >选择主体<i class="el-icon-upload el-icon--right"></i
            ></el-button>
            <div class="selected"></div>
            <el-button>清空</el-button>
          </el-col>
        </el-row>
        <el-form
          :model="searchParam"
          class="grid"
          size="medium"
          label-position="right"
          label-width="120px"
          inline
        >
          <el-form-item label="起始日期：" prop="startDate">
            <el-date-picker
              v-model="searchParam.startDate"
              type="date"
              align="center"
              placeholder="选择日期"
              size="small"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期：">
            <el-date-picker
              v-model="searchParam.endDate"
              type="date"
              align="center"
              placeholder="选择日期"
              size="small"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交易市场：">
            <el-select v-model="searchData.shop" multiple placeholder="请选择" size="small">
              <el-option
                v-for="item in shopList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="汇总或逐笔：">
            <el-select v-model="searchData.shop" multiple placeholder="请选择" size="small">
              <el-option
                v-for="item in shopList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收益率或利差：">
            <el-select v-model="searchData.shop" multiple placeholder="请选择" size="small">
              <el-option
                v-for="item in shopList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="无风险收益率：">
            <el-select v-model="searchData.shop" multiple placeholder="请选择">
              <el-option
                v-for="item in shopList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="无风险利差：">
            <el-select v-model="searchData.shop" multiple placeholder="请选择">
              <el-option
                v-for="item in shopList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <BaseTable
        :columns="columns"
        has-pagination
        :page-size="1"
        :current-page="table.currentPage"
        :total="table.total"
        :loading="false"
        :page-sizes="[50, 100, 200, 500]"
      />
    </el-container>
    <el-dialog
      title="债券选择器"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="1200px"
    >
      <el-form label-width="140px" :inline="true">
        <el-form-item label="日期:">
          <el-date-picker v-model="value1" align="center" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="债券代码:">
          <el-select v-model="searchData.shop" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in shopList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="债券简称：">
          <el-select v-model="searchData.shop" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in shopList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属曲线:">
          <el-select v-model="searchData.shop" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in shopList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="（含权）剩余期限:">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="债券级别:">
          <el-select v-model="searchData.shop" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in shopList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易市场:">
          <el-select v-model="searchData.shop" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in shopList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发行规模:">
          <el-select v-model="searchData.shop" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in shopList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="剩余规模:">
          <el-select v-model="searchData.shop" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in shopList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发行利率:">
          <el-select v-model="searchData.shop" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in shopList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button>重置</el-button>
        <el-button type="primary">查询债券列表</el-button>
      </div>
      <div>
        <div>
          <el-button>债券列表导入</el-button>
        </div>
        <el-transfer v-model="value"></el-transfer>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BeforeLineTitle from '@components/CommonTitle'
import BaseTable from '@components/BaseTable'
export default {
  components: {
    BeforeLineTitle,
    BaseTable
  },
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      mainArray: [],
      bondArray: [],
      searchData: {},
      dataList: [],
      choseList: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      columns: [
        {
          label: '序号',
          sortable: true
        },
        {
          label: '交易ID'
        },
        {
          label: '成交日期'
        },
        {
          label: '成交时间'
        },
        {
          label: '债券代码'
        },
        {
          label: '收益率或利差'
        },
        {
          label: '债券简称'
        },
        {
          label: '债项评级'
        },
        {
          label: '含权剩余期限'
        },
        {
          label: '含权剩余期限说明'
        },
        {
          label: '剩余期限'
        },
        {
          label: '发行期限'
        },
        {
          label: '成交收益率'
        },
        {
          label: '成交量'
        },
        {
          label: '成交金额'
        },
        {
          label: '中债估值收益率'
        },
        {
          label: '中证估值收益率'
        },
        {
          label: '内部估值收益率'
        },
        {
          label: '债项交易市场'
        },
        {
          label: '同剩余期限中债国开到期收益率'
        },
        {
          label: '债项交易市场'
        },
        {
          label: '成交类型'
        },
        {
          label: '债项级别'
        },
        {
          label: '发行规模'
        },
        {
          label: '发行利率'
        },
        {
          label: '主体名称'
        },
        {
          label: '主题最终级别'
        },
        {
          label: '主体最终级别类型'
        }
      ],
      table: {
        currentPage: 1,
        pageSize: 18,
        ascs: [],
        descs: [],
        total: 0
      },
      value1: '',
      data: generateData(),
      value: [1, 4],
      dialogVisible: false,
      queryItems: [],
      searchParam: {},
      shopList: [
        {
          label: '张三丰',
          value: 0
        },
        {
          label: '虚竹',
          value: 1
        }
      ] // 模拟数据，后期删除
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.configMain {
  padding: 10px;
  background-color: $color-body-bg;
  .bodyWrap {
    background-color: #fff;
  }
}
.querySearch {
  margin: 40px 0 40px 40px;
  .chooseMain {
    margin-bottom: 20px;
  }
  .chooseBtn {
    margin-right: 20px;
  }
}
.el-form-item {
  width: (100% / 4);
  margin-right: 0;
}
::v-deep .el-form-item__content {
  width: 60%;
  .el-select,
  .el-date-editor {
    width: 100% !important;
  }
}
.chose {
  margin-bottom: 30px;
  .choseMain {
    display: flex;
    // justify-content: space-between;
    margin-bottom: 20px;
    .selected {
      display: flex;
      width: 60%;
      margin-right: 10px;
      overflow: auto;
      border: 1px solid #e0e3e5;
      &::-webkit-scrollbar {
        display: none;
        width: 0;
      }

      .selectedItem {
        position: relative;
        height: 20px;
        padding: 2px 15px;
        margin: 7px 10px;
        line-height: 20px;
        background: #e0e3e5;
        border-radius: 4px;
        .delBodyItem {
          position: absolute;
          top: -7px;
          right: 3px;
          display: block;
          width: 5px;
          height: 5px;
          cursor: pointer;
          .el-icon-close {
            &::before {
              font-size: 12px;
              font-weight: 600 !important;
              content: '' !important;
            }
          }
        }
      }
    }
  }
}
::v-deep {
  .el-dialog__body {
    .el-form-item {
      width: (100% / 3);
    }
  }
}
</style>
