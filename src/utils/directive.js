import store from '@store'

const directivePlugin = Vue => {
  Vue.directive('btnShow', {
    inserted(el, binding) {
      const { value } = binding
      const points = store.state.user.btnId
      if (!points.includes(value) && value !== undefined) {
        el.parentNode.removeChild(el)
      }
    }
  })
  Vue.directive('disBtn', {
    inserted(el, binding) {
      const { value } = binding
      const points = store.state.user.btnId
      if (!points.includes(value) && value !== undefined) {
        el.disabled = true
        el.style.color = '#C0C4CC'
        el.style.cursor = 'not-allowed'
      }
    }
  })
}
export default directivePlugin
