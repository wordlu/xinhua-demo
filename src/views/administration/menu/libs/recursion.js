export const recursion = data => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].children.length > 0) {
      recursion(data[i].children)
    }
    data[i].code = data[i].id
  }
  return data
}
