<template>
  <el-config-provider :locale="locale" :message="config">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import { reactive } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
// 配置 i8n 多语言 (分页的语言)
const locale = zhCn;
// 限制最多 message提示框 数量
const config = reactive({
  max: 3,
});
</script>

<style scoped></style>
