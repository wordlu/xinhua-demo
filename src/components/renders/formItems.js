// 输入框
export function createdElementInput (opers) {
    return function (h, {record, prop}) {
        if (record.edit) {
            return h('el-input', {
                props: {
                    value: record[prop],
                    ...opers.props
                },
                on: {
                    change: (value) => opers.event(record, prop, value)
                }
            }, '');
        } else {
            return h('span', {
            }, record[prop]);
        }
    };
};
// 下拉框
export function createdElementSelect (opers) {
    return function (h, {record, prop}) {
        if (record.edit) {
            let options = opers.data().map((item) => {
                return h('el-option', {
                    props: {
                        value: item[opers.alias.value],
                        key: item[opers.alias.label],
                        label: item[opers.alias.label]
                    }
                });
            });
            return h('el-select', {
                props: {
                    value: record[prop],
                    ...opers.props
                },
                on: {
                    change: (value) => opers.event(record, prop, value)
                }
            }, options);
        } else {
            return h('span', {
            }, record[prop]);
        }
    };
};
// 日期选择
export function createdElementDate (opers) {
    return function (h, {record, prop}) {
        if (record.edit) {
            return h('el-date-picker', {
                props: {
                    value: record[prop],
                    ...opers.props
                },
                on: {
                    input: (value) => opers.event(record, prop, value)
                }
            }, '');
        } else {
            return h('span', {
            }, record[prop]);
        }
    };
};
// 多选框
export function createdElementCheck (opers) {
    return function (h, {record, prop}) {
        if (record.edit) {
            return h('el-checkbox-group', {
                value: record[prop],
                ...opers.props
            }, opers.data.map(item => {
                return h('el-checkbox', {
                    props: {
                        label: item.text,
                        name: item.type
                    },
                    on: {
                        change: (value) => item.event(record, prop, value)
                    }
                }, item.text);
            }));
        } else {
            return h('span', {
            }, record[prop]);
        }
    };
};
// 单选框
export function createdElementRadio (opers) {
    return function (h, {record, prop}) {
        if (record.edit) {
            return h('el-radio-group', {
                value: record[prop],
                ...opers.props
            }, opers.data.map(item => {
                return h('el-radio', {
                    props: {
                        label: item.text,
                        name: item.type
                    },
                    on: {
                        change: (value) => item.event(record, prop, value)
                    }
                }, item.text);
            }));
        } else {
            return h('span', {
            }, record[prop]);
        }
    };
};
// 开关
export function createdElementSwitch (opers) {
    return function (h, {record, prop}) {
        return h('el-switch', {
            props: {
                value: record[prop],
                ...opers.props
            },
            on: {
                click: (value) => opers.props.event(record, prop, value)
            }
        }, '');
    };
};
// 按钮
export function createdElementButton (opers) {
    return function (h, {record, prop}) {
        return h('div', {}, opers.data.map(item => {
            return h('el-button', {
                props: {
                    type: 'text',
                    ...opers.props
                },
                on: {
                    click: (value) => item.event(record, prop, value)
                }
            }, item.text);
        }));
    };
};
