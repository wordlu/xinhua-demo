// import store from '@store';

export const recursion = function(menusRUles, arr) {
  if (menusRUles.length < 1) {
    return []
  }

  const newArr = arr.filter(item => {
    if (item.children) {
      item.children = item.children.filter(i => {
        if (i.children) {
          i.children = i.children.filter(t => {
            return menusRUles.includes(t.meta.id)
          })
        }
        return menusRUles.includes(i.meta.id)
      })
    }

    return menusRUles.includes(item.meta.id)
  })
  return newArr
}
