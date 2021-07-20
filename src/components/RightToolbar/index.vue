<template>
  <div class="top-right-btn" :class="{mr7:mr7}">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="刷新" placement="top">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="显隐列" placement="top" v-if="columns">
        <el-popover
          placement="bottom"
          width="200"
          trigger="click">
          <el-table
            :data="columns"
            ref="multipleTable"
            tooltip-effect="dark"
            style="width: 100%"
            @select-all="dataChangeAll"
            @select="dataChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="参数"
              prop="label"
            >
            </el-table-column>
          </el-table>
          <el-button size="mini" slot="reference" style="margin-left:7px" circle icon="el-icon-menu" @click="handleClick"/>
        </el-popover>
      </el-tooltip>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "RightToolbar",
  data() {
    return {
      // 显隐数据
      value: [],
      // 弹出层标题
      title: "显示/隐藏",
    };
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
    },
    mr7: {
      type: Boolean,
      default: false,
    }
  },
  created() {
    // 显隐列初始默认隐藏列
    for (let item in this.columns) {
      if (this.columns[item].visible === false) {
        this.value.push(parseInt(item));
      }
    }
  },
  methods: {
    // 搜索
    toggleSearch() {
      this.$emit("update:showSearch", !this.showSearch);
    },
    // 刷新
    refresh() {
      this.$emit("queryTable");
    },
    // 右侧列表元素变化
    dataChange(data,row) {
      for (var item in this.columns) {
        const key = this.columns[item].key;
        if (key === row.key) this.columns[item].visible = !row.visible
      }
    },
    dataChangeAll(data){
      for (var item in this.columns) {
        this.columns[item].visible = data.length !== 0
      }
    },
    handleClick(){
      this.columns.forEach(row => {
        if (row.visible) {
          this.$refs.multipleTable.toggleRowSelection(row,true);
        } else {
          this.$refs.multipleTable.toggleRowSelection(row,false);
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-transfer__button {
  border-radius: 50%;
  padding: 12px;
  display: block;
  margin-left: 0px;
}
::v-deep .el-transfer__button:first-child {
  margin-bottom: 10px;
}
.mr7{
  margin-right: 7px;
}
</style>
