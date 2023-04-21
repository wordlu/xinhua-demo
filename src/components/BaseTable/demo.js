import BaseTable from '@components/BaseTable';
export default {
  title: '多级表头',
  code: `
  <base-table-panel
    :data-source="dataList"
    :columns="columns"
    :current-page="page"
    :page-size="limit"
  ></base-table-panel>

  import BaseTablePanel from '@components/BaseTablePanel';
  export default {
    data() {
      return {
        page: 1,
        limit: 10,
        dataList: [
          {
            id: '001',
            name: '张三',
            firstName: '张',
            lastName: '三',
            address: '北京北京市朝阳区青年路',
            province: '北京',
            city: '北京市',
            region: '朝阳区',
            road: '青年路'
          }
        ],
        columns: [
          {
            label: '序号',
            prop: 'id',
            type: 'index'
          },
          {
            label: '名称',
            children: [
              {
                label: '姓',
                prop: 'firstName'
              },
              {
                label: '名',
                prop: 'lastName'
              }
            ]
          },
          {
            label: '地址',
            children: [
              {
                label: '省',
                prop: 'province'
              },
              {
                label: '市',
                prop: 'city'
              },
              {
                label: '县',
                prop: 'region'
              },
              {
                label: '街道',
                prop: 'road'
              }
            ]
          }
        ]
      }
    }
  }
  `,
  props: [
    {
      code: 'columns',
      desc: '列',
      type: 'Array',
      defaultValue: '[]'
    },
    {
      code: 'label',
      desc: '表头显示内容',
      type: 'string',
      defaultValue: '-'
    },
    {
      code: 'prop',
      desc: '列的属性',
      type: 'string',
      defaultValue: '-'
    },
    {
      code: 'children',
      desc: '列的子集，如有二级或多级表头可设置',
      type: 'Array',
      defaultValue: '[]'
    }
  ]
};
const TableColumnDemo = {
  components: {
    BaseTable
  },
  data() {
    return {
      page: 1,
      limit: 10,
      dataList: [
        {
          id: '001',
          name: '张三',
          firstName: '张',
          lastName: '三',
          address: '北京北京市朝阳区青年路',
          province: '北京',
          city: '北京市',
          region: '朝阳区',
          road: '青年路'
        }
      ],
      columns: [
        {
          label: '序号',
          prop: 'id',
          type: 'index'
        },
        {
          label: '名称',
          children: [
            {
              label: '姓',
              prop: 'firstName'
            },
            {
              label: '名',
              prop: 'lastName'
            }
          ]
        },
        {
          label: '地址',
          children: [
            {
              label: '省',
              prop: 'province'
            },
            {
              label: '市',
              prop: 'city'
            },
            {
              label: '县',
              prop: 'region'
            },
            {
              label: '街道',
              prop: 'road'
            }
          ]
        }
      ]
    };
  },
  render() {
    return (
      <base-table
        data-source={this.dataList}
        columns={this.columns}
      ></base-table>
    );
  }
};

export { TableColumnDemo };
