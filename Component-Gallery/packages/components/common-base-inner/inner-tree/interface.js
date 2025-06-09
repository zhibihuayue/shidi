const compJson = {
  name: 'BaseInnerTree',
  props: [
    {
      key: 'cameraTreeOpen',
      default: true,
      desc: '展开/收起'
    },
    {
      key: 'refreshTreeData',
      default: true,
      desc: '刷新列表'
    },
    {
      key: 'clickCollect',
      default: true,
      desc: '节点收藏'
    },
    {
      key: 'showAttrBox',
      default: true,
      desc: '显示属性弹窗'
    },
    {
      key: 'onSelectChange',
      default: true,
      desc: '列表类型切换'
    },
    {
      key: 'showCollect',
      default: true,
      desc: '显示收藏列表'
    },
    {
      key: 'getChooseType',
      default: true,
      desc: '列表显示类型过滤'
    },
    {
      key: 'inputChange',
      default: true,
      desc: '关键字过滤高亮'
    }
  ],
  // {
  //   // 组件默认支持的功能（可选）
  //   cameraTreeOpen: {
  //     key: '展开/收起'
  //   },
  //   refreshTreeData: {
  //     key: '刷新列表'
  //   },
  //   clickCollect: {
  //     key: '节点收藏'
  //   },
  //   showAttrBox: {
  //     key: '显示属性弹窗'
  //   },
  //   onSelectChange: {
  //     key: '列表类型切换',
  //     relationComp: 'BaseInnerTreeSearch'
  //   },
  //   showCollect: {
  //     key: '显示收藏列表',
  //     relationComp: 'BaseInnerTreeSearch'
  //   },
  //   getChooseType: {
  //     key: '列表显示类型过滤',
  //     relationComp: 'BaseInnerTreeSearch'
  //   },
  //   inputChange: {
  //     key: '关键字过滤高亮',
  //     relationComp: 'BaseInnerTreeSearch'
  //   }
  // },
  relation: {
    // 组件相关的组件
    components: [
      {
        compName: 'BaseInnerTreeSearch', // 相关组件名
        template:
          '@component-gallery/inner-components/inner-tree-search/InnerTreeSearch.vue'
      }
    ]
  }
}
