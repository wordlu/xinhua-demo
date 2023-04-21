let returnData = []
const FN = function(data, newData) {
  if (newData.length === 0) {
    returnData = []
  }
  data.forEach(item => {
    returnData.push(item.id)
    if (item.children.length > 0) {
      // let newCode = item.children.map(item => item.id)
      // let flag = false
      // newCode.forEach(item=>{

      // })
      FN(item.children, [1])
    }
  })
  return Array.from(new Set(returnData))
}
export const recursion = function(data, code) {
  const newData = []
  return FN(data, newData)
}
