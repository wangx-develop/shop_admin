<template>
  <div>
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <!-- tabs组件 -->
    <el-tabs v-model="activeName" tab-position="left" @tab-click="change">
      <el-tab-pane name="basic" label="基本信息">
        <el-form :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="options"
              v-model="form.goods_cat"
              :props="props"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="form.is_promote" :label="true">是</el-radio>
            <el-radio v-model="form.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="pic" label="商品图片">
        <!--action：图片上传地址  -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture"
          :headers="headers"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
        >
          <el-button
            size="
                   small"
            type="primary"
            >点击上传</el-button
          >
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="content" label="商品内容">
        <quill-editor v-model="form.goods_introduce"> </quill-editor>
        <el-button type="primary" @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeName: 'basic',
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: false,
        pics: [],
        goods_introduce: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      headers: {
        // 上传图片需要token
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    change (tab) {
      this.active = +tab.index
    },
    next (active, activeName) {
      // 去下一页
      this.active = active
      this.activeName = activeName
    },
    handleSuccess (response, file, fileList) {
      // 通过response获取到上传成功后的图片的地址
      this.form.pics.push({
        pic: response.data.tmp_path
      })
    },
    handleRemove (file) {
      let tempPath = file.response.data.tmp_path
      let idx = this.form.pics.findIndex(item => item.pic === tempPath)
      this.form.pics.splice(idx, 1)
    },
    async addGood () {
      console.log('1111')
      let res = await this.axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      console.log(res)

      let {
        meta: { status }
      } = res.data
      if (status === 201) {
        this.$message.success('添加成功')
        this.$router.push('/goods')
      }
    }
  },
  async created () {
    let res = await this.axios.get('categories?type=3')
    let {
      meta: { status },
      data
    } = res.data
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang="less" scoped>
.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 300px;
  }
}
</style>
