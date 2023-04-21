export default {
  name: 'ItemRender',
  props: {
    type: String,
    config: Object
  },
  render: function(h) {
    switch (this.type) {
      case 'select':
        return selectItem(h, this.config)
      case 'input':
        return inputItem(h, this.config)
      case 'date':
        return dateItem(h, this.config)
      case 'time':
        return timeItem(h, this.config)
      case 'inputNumber':
        return inputNumberItem(h, this.config)
      case 'upload':
        return uploadItem(h, this.config)
      case 'cascader':
        return cascaderItem(h, this.config)
      default:
        return ''
    }
  }
}

function selectItem(h, config) {
  let {
    model,
    key,
    props,
    listeners,
    options,
    optionConfig,
    placeholder,
    syncConfig,
    slot
  } = config

  let opl = 'label'
  let opv = 'value'
  if (optionConfig) {
    if (optionConfig.label) {
      opl = optionConfig.label
    }
    if (optionConfig.value) {
      opv = optionConfig.value
    }
  }

  let opts = options()
  let ops = []
  if (opts) {
    ops = opts.map(option => {
      return h(
        'el-option',
        {
          key: option[opv],
          props: {
            label: option[opl] || option['text'],
            value: option[opv],
            disabled: option.disabled
          }
        },
        slot ? [h('span', option[opv])] : [h('span', option[opl] ? option[opl] : option['text'])]
      )
    })
  }

  let on = listeners || {}
  let pps = props || {}
  if (syncConfig) {
    pps = {
      ...pps,
      ...syncConfig()
    }
  }

  return h(
    'el-select',
    {
      props: {
        placeholder,
        ...pps,
        value: model[key]
      },
      on: {
        ...on,
        change: val => {
          model[key] = val
          if (on.change) {
            on.change(val)
          }
        }
      }
    },
    ops
  )
}

function inputItem(h, config) {
  let { model, key, props, listeners, placeholder, areaProps, syncConfig } = config
  let on = listeners || {}
  let pps = props || {}
  if (syncConfig) {
    pps = {
      ...pps,
      ...syncConfig()
    }
  }
  let area = areaProps || {}
  return h('el-input', {
    props: {
      ...pps,
      value: model[key],
      disabled: pps.disabled
    },
    attrs: {
      placeholder: placeholder || pps.placeholder || '请输入',
      ...area
    },
    on: {
      ...on,
      input: val => {
        model[key] = val
      }
    }
  })
}

function dateItem(h, config) {
  let { model, key, props, listeners, placeholder, type, syncConfig } = config
  let pps = props || {}
  if (syncConfig) {
    pps = {
      ...pps,
      ...syncConfig()
    }
  }
  let on = listeners || {}
  return h('el-date-picker', {
    props: {
      ...pps,
      value: model[key]
    },
    attrs: {
      placeholder: placeholder || pps.placeholder || '请输入',
      type: type || 'date'
    },
    on: {
      ...on,
      input: val => {
        model[key] = val
      }
    }
  })
}

function timeItem(h, config) {
  let { model, key, props, listeners, placeholder, type, syncConfig } = config
  let pps = props || {}
  if (syncConfig) {
    pps = {
      ...pps,
      ...syncConfig()
    }
  }
  let on = listeners || {}
  return h('el-time-picker', {
    props: {
      ...pps,
      value: model[key]
    },
    attrs: {
      placeholder: placeholder || pps.placeholder || '请输入',
      type: type || 'date'
    },
    on: {
      ...on,
      input: val => {
        model[key] = val
      }
    }
  })
}

function inputNumberItem(h, config) {
  let { model, key, props } = config
  let pps = props || {}
  return h('el-input-number', {
    props: {
      ...pps,
      value: model[key]
    },
    on: {
      change: val => {
        model[key] = val
      }
    }
  })
}

function uploadItem(h, config) {
  let { model, key, props, btnProps, listeners, iconProps } = config
  let pps = props || {}
  let btnProp = btnProps || {}
  let iconProp = iconProps || {}
  let on = listeners || {}
  return h(
    'el-upload',
    {
      props: {
        ...pps,
        'file-list': model[key]
      },
      on: {
        ...on
      }
    },
    [
      h(
        'el-button',
        {
          props: {
            ...btnProp,
            size: btnProp.size || 'small'
          }
        },
        [
          h('svg-icon', {
            style: iconProp.styles,
            props: {
              iconClass: iconProp.iconClass
            }
          }),
          '上传'
        ]
      )
    ]
  )
}

function cascaderItem(h, config) {
  let { model, key, props, listeners, options, optionProps } = config
  let ops = options()
  let on = listeners || {}
  let pps = props || {}
  return h('el-cascader', {
    props: {
      value: model[key],
      ...pps,
      options: ops,
      props: optionProps
    },
    on: {
      change: val => {
        model[key] = val
        if (on.change) {
          on.change(val)
        }
      }
    }
  })
}
