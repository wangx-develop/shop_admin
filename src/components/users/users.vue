<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-input placeholder="请输入内容"
              v-model="query"
              class="input-with-select">
      <el-button @click="search"
                 slot="append"
                 icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="success"
               plain
               @click="showAddDialog">添加用户</el-button>
    <!-- 表格 -->
    <!-- data表格获取的数据 -->
    <!-- el-table-column表格的一列 -->
    <!-- prop对应列内容的字段名 -->
    <!-- label表头的描述信息 -->
    <el-table :data="userList"
              style="width: 100%">
      <el-table-column prop="username"
                       label="姓名"
                       width="200">
      </el-table-column>
      <el-table-column prop="email"
                       label="邮箱"
                       width="200">
      </el-table-column>
      <el-table-column prop="mobile"
                       label="电话"
                       width="200">
      </el-table-column>
      <el-table-column label="用户状态"
                       width="200">
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-switch v-model="scope.row.mg_state"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     @change="changeState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 如果想要自己定义表格某一列显示的内容 -->
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
                     @click="deleteUser(scope.row)"></el-button>

          <el-button type="success"
                     icon="el-icon-check"
                     plain
                     size="small"
                     @click="showAssignDialog(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- layout="total, sizes, prev, pager, next, jumper" -->
    <el-pagination background
                   layout="total,sizes,prev, pager, next,jumper"
                   :total="total"
                   :page-size="pageSize"
                   :page-sizes="[2,4,6,8]"
                   :current-page="current"
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange">
    </el-pagination>

    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="40%">
      <!-- 表单 -->
      <el-form :model="addForm"
               :rules="rules"
               status-icon
               ref="addForm"
               label-width='80px'>
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop='password'>
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop='email'>
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      prop='mobile'>
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户"
               :visible.sync="editDialogVisible"
               width="40%">
      <!-- 表单 -->
      <el-form :model="editForm"
               :rules="rules"
               status-icon
               ref="editForm"
               label-width='80px'>
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop='email'>
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      prop='mobile'>
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色"
               :visible.sync="assignDialogVisible"
               width="40%">
      <!-- 表单 -->
      <el-form :model="assignForm"
               status-icon
               ref="editForm"
               label-width='80px'>
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid"
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script>
export default {
  data () {
    return {
      // 查询关键字
      query: '',

      // 当前页
      current: 1,

      // 每页的条数
      pageSize: 2,

      // 总笔数
      total: 0,

      // 保存表格需要的数据
      userList: [],

      // 添加的对话框是否显示
      addDialogVisible: false,

      // 手机添加用户的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单校验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 9, message: '用户名长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 12, message: '密码长度在 6 到 12 个字符', trigger: 'change' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'change' }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的电话', trigger: 'change' }
        ]
      },
      // 控制修改对话框是否显示
      editDialogVisible: false,
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      assignDialogVisible: false,
      assignForm: {
        id: '', // 用户id
        username: '', // 用户名
        rid: ''// 用户角色id
      },
      // 存放角色列表
      options: []

    }
  },
  methods: {
    // 用于获取用户列表数据
    async getUserList () {
      // 发送ajax请求,在main.js中已经把axios方法加入了Vue原型中
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      let { data: { users, total }, meta: { status } } = res.data
      if (status === 200) {
        this.userList = users
        this.total = total
      }
    },
    // 修改当前页
    handleCurrentChange (val) {
      // console.log(val)
      this.current = val
      this.getUserList()
    },
    // 修改每页显示的条数
    handleSizeChange (val) {
      this.pageSize = val
      // 修改当前页为第一页
      this.current = 1
      this.getUserList()
    },
    // 搜素功能
    search () {
      this.getUserList()
    },
    // 改变状态
    async changeState (row) {
      let res = await this.axios({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: 'put'
      })
      // meta=res.data.meta
      // data =res.data.data
      // let { data, meta } = res.data
      // let { meta } = res.data
      // if (meta.status === 200) {
      let { meta: { status } } = res.data
      if (status === 200) {
        this.$message.success('修改状态成功')
      } else {
        this.$message.error('修改失败')
      }
    },
    // 删除用户
    async deleteUser (row) {
      // 发送axios请求删除用户
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        let res = await this.axios.delete(`users/${row.id}`)

        let { meta: { status } } = res.data
        if (status === 200) {
          this.$message.success('删除用户成功')
          // 重新渲染
          if (this.userList.length === 1 && this.current > 1) {
            this.current--
          }
          this.getUserList()
        } else {
          this.$message.danger('删除用户失败')
        }
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 显示添加用户模态框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 添加用户
    addUser () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 成功
          let res = await this.axios.post('users', this.addForm)

          console.log(res)
          let { meta: { status } } = res.data
          if (status === 201) {
            this.$message.success('添加成功')
            // 清空表单内容
            this.$refs.addForm.resetFields()
            // 关闭模态框
            this.addDialogVisible = false

            this.total++
            this.current = Math.ceil(this.total / this.pageSize)
            // 重新渲染
            this.getUserList()
          } else {
            this.$message.error('添加用户失败')
          }
        } else {
          // 失败
          console.log('失败')
          return false
        }
      })
    },
    showEditDialog (row) {
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile

      this.editDialogVisible = true
    },
    // 修改用户
    // editUser () {
    //   this.$refs.editForm.validate(valid => {
    //     if (valid) {
    //       // 发送axios请求
    //       this.axios.put(`users/${this.editForm.id}`, {
    //         email: this.editForm.email,
    //         mobile: this.editForm.mobile
    //       }).then(res => {
    //         this.$message.success('修改成功')
    //         let { meta: { status } } = res.data
    //         if (status === 200) {
    //           // 关闭模态框
    //           this.editDialogVisible = false
    //           this.$refs.editForm.resetFields()
    //           this.getUserList()
    //         } else {
    //           this.$message.error('修改失败')
    //         }
    //       })
    //     } else {
    //       return false
    //     }
    //   })
    // }
    editUser () {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          // 发送axios请求
          let res = await this.axios.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })

          this.$message.success('修改成功')
          let { meta: { status } } = res.data
          if (status === 200) {
            // 关闭模态框
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.getUserList()
          } else {
            this.$message.error('修改失败')
          }
        } else {
          return false
        }
      })
    },
    // 显示分配角色对话框
    async showAssignDialog (user) {
      this.assignDialogVisible = true
      this.assignForm.id = user.id
      this.assignForm.username = user.username

      // 获取用户角色id
      let res = await this.axios.get(`users/${user.id}`)
      let { meta: { status }, data } = res.data

      if (status === 200) {
        if (data.rid === -1) {
          this.assignForm.rid = ''
        } else {
          this.assignForm.rid = data.rid
        }
      }

      // 获取角色列表信息
      this.getRoleList()
    },
    // 获取角色列表信息
    async getRoleList () {
      let res = await this.axios.get('roles')
      let { meta: { status }, data } = res.data
      if (status === 200) {
        this.options = data
      }
    },
    async assignRole () {
      if (!this.assignForm.rid) {
        this.$message.error('请选择一个角色')
        return
      }

      let res = await this.axios.put(`users/${this.assignForm.id}/role`, {
        rid: this.assignForm.rid
      })

      let { meta: { status } } = res.data
      if (status === 200) {
        this.assignDialogVisible = false
        this.getUserList()
        this.$message.success('分配角色成功')
      }
    }

  },
  created () {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.input-with-select {
  width: 300px;
  margin-bottom: 5px;
}
</style>
