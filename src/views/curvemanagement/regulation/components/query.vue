<template>
  <div>
    <el-dialog
      title="导入待查询主体"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      width="60%"
      :append-to-body="true"
      @close="close"
    >
      <div>
        <div>
          <input type="file" style="display:none" />
          <el-button type="success" icon="el-icon-folder-add" @click="select">选择文件</el-button>
          <el-button type="primary" icon="el-icon-upload" @click="downLoad">下载模板 </el-button>
          <input id="" ref="file" type="file" style="display:none" @change="changeInput" />
          <div class="boxOne">
            <span class="red">选择文件(只能上传xlsx文件，且不超过10M)</span>
          </div>
          <div class="matching">
            <div class="boxOne">
              {{ `共导入${total}个主体，其中${mismatching}个不匹配，已经匹配${succeed}个` }}
            </div>
            <div class="boxOne">
              <el-checkbox v-model="checked" :disabled="!tableData.length > 0"
                >只看匹配失败</el-checkbox
              >
            </div>
          </div>
        </div>
      </div>
      <div>
        <el-table
          ref="singleTable"
          :data="newTableData"
          highlight-current-row
          style="width: 100%"
          max-height="350"
          border
          @current-change="handleCurrentChange"
        >
          <el-table-column type="index" width="50" label="序号" align="center"> </el-table-column>
          <el-table-column
            property="importObjCode"
            label="主体代码(导入文件)"
            width="220"
            align="center"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.importObjCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            property="importObjName"
            label="主体名称(导入文件)"
            width="220"
            align="center"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.importObjName"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="objCode" label="主体代码" align="center"></el-table-column>
          <el-table-column property="objName" label="主体名称" align="center"> </el-table-column>
          <el-table-column property="matchResult" label="匹配结果" align="center">
            <template slot-scope="scope">
              <span
                style="margin-left: 10px"
                :class="[{ red: !scope.row.matchResult.includes('匹配成功') }]"
                >{{ scope.row.matchResult }}</span
              >
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px;text-align:right ;">
          <el-button type="primary" @click="matching">匹配</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
          <el-button type="primary" @click="confing">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { downloadTemplateAPI, orgNameImportAPI, orgNameMatchAPI } from '@api/configuration'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      percentage: 0,
      flag: true,
      tableData: [],
      newTableData: [],
      result: '',
      // 查看匹配失败的按钮
      checked: false,
      extensions: ['xlsx'],
      maxSize: 60 * 1024,
      total: 0,
      mismatching: 0,
      succeed: 0
    }
  },
  watch: {
    checked(val) {
      if (val) {
        this.newTableData = this.tableData.filter(item => {
          return !item.matchResult.includes('匹配成功')
        })
      } else {
        this.newTableData = this.tableData
      }
    }
  },
  methods: {
    handleCurrentChange() {},
    downLoad() {
      downloadTemplateAPI()
    },
    select() {
      this.$refs.file.click()
    },
    async changeInput(e) {
      let file = this.$refs.file.files[0]
      const fileFormat = file.name
        .split('.')
        .pop()
        .toLocaleLowerCase()
      if (!this.extensions.includes(fileFormat)) {
        return this.$message.error(
          `待上传文件的后缀名错误，允许上传后缀名为${this.extensions.join('、')}的文件`
        )
      }

      if (file.size > this.maxSize * 1024) {
        return this.$message.error(
          `待上传文件大小超过可上传的最大值${Math.round(this.maxSize / 1024)}M`
        )
      }
      let formData = new FormData()
      formData.append('file', file)
      e.target.value = ''
      const { data } = await orgNameImportAPI(formData)
      const { matchList, total, fail, success } = data
      this.tableData = matchList
      this.newTableData = matchList
      this.total = total
      this.mismatching = fail
      this.succeed = success
      this.checked = false
    },
    format(percentage) {
      return percentage === 100 ? '满' : `${percentage}%`
    },
    // 匹配
    async matching() {
      let i = 0
      let index = 1
      const list = this.newTableData.map(item => {
        item.id = i++
        item.index = index++
        return item
      })
      const res = await orgNameMatchAPI(list)
      this.newTableData = res.data.matchList
      this.tableData = res.data.matchList
    },
    close() {
      this.newTableData = []
      this.tableData = []
      this.checked = false
      this.total = 0
      this.mismatching = 0
      this.succeed = 0
      this.$emit('close', false)
    },
    // 点击取消的时候
    cancel() {
      this.close()
    },
    // 点击确认的时候,传递数据数据
    confing() {
      let newDataList = this.tableData.filter(item => {
        return item.matchResult.includes('匹配成功')
      })
      let dataList = []
      let obj = {}
      for (let i = 0; i < newDataList.length; i++) {
        if (!obj[newDataList[i].objCode]) {
          dataList.push(newDataList[i])
          obj[newDataList[i].objCode] = true
        }
      }
      dataList = dataList.map(item => {
        item.name = item.objName
        item.code = item.objCode
        return item
      })
      this.$emit('transmit', dataList)
      this.close()
    }
  }
}
</script>
<style lang="scss" scoped>
.red {
  color: red;
}
.matching {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.boxOne {
  margin-top: 10px;
}
</style>
