<template>
  <div>
    <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
    <el-table
      :data="categoryList"
      style="width:100%"
      v-loading="loading"
      element-loading-text="玩命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <!-- tree-key：指定每一个节点的key，只有指定了才能嵌套解析 -->
      <!-- level-key:指定层级 -->
      <!-- parent-key:没有指定就没办法缩起来 -->
      <!-- indent-size:指定缩进大小 -->
      <!-- child-key:通过那个属性去查找子节点，默认children -->
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        level-key="cat_level"
        :indent-size="20"
        parent-key="cat_pid"
        child-key="children"
      ></el-table-tree-column>
      <el-table-column label="是否删除" prop="cat_deleted">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? "是" : "否" }}
        </template></el-table-column
      >
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="small"
          ></el-button>

          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small"
            @click="delCategory(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total,sizes,prev, pager, next,jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :current-page="current"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <el-dialog
      title="添加商品分类"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form
        :model="addForm"
        :rules="rules"
        status-icon
        ref="addForm"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            :options="options"
            :props="props"
            change-on-select
            clearable
            v-model="addForm.cat_pid"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入element-tree-grid插件
// import Vue from 'vue'
var ElTreeGrid = require('element-tree-grid')
// Vue.component(ElTreeGrid.name, ElTreeGrid)

export default {
  data () {
    return {
      categoryList: [],
      current: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          { require: true, message: '请输入分类名称', trigger: 'change' }
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  methods: {
    // 获取分类列表
    async getCategoryList () {
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })

      let {
        meta: { status },
        data: { result, total }
      } = res.data
      if (status === 200) {
        this.categoryList = result
        this.total = total
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
    // 修改每页条数
    handleCurrentChange (val) {
      this.loading = true
      this.current = val
      this.getCategoryList()
    },
    // 修改了当前页页码
    handleSizeChange (val) {
      this.loading = true
      this.pageSize = val
      this.current = 1
      this.getCategoryList()
    },
    async showAddDialog () {
      this.addDialogVisible = true
      let res = await this.axios.get('categories?type=2')
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.options = data
      }
    },
    // 添加商品分类
    addCategory () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 校验成功
          let { cat_name: catName, cat_pid: catPid } = this.addForm
          let res = await this.axios.post('categories', {
            // 如果是一级分类，pid为0
            cat_pid: catPid[catPid.length - 1] || 0,
            cat_name: catName,
            cat_level: catPid.length
          })

          let {
            meta: { status, msg }
          } = res.data
          if (status === 201) {
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.getCategoryList()
            this.$message.success('添加商品分类成功了')
          } else {
            this.$message.error(msg)
          }
        } else {
          return false
        }
      })
    },
    // 删除商品分类
    async delCategory (row) {
      try {
        await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`categories/${row.cat_id}`)
        let {
          meta: { status, msg }
        } = res.data
        if (status === 200) {
          this.getCategoryList()
          this.$message.success('恭喜你，删除分类成功了')
        } else {
          this.$message.error(msg)
        }
      } catch (error) {
        this.$message.error('取消删除')
      }
    }
  },
  created () {
    // 获取列表的数据
    this.getCategoryList()
  },
  components: {
    // 把ElTreeGrid注册为局部组件
    'el-table-tree-column': ElTreeGrid
  }
}
</script>

<style></style>
