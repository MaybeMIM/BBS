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
            maxLength="150"
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
              <el-button
                type="primary"
                size="large"
                class="email-btn"
                @click="getEmailCode"
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
              maxLength="120"
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
            >已有账号？</a
          ></el-form-item
        >
        <el-form-item v-if="onType === 2">
          <a href="javascript:void(0)" @click="showPanel(1)"
            >去登录？</a
          ></el-form-item
        >
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="submit">{{
            title
          }}</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog
      :visible="SendMailCode.visible"
      :title="SendMailCode.title"
      :buttons="SendMailCode.buttons"
      width="400px"
      :showCancel="false"
      @close="SendMailCode.visible = false"
    >
      <el-form
        :model="codeFormDate"
        :rules="rules"
        ref="codeForm"
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="邮箱">
          {{ formData.email }}
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <div class="check-code-panel">
            <el-input
              size="large"
              placeholder="请输入验证码"
              v-model.trim="codeFormDate.checkCode"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
              :src="checkCodeUrl4SendMailCode"
              class="check-code"
              @click="changeCheckCode(1)"
            />
          </div>
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
import Message from "@/utils/message";
import Verify from "@/utils/verify";
import md5 from "js-md5";
import store from "@/store";
defineExpose({ showPanel });

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
// 0：注册 1：登录 2：找回密码
const onType = ref();

const formData = ref({});
const form = ref();
// 邮箱验证码
const codeFormDate = ref({});
const codeForm = ref();

// 登录注册弹框
const dialogConfig = reactive({
  visible: false,
});
// 发生邮箱验证码弹框
const SendMailCode = reactive({
  visible: false,
  title: "发生邮箱验证码",
  buttons: [
    {
      type: "primary",
      text: "发生验证码",
      click: () => {
        sendEmailCode();
      },
    },
  ],
});

// TODO：优化这个api(放数据模型类 或者 接口文件)
const api = {
  checkCode: "/api/checkCode", // 图片验证码
  sendEmailCode: "/sendEmailCode", // 邮箱验证码
  register: "/register",
  login: "/login",
  resetPwd: "/resetPwd", //重置密码
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
  email: [
    { required: true, message: "请输入邮箱" },
    { validator: Verify.email, message: "请输入正确的邮箱" },
  ],
  password: { required: true, message: "请输入密码" },
  emailCode: { required: true, message: "请输入邮箱验证码" },
  nickName: { required: true, message: "请输入昵称" },
  registerPassword: [
    { required: true, message: "请输入密码" },
    {
      validator: Verify.password,
      message: "密码只能是数字、字母、特殊字符, 8-16位",
    },
  ],
  reRegisterPassword: [
    { required: true, message: "请再次输入密码" },
    {
      validator: checkRePassword,
      message: "两次输入的密码不一致",
    },
  ],
  checkCode: { required: true, message: "请输入图片验证码" },
};

watch(
  [() => dialogConfig.visible, () => onType.value],
  ([dialogConfig, onType]) => {
    nextTick(() => {
      resetForm();
    });
  }
);

// 验证码
const checkCodeUrl = ref(api.checkCode);
const checkCodeUrl4SendMailCode = ref(api.checkCode);

function changeCheckCode(type) {
  if (type === 0) {
    checkCodeUrl.value =
      api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
  } else {
    // 区分邮箱验证码和登录注册的验证码
    checkCodeUrl4SendMailCode.value =
      api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
  }
}

function showPanel(type) {
  onType.value = type;
  dialogConfig.visible = true;
}

function getEmailCode() {
  // 先验证是否输入邮箱 再允许打开邮箱验证码弹框
  form.value.validateField("email", (valid) => {
    if (!valid) return;
    SendMailCode.visible = true;

    nextTick(() => {
      changeCheckCode(1);
      codeForm.value.resetFields();
      codeFormDate.value.email = formData.value.email;
    });
  });
}

// 验证二次输入密码
function checkRePassword(rule, value, cb) {
  if (value !== formData.value.registerPassword) {
    cb(new Error(rule.message));
  } else {
    cb();
  }
}

// 发送邮箱验证码
function sendEmailCode() {
  codeForm.value.validate(async (valid) => {
    if (!valid) return;

    const params = Object.assign({}, codeFormDate.value);
    params.type = onType.value === 0 ? 0 : 1; // 0:注册 1:找回密码
    let result = await proxy.Request({
      url: api.sendEmailCode,
      params,
      errorCallback: () => {
        changeCheckCode(1);
      },
    });
    if (!result) return;
    Message.success("验证发送成功,请登录邮箱查看");
    SendMailCode.visible = false;
  });
}

function resetForm() {
  // 因为需要判断是否选中 记住我 得另起一个函数 不能把逻辑放在watch里
  nextTick(() => {
    // 重置验证码 (防止输入正确的验证码却出错的情况) / 重置表单
    changeCheckCode(0);
    form.value.resetFields();
    formData.value = {};

    // 登录
    if (onType.value === 1) {
      const cookiesLoginInfo = proxy.VueCookies.get("loginInfo");
      if (cookiesLoginInfo) {
        formData.value = cookiesLoginInfo;
      }
    }
  });
}

// 登录 注册 重置密码 提交表单
function submit() {
  form.value.validate(async (valid) => {
    if (!valid) return;
    let params = {};
    Object.assign(params, formData.value);

    if (onType.value === 0 || onType.value === 2) {
      params.password = params.reRegisterPassword;
      delete params.registerPassword;
      delete params.reRegisterPassword;
    }
    // 登录 如果登录过 就取cookie的信息
    if (onType.value === 1) {
      let cookiesLoginInfo = proxy.VueCookies.get("loginInfo");
      let cookiesPassword =
        cookiesLoginInfo === null ? null : cookiesLoginInfo.password;

      if (params.password !== cookiesPassword) {
        params.password = md5(params.password);
      }
    }

    let url = null;
    if (onType.value === 0) {
      url = api.register;
    } else if (onType.value === 1) {
      url = api.login;
    } else if (onType.value === 2) {
      url = api.resetPwd;
    }

    let result = await proxy.Request({
      url,
      params,
      errorCallback: () => {
        // 刷新验证码
        changeCheckCode(0);
      },
    });

    // 有问题直接 return
    if (!result) return;

    // 注册返回
    if (onType.value === 0) {
      Message.success("注册成功,请登录");
      showPanel(1);
    } else if (onType.value === 1) {
      // 登录 点了记住我
      if (params.rememberMe) {
        const loginInfo = {
          email: params.email,
          password: params.password,
          rememberMe: params.rememberMe,
        };
        proxy.VueCookies.set("loginInfo", loginInfo, "3d");
      } else {
        proxy.VueCookies.remove("loginInfo");
      }
      dialogConfig.visible = false;
      Message.success("登录成功!");
      store.commit("updateLoginUserInfo", result.data);
    } else if (onType.value === 2) {
      // 重置密码
      Message.success("重置成功,请登录");
      showPanel(1);
    }
  });
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

.check-code-panel {
  display: flex;

  .check-code {
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>
