export function authActionRender(opers) {
  return function (h, {
    record
  }) {
    return h(
      'div', {},
      opers.map((item, index) => {
        if (!item.hidden || !item.hidden(record)) {
          let btnProps = {
            type: 'text',
            size: 'small'
          };
          if (item.disabled) {
            btnProps.disabled = item.disabled instanceof Function ? item.disabled(record) : item.disabled;
          }

          let btn = h(
            'span', {
              props: {
                code: item.code,
                key: `${item.code}_&${index}`
              }
            },
            [
              h(
                'el-button', {
                  props: btnProps,
                  style: item.style,
                  on: {
                    click: () => item.onClick(record)
                  }
                },
                item.text
              )
            ]
          );

          if (index + 1 > 0 && index + 1 < length) {
            let span = h(
              'span', {
                style: {
                  padding: '0 4px'
                }
              },
              '|'
            );
            return [btn, span];
          } else {
            return btn;
          }
        }
      })
    );
  };
}

export function actionRender(opers) {
  let length = opers.length;
  return function (h, {
    record
  }) {
    return h(
      'div', {},
      opers.map((item, index) => {
        if (!item.hidden || !item.hidden(record)) {
          let btn = h(
            'el-button', {
              props: {
                type: 'text',
                size: 'small'
              },
              on: {
                click: () => item.onClick(record)
              }
            },
            item.text
          );
          let span = h(
            'span', {
              style: {
                padding: '0 4px'
              }
            },
            '|'
          );
          if (index + 1 > 0 && index + 1 < length) {
            return [btn, span];
          } else {
            return btn;
          }
        }
      })
    );
  };
}
