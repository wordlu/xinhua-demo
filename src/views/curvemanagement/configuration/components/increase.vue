<template>
  <div>
    <el-dialog
      :title="title"
      :visible="increaseVisible"
      :close-on-click-modal="false"
      width="60%"
      @close="close"
      @open="open"
    >
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="curveId" align="center">
          <template v-if="scope.row.planNameFlag" slot-scope="scope">
            <div style="display:flex;  align-items: center;justify-content: center;">
              <el-input
                v-model="scope.row.planName"
                style="margin-right:20px;"
                placeholder="请输入标准曲线簇方案名称"
                :disabled="show"
                @input="planNameInput({ index: scope.$index, value: scope.row.planName })"
              ></el-input>
              <el-button
                v-if="!show"
                icon="el-icon-plus"
                :disabled="!(num < 5)"
                @click="addgivenPeriod(scope.$index)"
              ></el-button>
              <el-button v-if="!show" icon="el-icon-minus" @click="delcurveId"></el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="givenPeriod" align="center">
          <template v-if="scope.row.clusterNameFlag" slot-scope="scope">
            <div style="display:flex;  align-items: center;justify-content: center;">
              <el-input
                v-model="scope.row.clusterName"
                style="margin-right:20px;"
                placeholder="请输入标准曲线簇名称"
                :disabled="show"
                @input="input({ index: scope.$index, value: scope.row.clusterName })"
              ></el-input>
              <el-button
                v-if="!show"
                icon="el-icon-plus"
                @click="addcurve(scope.$index, scope)"
              ></el-button>
              <el-button
                v-if="!show"
                icon="el-icon-minus"
                @click="delgivenPeriod(scope.$index, scope)"
              ></el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="curve">
          <template v-if="scope.row.curveNameFlag" slot-scope="scope">
            <div style="display:flex;  align-items: center;justify-content: center;">
              <el-input
                v-model="scope.row.curveName"
                style=" margin-right:20px"
                placeholder="请输入标准标准曲线名称"
                :disabled="show"
                @input="curveInput({ index: scope.$index, value: scope.row.clusterName })"
              ></el-input>
              <el-button
                v-if="!show"
                icon="el-icon-minus"
                @click="delcurve(scope.$index)"
              ></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="!show" type="primary" :loading="loading" @click="add">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { savePlanAPI, getCurveInfoAPI, postsavePlanAPI, getNameListAPI } from '@api/configuration'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Aaa',
  props: {
    title: {
      default: '',
      type: String
    },
    increaseVisible: {
      type: Boolean,
      default: false
    },
    planCd: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    planeName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      tableData: [
        {
          planName: '',
          clusterName: '',
          curveName: '',
          planNameFlag: true,
          clusterNameFlag: false,
          curveNameFlag: false
        }
      ],
      num: 0,
      oldData: [],
      // 曲线簇方案的名称
      nameList: []
    }
  },
  methods: {
    // 添加标准曲线名称
    addcurve(index, scope) {
      if (!this.tableData[index].clusterName) {
        return this.$message.error('请先输入标准曲线簇名称')
      }
      // 获取所有的曲线名称
      let newName = this.tableData
        .filter(item => item.clusterNameFlag)
        .map(item => item.clusterName)
        .filter(item => item !== '')
      let weightName = [...new Set(newName)]
      if (newName.length === weightName.length) {
        if (!this.tableData[index].curveNameFlag) {
          this.tableData[index].curveNameFlag = true
        } else {
          let arr = this.tableData
            .map((item, index) => {
              if (item.clusterNameFlag) {
                return index
              }
            })
            .filter(item => item || item === 0)
          if (arr[arr.length - 1] === index) {
            this.tableData.push({
              planName: this.tableData[index].planName,
              clusterName: this.tableData[index].clusterName,
              curveName: '',
              curveNameFlag: true
            })
          } else {
            let arr = this.tableData
              .map((item, index) => {
                if (item.clusterName === scope.row.clusterName) {
                  return index
                }
              })
              .filter(item => item || item === 0)
            this.tableData.splice(arr[arr.length - 1] + 1, 0, {
              planName: this.tableData[index].planName,
              clusterName: this.tableData[index].clusterName,
              curveName: '',
              curveNameFlag: true
            })
          }
        }
      } else {
        return this.$message.error('当前标准曲线簇名称重复,请重新输入')
      }
    },
    // 删除标准曲线名称
    delcurve(index) {
      if (this.tableData.length > 1) {
        if (index > 0) {
          if (this.tableData[index].clusterNameFlag) {
            this.tableData.splice(index, 1)
            this.tableData[index].clusterNameFlag = true
          } else {
            this.tableData.splice(index, 1)
          }
        } else {
          this.tableData[0].curveName = ''
          this.tableData[0].curveNameFlag = false
        }
      } else if (index === 0) {
        this.tableData[0].curveName = ''
        this.tableData[0].curveNameFlag = false
      } else {
        this.$message.error('无法删除')
      }
    },
    // 添加标准曲线簇名称
    addgivenPeriod(index) {
      if (!this.tableData[index].planName) {
        return this.$message.error('请先输入标准曲线簇方案名称')
      }
      if (this.nameList.includes(this.tableData[0].planName)) {
        return this.$message.error('标准曲线簇方案名称重复，请重新输入')
      }
      this.num += 1
      if (this.num === 5) {
        this.$message.error('无法添加更多')
      }
      if (!this.tableData[index].clusterNameFlag) {
        this.tableData[index].clusterNameFlag = true
      } else {
        this.tableData.push({
          planName: this.tableData[0].planName,
          clusterName: '',
          curveName: '',
          clusterNameFlag: true,
          planNameFlag: false,
          curveNameFlag: false
        })
      }
    },
    // 删除标准曲线簇名称
    delgivenPeriod(index, scope) {
      // 给曲线簇赋值，避免后边删除了没用数据
      let planName = this.tableData[0].planName
      if (!this.tableData[index].curveNameFlag) {
        this.tableData.splice(index, 1)
        this.num = this.num - 1
      } else {
        this.num = this.num - 1
        this.tableData = this.tableData.filter(item => {
          return item.clusterName !== scope.row.clusterName
        })
      }
      if (this.tableData.length === 0) {
        this.tableData = [
          {
            planName: planName,
            clusterName: '',
            curveName: '',
            planNameFlag: true,
            clusterNameFlag: false,
            curveNameFlag: false
          }
        ]
      } else {
        this.tableData[0].planNameFlag = true
      }
    },
    // 删除标准曲线簇方案
    delcurveId(index) {
      // this.tableData.splice(index, 1);
      this.tableData = [
        {
          planName: '',
          clusterName: '',
          curveName: '',
          planNameFlag: true,
          clusterNameFlag: false,
          curveNameFlag: false
        }
      ]
      this.num = 0
    },
    // 点击确认添加
    async add() {
      // 最少创建一条曲线簇方案
      if (this.tableData[0].planNameFlag && this.tableData[0].planName === '') {
        return this.$message.warning('最少创建一条曲线簇方案')
      }
      if (!this.tableData[0].clusterNameFlag) {
        return this.$message.warning('最少创建一条曲线簇名称')
      }
      // 获取所有的曲线簇名称
      let newName = this.tableData
        .filter(item => item.clusterNameFlag)
        .map(item => item.clusterName)
      let name = [...newName].filter((item, index) => {
        return [...newName].indexOf(item) === index
      })

      if (name.length !== newName.length) {
        return this.$message.error('标准曲线簇名称重复，请重新修改')
      }
      let CurveName = this.tableData.map(item => item.curveName).filter(item => item)
      let newCurveName = CurveName.filter(
        (item, index) => CurveName.indexOf(item) === index
      ).filter(item => item)
      let list = this.tableData.filter(item => item.clusterNameFlag)
      let flag = list.every(item => item.curveName !== '')
      if (!flag) {
        return this.$message.error('请为每一个标准曲线簇至少新增一条标准曲线')
      }
      if (newCurveName.length !== CurveName.length) {
        return this.$message.error('标准曲线名称重复，请重新修改')
      }
      this.loading = true

      if (!this.planCd) {
        let obj = {
          type: '1',
          planName: this.tableData[0].planName,
          clusterInfoList: []
        }
        // 筛选标准曲线簇名称
        let arr = this.tableData
          .map(item => {
            if (item.clusterName) {
              return item.clusterName
            }
          })
          .filter(item => item)
        arr = new Set(arr)
        // 添加标准曲线簇名称
        arr.forEach(item => {
          obj.clusterInfoList.push({
            clusterName: item,
            curveStandardInfoList: []
          })
        })
        // 筛选标准曲线名称
        let arr1 = this.tableData.filter(item => {
          return item.curveNameFlag
        })
        arr1.forEach(item => {
          obj.clusterInfoList.forEach(i => {
            if (item.clusterName === i.clusterName) {
              i.curveStandardInfoList.push({
                curveBasicPO: {
                  curveName: item.curveName,
                  curveTp: '0'
                }
              })
            }
          })
        })
        obj.clusterInfoList = obj.clusterInfoList.map(item => {
          item.curveStandardInfoList = item.curveStandardInfoList.filter(i => {
            return i.curveBasicPO.curveName !== ''
          })
          return item
        })
        const res = await savePlanAPI(obj)
        if (res.status === 200) {
          this.$message.success('添加成功')
          this.$emit('add')
          this.close()
        }
        this.loading = false
      } else {
        let params = {
          planCd: this.tableData[0].planCd,
          planName: this.tableData[0].planName,
          // 新添加的曲线簇包括对应曲线名称
          insertInfo: {},
          // 已有的曲线簇新增曲线
          haveInsertInfo: [],
          // 已有的曲线簇修改曲线
          updateInfo: {},
          // 删除已有的曲线簇曲线
          deleteInfo: {}
        }
        // 获取已有的曲线簇修改曲线名称
        let have = this.tableData.filter(item => {
          return !item.curveId && item.curveNameFlag
        })
        let addCurve = have
          .map(item => {
            for (let i = 0; i < this.oldData.length; i++) {
              if (item.clusterName === cloneDeep(this.oldData[i].clusterName)) {
                item.parentId = this.oldData[i].clusterCd
                item.name = item.curveName
                item.type = 'curve'
              }
            }
            return item
          })
          .filter(item => item.parentId)
        params.haveInsertInfo = addCurve
        // 获取新添加的曲线簇和他对应的曲线名称
        let inse = cloneDeep(this.tableData).filter(item => {
          return !item.clusterCd && item.clusterNameFlag
        })
        let newInse = inse.map(item => {
          item.name = item.clusterName
          item.type = 'cluster'
          return item
        })
        let inseCurve = cloneDeep(this.tableData).filter(item => {
          return !item.curveId && !item.clusterCd
        })
        // 获取原本所有的曲线簇名字
        let allName = cloneDeep(this.oldData).map(item => {
          return item.clusterName
        })
        let newInseCurve = cloneDeep(inseCurve)
          .map(item => {
            item.name = item.curveName
            item.type = 'curve'
            item.parentId = item.clusterName
            return item
          })
          .filter(item => {
            return !allName.includes(item.clusterName)
          })
        params.insertInfo = [...newInseCurve, ...newInse]
        // 先获取做开始数据的曲线id
        let oldcurveCode = this.oldData.map(item => {
          return item.curveId
        })
        // 获取现在的所有曲线id
        let newCurveCode = this.tableData.map(item => item.curveId)
        let getArrDifference = (arr1, arr2) => {
          return arr1.concat(arr2).filter(function(v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v)
          })
        }
        let different = getArrDifference(newCurveCode, oldcurveCode)
        let delte = cloneDeep(this.oldData)
          .filter(item => {
            return different.includes(item.curveId)
          })
          .map(item => {
            item.name = item.curveId
            item.parentId = item.clusterCd
            item.type = 'curve'
            return item
          })

        // 获取所有的曲线簇id
        let oldclusterCode = Array.from(
          new Set(
            this.oldData.map(item => {
              return item.clusterCd
            })
          )
        )
        // 获取现在所有的曲线簇id
        let newclusterCode = Array.from(
          new Set(
            this.tableData.map(item => {
              return item.clusterCd
            })
          )
        )
        let clusterCode = getArrDifference(oldclusterCode, newclusterCode)
        let delCluseter = cloneDeep(this.oldData)
          .filter(item => {
            return clusterCode.includes(item.clusterCd)
          })
          .map(item => {
            item.name = item.clusterCd
            item.type = 'cluster'
            return item
          })
        // 去重删除的曲线簇方案
        let fn2 = tempArr => {
          let result = []
          let obj = {}
          for (let i = 0; i < tempArr.length; i++) {
            if (!obj[tempArr[i].clusterCd]) {
              result.push(tempArr[i])
              obj[tempArr[i].clusterCd] = true
            }
          }
          return result
        }
        let clusterList = fn2(delCluseter)
        params.deleteInfo = [...clusterList, ...delte]

        // 获取修改的曲线名称数组
        let updateCurve = cloneDeep(this.tableData)
          .filter(item => {
            return oldcurveCode.includes(item.curveId)
          })
          .map(item => {
            item.parentId = item.curveId
            item.type = 'curve'
            item.name = item.curveName
            return item
          })
        // 获取修改过的曲线簇名称数组
        let updateCluster = fn2(
          cloneDeep(this.tableData)
            .filter(item => {
              return oldclusterCode.includes(item.clusterCd)
            })
            .map(item => {
              item.type = 'cluster'
              item.name = item.clusterName
              item.parentId = item.clusterCd
              return item
            })
        )
        params.updateInfo = [...updateCluster, ...updateCurve]
        let flag = this.tableData.every(item => {
          return item.curveName
        })
        if (!flag) {
          this.loading = false
          return this.$message.error('曲线名称不能为空')
        }
        const res = await postsavePlanAPI(params)
        if (res.status === 200) {
          this.$message.success('编辑成功')
          this.$emit('add')
          this.close()
        }
        this.loading = false
      }
    },
    // 点击取消的时候
    cancel() {
      this.close()
    },
    // 关闭弹框前做的事情
    close() {
      this.tableData = [
        {
          planName: '',
          clusterName: '',
          curveName: '',
          planNameFlag: true,
          clusterNameFlag: false,
          curveNameFlag: false
        }
      ]
      this.num = 0
      this.$emit('close', false)
      this.loading = false
    },
    async open() {
      this.getNameListFN()
      if (this.planCd) {
        const res = await getCurveInfoAPI({
          curveId: this.planCd,
          type: '1'
        })
        let list = res.data.clusterInfoList.map(item => {
          return item.curveStandardInfoList.map(i => {
            i.clusterName = item.clusterName
            i.clusterCd = item.clusterCd
            return i
          })
        })
        // 获取所有数据项放到一个数组当中
        let sumList = []
        list.forEach(item => {
          sumList.push(...item)
        })
        // 获取所有曲线簇名称
        let clusterName = sumList.map(item => {
          return item.clusterName
        })
        // 获取所有曲线簇ID
        let clusterCd = sumList.map(item => {
          return item.clusterCd
        })
        // 获取所有曲线名称
        let curveName = sumList.map(item => {
          return item.curveBasicPO.curveName
        })
        // 获取所有曲线id
        let curveId = sumList.map(item => {
          return item.curveBasicPO.curveId
        })
        // 声明赋值对象
        let data = []
        for (let i = 0; i < sumList.length; i++) {
          data.push({
            planName: res.data.planName,
            clusterName: clusterName[i],
            curveName: curveName[i],
            clusterNameFlag: false,
            curveNameFlag: true,
            planCd: res.data.planCd,
            clusterCd: clusterCd[i],
            curveId: curveId[i]
          })
        }
        data[0].planNameFlag = true
        // 获取曲线簇名称第一个的下标值
        let a = Array.from(new Set(clusterName))
        this.tableData = data
        let index1 = []
        for (let i = 0; i < a.length; i++) {
          let c = this.tableData.findIndex(item => {
            return item.clusterName === a[i]
          })
          index1.push(c)
        }
        // 每组的第一个曲线簇名称显示
        this.tableData = this.tableData.map((item, index) => {
          if (index1.includes(index)) {
            item.clusterNameFlag = true
          }
          return item
        })
        this.oldData = cloneDeep(this.tableData)
      }
    },
    // 修改曲线簇名称后，对应的曲线簇名称发生变化
    input({ index, value }) {
      let arr = this.tableData
        .map((item, index) => {
          if (item.clusterNameFlag) {
            return index
          }
        })
        .filter(item => item || item === 0)
      let b = arr.findIndex(item => {
        return item === index
      })
      if (index === arr[arr.length - 1]) {
        for (let i = index; i < this.tableData.length; i++) {
          this.tableData[i].clusterName = value
        }
      } else {
        for (let i = index; i < arr[b + 1]; i++) {
          this.tableData[i].clusterName = value
        }
      }
    },
    // 修改曲线簇方案后后，对应的所有曲线方案名发生变化
    planNameInput({ index, value }) {
      if (this.nameList.includes(value)) {
        this.$message.error('标准曲线簇方案名称重复')
      }
      this.tableData = this.tableData.map(item => {
        item.planName = value
        return item
      })
    },
    // 判断曲线名称是否有重复的
    curveInput({ index, value }) {
      let newName = this.tableData.filter((item, i) => !(i === index)).map(item => item.curveName)
      if (newName.includes(this.tableData[index].curveName)) {
        this.$message.error('当前标准曲线名称重复，请重新输入')
      }
    },
    // 获取曲线簇方案名称
    async getNameListFN() {
      const { data } = await getNameListAPI()
      if (this.planeName) {
        this.nameList = data.filter(item => {
          return item !== this.planeName
        })
      } else {
        this.nameList = data
      }
    }
  }
}
</script>
<style lang="scss" scope>
.box {
  display: flex;
  .son {
    flex: 1;
  }
  ::v-deep .el-input__inner {
    width: 300px;
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
}

.children {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
