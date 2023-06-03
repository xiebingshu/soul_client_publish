<template>
  <div>
    <el-upload
        class="upload-demo"
        action="//jsonplaceholder.typicode.com/posts/"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">只能上传 mp4 文件</div>
    </el-upload>
    <video
        :src="videoUrl"
        controls
        autoplay
        class="video-player"
        ></video>

  </div>
</template>

<script>
export default {
  data() {
    return {
      videoUrl: ''
    }
  },
  methods: {
    beforeUpload(file) {
      const isMp4 = file.type === 'video/mp4';
      if (!isMp4) {
        this.$message.error('只能上传 mp4 格式的视频文件');
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file); // 将文件转换成 base64 编码
        reader.onload = e => {
          this.videoUrl = e.target.result;
          console.log(this.videoUrl)
        };
      }
      return isMp4;
    },
    handleSuccess(response, file, fileList) {
      this.$message.success(`${file.name} 上传成功`);
    }
  }
}
</script>

<style scoped>
.upload-demo {
  margin-top: 20px;
}

.video-player {
  width: 100%;
  height: 500px;
}
</style>
