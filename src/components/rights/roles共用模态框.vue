<template>
  <div class="roles">

    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="success"
               plain
               @click="showAddDialog">添加角色
    </el-button>

    <el-table :data='roleList'
              style="width:100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-if="scope.row.children.length === 0">
            <span>暂无权限</span>
          </el-row>
          <!-- 1级权限 -->
          <el-row class="level1"
                  v-for="level1 in scope.row.children"
                  :key="level1.id">
            <el-col :span="4">
              <el-tag closable>{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 2级权限 -->
            <el-col :span="20">
              <el-row class="level2"
                      v-for="level2 in level1.children"
                      :key="level2.id">
                <el-col :span="4">
                  <el-tag closable
                          type="success">{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 3级权限 -->
                <el-col :span="20">
                  <el-tag class="level3"
                          v-for="level3 in level2.children"
                          :key="level3.id"
                          type="danger"
                          closable>{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type='index'></el-table-column>
      <el-table-column prop="roleName"
                       label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc"
                       label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     plain
                     size="small"
                     @click="showEditDialog(scope.row)"></el-button>

          <el-button type="danger"
                     icon="el-icon-delete"
                     plain
                     size="small"
                     @click="delRole(scope.row)"></el-button>

          <el-button type="success"
                     icon="el-icon-check"
                     plain
                     size="small">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title"
               :visible.sync="addDialogVisible"
               width="40%">
      <!-- 表单 -->
      <el-form :model="addForm"
               :rules="rules"
               status-icon
               ref="addForm"
               label-width='80px'>
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述"
                      prop='roleDesc'>
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色的名称', trigger: 'blur' }
        ]
      },
      title: '添加角色'
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      // 获取所有的角色列表
      let res = await this.axios.get('roles')
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.roleList = data
        console.log(this.roleList)
      }
    },

    async delRole (row) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${row.id}`)
        let { meta: { status } } = res.data
        if (status === 200) {
          this.$message.success('恭喜你，删除角色成功了')
          this.getRoleList()
        } else {
          this.$message.error('删除角色失败')
        }
      } catch (error) {
        this.$message.error('取消删除')
      }
    },

    showAddDialog () {
      this.addDialogVisible = true
      this.title = '添加角色'
      this.addForm = {
        roleName: '',
        roleDesc: ''
      }
    },
    confirm () {
      if (this.addForm.id) {
        this.editRole()
      } else {
        this.addRole()
      }
    },

    async addRole () {
      let res = await this.axios.post('roles', this.addForm)
      let { meta: { status } } = res.data
      if (status === 201) {
        this.addDialogVisible = false

        this.$refs.addForm.resetFields()

        this.getRoleList()

        this.$message.success('恭喜你，添加角色成功')
      } else {
        this.$message.error('添加角色失败')
      }
    },

    showEditDialog (row) {
      this.addDialogVisible = true
      this.addForm = row
      this.title = '修改角色'
    },
    async editRole () {
      let res = await this.axios.put(`roles/${this.addForm.id}`, this.addForm)
      let { meta: { status } } = res.data
      if (status === 200) {
        this.addDialogVisible = false

        this.$refs.addForm.resetFields()

        this.getRoleList()

        this.$message.success('恭喜你，修改角色成功')
      } else {
        this.$message.error('修改角色失败')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.level1 {
  // margin-bottom: 15px;
  .level2 {
    margin-bottom: 10px;
    .level3 {
      margin-right: 10px;
      margin-bottom: 5px;
    }
  }
}
</style>
