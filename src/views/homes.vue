<template>
  <div class="articles">
    <div class="articles-content">
      <div class="avatar">
        <img class="avatar-img" src="../assets/images/avatar.png" />
      </div>
      <div class="base-info">
        <div class="title">
          <span class="font2-2">{{ userInfo }}</span>
        </div>
        <div class="info-item">
          <div class="content">
            <p>欢迎您！</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import keepMixin from '@mixins/keep.mixin'
export default {
  name: 'Articles',
  mixins: [keepMixin],
  computed: mapState({
    userInfo: (state) => state.userInfo
  })
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.articles {
  position: relative;
  min-width: 960px;
  height: 100%;
  background-color: $color-white;

  &-content {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 844px;
    height: 532px;
    transform: translate(-50%, -50%);

    .avatar {
      padding-top: 10%;
      text-align: center;

      .avatar-img {
        width: 200px;
        height: 200px;
      }
    }

    .base-info {
      position: relative;
      padding: 10px;
      margin-bottom: 18px;
      text-align: center;

      .title {
        margin-bottom: 12px;
      }
    }
  }
}
</style>