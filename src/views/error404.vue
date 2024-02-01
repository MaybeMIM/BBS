<template>
  <div class="error">
    <div class="info">
      <span>404</span>
      <p class="text">页面未找到</p>
    </div>
    <router-link to="/" class="link">🚀返回首页🚀</router-link>
  </div>
</template>

<script setup></script>

<style lang="scss">
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: 100vh;
  .info {
    font-size: 60px;
    color: #c4c4c4;
    .text {
      font-size: 45px;
    }
  }
  .link {
    margin-top: 10px;
    font-size: 25px;
    color: var(--link);
  }
}
</style>
