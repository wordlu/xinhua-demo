<template>
  <div class="tags-view-container">
    <ScrollPane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :to="{ path: tag.path, query: { ...tag.query }, fullPath: tag.fullPath }"
        draggable="false"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
        @click.native="open"
      >
        <span class="title">{{ tag.title }}</span>
        <span
          v-if="!isAffix(tag)"
          class="icon el-icon-close1"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <i class="el-icon-close"></i>
        </span>
      </router-link>
    </ScrollPane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <!-- <li @click="refreshSelectedTag(selectedTag)">刷新页面</li> -->
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ScrollPane from './ScrollWrap'
import path from 'path'

export default {
  name: 'TagsViews',
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    routes() {
      let route = this.generateRoute()
      return route
    }
  },
  watch: {
    $route(nv) {
      if (nv) {
        this.addTags()
        this.moveToCurrentTag()
      }
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    ...mapActions('tagsView', ['addView', 'delView', 'changeHeight']),
    generateRoute() {
      if (this.$route.name && this.$route.name !== '404') {
        return this.$route
      }
      return false
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delAllSubVisitedView', view)
      this.open()
      this.delView(view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    filterAffixTags(routes, basePath = '/welcome/users') {
      let tags = []
      routes.forEach(route => {
        const {
          meta,
          name,
          children,
          meta: { affix }
        } = route
        if (meta && affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: name,
            meta: { ...meta }
          })
        }
        if (children) {
          const tempTags = this.filterAffixTags(children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags([this.routes]))
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name, query } = this.$route
      // TODO： 为了使菜单管理中的【是否缓存页面】字段生效
      // 需要将name转为与页面中的name匹配的形式才能存在cachedViews中
      if (name) {
        if (Object.keys(query).length < 1) {
          this.$store.dispatch('tagsView/addView', this.$route).then(() => {
            this.moveToCurrentTag()
          })
        }
        let visited = [...this.$store.state.tagsView.visitedViews]
        if (visited.length > 15) {
          let visit = visited.filter(i => !i.meta.affix)
          let delItem = visit.shift()
          this.delView(delItem).then(({ visitedViews }) => {
            if (this.isActive(this.$route)) {
              const latestView = visitedViews.slice(-1)[0]
              if (latestView) {
                this.$router.push(latestView)
              } else {
                this.$router.push('/')
              }
            }
          })
        }
      }
      return false
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.open()
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.open()
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === this.$route.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/welcome/users')
        }
      }
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        if (tags) {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag)
              // when query is different then update
              if (tag.to.path !== this.$route.path) {
                this.$store.dispatch('tagsView/updateVisitedView', this.$route)
              }
              break
            }
          }
        }
      })
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    open() {
      this.$store.commit('tagsView/ADD_CLICK_TYPE', 'top')
      this.$store.commit('tagsView/ADD_CLICK_ARR_VIEWS', this.$route)
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  width: 100%;
  height: 50px;
  font-size: 0;
  background-color: $color-menu-bg;
  box-shadow: inset 0 -1px 0 0 $color-line-nav;
  .tags-view-item {
    position: relative;
    display: inline-block;
    height: 30px;
    padding: 0 10px;
    margin-left: 10px;
    font-size: 14px;
    line-height: 30px;
    color: $color-body-bg;
    cursor: pointer;
    background: rgba($color-menu-hover, 0.1);
    border-bottom: none;
    border-radius: 2px 2px 0 0;
    &:first-of-type {
      margin-left: 20px;
    }
    &:last-of-type {
      margin-right: 20px;
    }
    &.router-link-exact-active {
      color: $color-white;
      background-color: $color-menu-hover;
      border: none;
    }
    .icon {
      margin-left: 6px;
      font-size: 15px;
      &:hover {
        background: rgba($color-mainfont, 0.2);
        border-radius: 50%;
      }
    }
  }
}
.contextmenu {
  position: absolute;
  z-index: 3000;
  padding: 5px 0;
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  list-style-type: none;
  background: #fff;
  border-radius: 4px;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  li {
    padding: 7px 16px;
    margin: 0;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>
