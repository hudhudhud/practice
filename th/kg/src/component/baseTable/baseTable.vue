<template>
      <el-table :data="list" @selection-change="handleSelectionChange"  v-bind="$attrs" highlight-current-row>
        <template v-for="(column, index) in columns">
          <slot name="front-slot"> </slot>
          <!-- 复选框 -->
          <el-table-column :key="index" v-if="column.type === 'selection'" type="selection" width="55"> </el-table-column>
          <!-- 序号 -->
          <el-table-column :key="index" v-else-if="column.type === 'index'" type="index" width="50" label="序号"> </el-table-column>
          <!-- 具体内容 -->
          <el-table-column :key="index" v-else-if="!column.hidden" align="left" :label="column.title" :width="column.width" >
            <template slot-scope="scope">
              <!-- 仅仅显示文字 -->
                <!-- 操作按钮 -->
                <label v-if="column.type === 'operate'">
                  <a  class="operate-button" v-for="(operate, index) in column.operates" :key="index" @click="handleClick(operate, scope.row)">
                    {{operate.name}}
                    &nbsp;&nbsp;
                  </a>
                </label>
                 <!-- 使用slot的情况下 -->
                <label v-else-if="column.slot">
                  <!-- 具名slot 如果没指定列或者列是有值的，那就用slot，否则没值按空列显示 -->
                  <template v-if="!column.key||isValue(scope.row[column.key])">
                    <slot v-if="column.slot" :name="column.slot" :scope="scope"></slot>
                  </template>
                  <template v-else>
                     - -
                  </template>
                </label>
                <span v-else>
                  {{isValue(scope.row[column.key])?scope.row[column.key]:'- -'}}
                </span>
            </template>
          </el-table-column>
        </template>
        <!--默认的slot -->
        <slot/>
      </el-table>
</template>

<script>
export default {
  name: 'base-table',
  props: {
    // 核心数据
    list: {
      type: Array,
      default: () => []
    },
    // columns
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    selection:{
      type:Boolean,
      default:false
    }
  },
  data () {
    return {
      tableHeight: 200
    }
  },
  methods: {
    // 处理点击事件
    handleClick(action, data) {
      // emit事件
      this.$emit(`${action.emitKey}`, data)
    },
    handleSelectionChange(data){
        this.$emit(`selection-change`, data)
    },
    isValue(val){
      if(val!==null&&val!==undefined&&val!=='')
        return true
      return false
    }
  }
}
</script>
