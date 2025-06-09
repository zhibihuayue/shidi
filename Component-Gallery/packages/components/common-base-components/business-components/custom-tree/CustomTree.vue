<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<!-- eslint-disable -->
<template>
  <div v-loading="loading" class="custom-tree-box">
    <div v-if="dataSource?.length && !rootNode.includes('(0)') && nodeStatusOfShow" class="root-node">
      <span>{{rootNode}}</span>
      <span>
        <em
          class="iconfont icon-jilianicon"
          title="展开/收起"
          @click="emitExpand"
        />
        <em
          class="iconfont icon-shuaxinicon"
          title="刷新"
          @click="refresh"
        />
      </span>

    </div>
    <el-scrollbar class="scrollbar">
      <el-tree
        ref="tree"
        :data="dataSource"
        :filter-node-method="filterNode"
        :indent="6"
        :props="config"
        :default-expand-all="expandStatus"
        :default-expanded-keys="dataSource.length ? ['100000'] : []"
        class="c-tree oafData-list-tree custom-tree-ref"
        node-key="code"
        v-if="renderStatus"
      >
        <div
          slot-scope="{ data }"
          :class="{ checked: data.checked }"
          class="custom-tree-node"
          @click="clickNode(data)"
        >
          <slot
            :data="data"
            :filterTree="filterTree"
            :emitExpand="emitExpand"
          ></slot>
        </div>
      </el-tree>
    </el-scrollbar>

  </div>
</template>

<script>
export default {
  name: 'CustomTree',

  props: {
    rootNode: {
      type: String,
      default: '中国'
    },
    expandStatus: {
      type: Boolean,
      default: true
    },
    filterKeywords: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => ({ label: 'name', children: 'list' })
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    treeNodeList: [],
    // 是否为收藏视图
    isCollectView: {
      type: Boolean,
      default: false
    },
    filterNode: {
      type: Function,
      default: () => ({}),
      required: true
    }
  },
  watch: {
    // 根据关键字过滤树
    filterKeywords(val) {
      this.filterTree()
      if (!val) {
        this.emitExpand({
          flag: true
        })
      }
    },
    // 根据收藏标识过滤树
    isCollectView(val) {
      this.filterTree()
    }
  },
  data() {
    return {
      loading: false,
      renderStatus: true,
      nodeStatusOfShow: true
    }
  },

  methods: {
    clickNode(data, checked = !data.checked, flag) {
      if (data.level !== '5') return
      this.treeNodeList.forEach((item) => {
        this.$set(item, 'checked', false)
      })
      this.$set(data, 'checked', checked)
      this.$emit('nodeClick', { data })
    },
    refresh() {
      this.$emit('refresh')
    },
    /**
     * 古树名木 收藏
     */
    emitCollect(data) {
      this.$emit('collectCallback', { data, fn: this.filterTree })
    },
    doOafDataTreeExpandAll() {
      console.log('doOafDataTreeExpandAll')
    },
    filterTree() {
      this.$nextTick(() => {
        this.$refs.tree?.filter(this.filterKeywords)
        let nodesMap = this.$refs.tree.store.nodesMap
        let step = 0
        for (let key in nodesMap) {
          if (nodesMap[key].visible) {
            step += 1
          }
        }
        this.nodeStatusOfShow = step > 0 ? true : false
      })
    },
    emitExpand(data) {
      const { flag } = data
      let nodesMap = this.$refs.tree.store.nodesMap
      // 判断当前项是否展开，如果展开，则将所有节点折叠到二级节点
      for (let key in nodesMap) {
        // 判断节点的深度是否大于等于2，将深度大于2的节点折叠
        if (nodesMap[key].level >= 1) {
          nodesMap[key].expanded = flag ? this.expandStatus : !this.expandStatus
        }
      }
      if (!flag) {
        this.$emit('update:expandStatus', !this.expandStatus)
      }
      this.$refs.tree?.filter(this.filterKeywords)
    },
    setCurrentKey(key) {
      this.$refs.tree?.setCurrentKey(key)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './custom-tree';
</style>
