// table组件的数据处理
let newArr = []

export const tableRecursion = function(arr) {
  newArr = []
  newArr =  tableList(arr)
  return newArr
}
function  tableList(arr){
  arr.forEach(item=>{
    newArr.push(item)
    if (item.children.length>0) {
      tableList(item.children)
    }
  })
  return newArr
}