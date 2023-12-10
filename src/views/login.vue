<template>
  <div>
    <Dialog
      :visible="dialogConfig.visible"
      :title="title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.visible = false"
    >
      <el-form
        class="login-register"
        :model="formData"
        :rules="rules"
        ref="form"
        @submit.prevent
      >
        <el-form-item prop="email">
          <el-input
            size="large"
            clearable
            placeholder="请输入邮箱"
            v-model.trim="formData.email"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 登录密码 -->
        <el-form-item prop="password" v-if="onType === 1">
          <el-input
            size="large"
            show-password
            placeholder="请输入密码"
            v-model.trim="formData.password"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 注册 -->
        <template v-if="onType === 0 || onType === 2">
          <el-form-item prop="emailCode">
            <div class="send-email-panel">
              <el-input
                size="large"
                clearable
                placeholder="请输入邮箱验证码"
                v-model.trim="formData.emailCode"
              >
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span>
                </template>
              </el-input>
              <el-button type="primary" size="large" class="email-btn"
                >获取验证码</el-button
              >
            </div>
            <el-popover placement="left" :width="450" trigger="click">
              <div>
                <p>1、在垃圾箱中查找邮箱验证码</p>
                <p>
                  2、在邮箱中 头像->设置->反垃圾->白名单->设置邮件地址白名单
                </p>
                <p>3、将邮箱[ xxx@qq.com ]添加到白名单</p>
              </div>
              <template #reference>
                <a href="javascript:void(0)">未收到验证码？</a>
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item prop="nickName" v-if="onType === 0">
            <el-input
              size="large"
              clearable
              placeholder="请输入昵称"
              v-model.trim="formData.nickName"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="registerPassword">
            <el-input
              size="large"
              show-password
              placeholder="请输入密码"
              v-model.trim="formData.registerPassword"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="reRegisterPassword">
            <el-input
              size="large"
              show-password
              placeholder="请再次输入密码"
              v-model.trim="formData.reRegisterPassword"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
        </template>

        <!-- 验证码 -->
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              size="large"
              clearable
              placeholder="请输入验证码"
              v-model.trim="formData.checkCode"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
              :src="checkCodeUrl"
              class="check-code"
              @click="changeCheckCode(0)"
            />
          </div>
        </el-form-item>

        <el-form-item v-if="onType === 1">
          <div class="remember-panel">
            <el-checkbox v-model="formData.rememberMe"> 记住我 </el-checkbox>
          </div>
          <div class="no-account">
            <a href="javascript:void(0)" @click="showPanel(2)">忘记密码？</a>
            <a href="javascript:void(0)" @click="showPanel(0)">没有账号？</a>
          </div>
        </el-form-item>
        <el-form-item v-if="onType === 0">
          <a href="javascript:void(0)" @click="showPanel(1)"
            >已有账号!</a
          ></el-form-item
        >
        <el-form-item v-if="onType === 2">
          <a href="javascript:void(0)" @click="showPanel(1)"
            >去登录？</a
          ></el-form-item
        >
        <el-form-item>
          <el-button type="primary" class="login-btn">登录</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  watch,
  nextTick,
  computed,
} from "vue";
import { useRoute, useRouter } from "vue-router";
defineExpose({ showPanel });

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
// 0：注册 1：登录 2：找回密码
const onType = ref();

const formData = ref({});
const form = ref();

// TODO：优化这个api(放数据模型类 或者 接口文件)
const api = {
  checkCode: "/api/checkCode",
};
const title = computed(() => {
  if (onType.value === 0) {
    return "注册";
  } else if (onType.value === 1) {
    return "登录";
  } else {
    return "重置密码";
  }
});
const rules = {
  title: [{ required: true, message: "请输入内容" }],
};
const dialogConfig = reactive({
  visible: false,
});

watch(
  [() => dialogConfig.visible, () => onType.value],
  ([dialogConfig, onType]) => {
    if (dialogConfig.visible || onType.value) return;

    nextTick(() => {
      // 重置验证码 (防止输入正确的验证码却出错的情况) / 重置表单
      changeCheckCode(0);
      form.value.resetFields();
    });
  }
);

// 验证码
const checkCodeUrl = ref(api.checkCode);

function changeCheckCode(type) {
  checkCodeUrl.value =
    api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
}

function showPanel(type) {
  onType.value = type;
  dialogConfig.visible = true;
}
</script>

<style lang="scss" scoped>
.login-register {
  .send-email-panel {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .email-btn {
      margin-left: 10px;
    }
  }
  .check-code-panel {
    display: flex;
    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .remember-panel {
    width: 100%;
  }
  .no-account {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
