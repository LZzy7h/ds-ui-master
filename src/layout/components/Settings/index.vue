<template>
  <div class="drawer-container">
    <div>
      <div class="setting-drawer-content">
        <div class="setting-drawer-title">
          <h3 class="drawer-title">主题风格设置</h3>
        </div>
        <div class="setting-drawer-block-checbox">
          <div class="setting-drawer-block-checbox-item default" @click="handleTheme('theme-dark')"></div>
          <div class="setting-drawer-block-checbox-item green" @click="handleTheme('green-theme')"></div>
          <div class="setting-drawer-block-checbox-item red" @click="handleTheme('red-theme')"></div>
          <div class="setting-drawer-block-checbox-item gradient-blue" @click="handleTheme('gradient-blue')"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    },
  },
  methods: {
    handleTheme(val) {
      document.getElementsByTagName('body')[0].className = val
      window.localStorage.setItem('theme',val)
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
        this.resetSetItem('theme', val);
    }
  }
}
</script>

<style lang="scss" scoped>
  .setting-drawer-content {
    .setting-drawer-title {
      margin-bottom: 12px;
      color: rgba(0, 0, 0, .85);
      font-size: 14px;
      line-height: 22px;
      font-weight: bold;
    }
    .setting-drawer-block-checbox {
      display: flex;
      justify-content: flex-start;
      flex-wrap:wrap;
      align-items: center;
      margin-top: 10px;
      margin-bottom: 20px;
      .setting-drawer-block-checbox-item {
        position: relative;
        margin-right: 16px;
        border-radius: 2px;
        margin-bottom: 20px;
        cursor: pointer;
        width: 80px;
        height: 80px;
        box-shadow: 0px 0px 13px 0px rgba(220, 220, 229, 0.28);
      }
      .default{
        background: #3312AF;
      }
      .green{
        background: #1DA081;
      }
      .red{
        background: #DF3B3B;
      }
      .gradient-blue{
        background: linear-gradient(-90deg, #99B2FE 0%, #4B71F0 100%);
      }
    }
  }

  .drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
      margin-bottom: 12px;
      color: rgba(0, 0, 0, .85);
      font-size: 14px;
      line-height: 22px;
    }

    .drawer-item {
      color: rgba(0, 0, 0, .65);
      font-size: 14px;
      padding: 12px 0;
    }

    .drawer-switch {
      float: right
    }
  }
</style>
