<template>
  <div>
    <el-dialog
      :model-value="visible"
      :title="title"
      :width="width"
      :draggable="true"
      :show-close="showClose"
      :close-on-click-modal="false"
      :top="top"
      class="custom-dialog"
      @close="close"
    >
      <div class="dialog-body">
        <slot></slot>
      </div>
      <template v-if="(buttons && buttons.length > 0) || showCancel">
        <div class="dialog-footer">
          <el-button @click="close" v-if="showCancel">取消</el-button>
          <el-button
            v-for="(btn, index) in buttons"
            :key="index"
            :type="btn.type"
            @click="btn.click"
          >
            {{ btn.text }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "标题",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "30%",
  },
  top: {
    type: String,
  },
  buttons: {
    type: Array,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["close"]);
function close() {
  emit("close");
}
</script>

<style lang="scss">
.custom-dialog {
  margin-bottom: 10px;
  .el-dialog__body {
    padding: 0px;
  }

  .dialog-body {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 15px;
    min-height: 120px;
    max-height: calc(100vh - 200px);
    overflow: auto;
  }
  .dialog-footer {
    text-align: right;
    padding: 5px 20px;
  }
}
</style>
