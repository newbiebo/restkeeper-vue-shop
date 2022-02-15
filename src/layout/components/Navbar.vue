<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">

      <template v-if="device!=='mobile'">
        <!--<search id="header-search" class="right-menu-item" />-->

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

        <lang-select class="right-menu-item hover-effect" />

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://gitee.com/itheima_project/vue-admin-platform">
          <el-dropdown-item>
          {{ $t('navbar.github') }}
          </el-dropdown-item>
          </a>
          <a target="_blank"
             href="http://ppsk.shop.eehp.cn/doc.html">
          <el-dropdown-item>swagger-ui</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="right-menu" v-if="this.$store.getters.introduction.includes('change-store')">
      <template>
        <el-select
          v-model="defaultStore"
          @change="changStore" placeholder="切换门店">
          <el-option
            v-for="item in calendarStoreOptions"
            :key="item.id"
            :label="item.storeName"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'
import {initfetchList} from '@/api/store'
import {setStoreToken,getStoreToken,removeStoreToken} from '@/utils/storeToken'
import {getInfo} from '@/api/user'

const calendarStoreOptions = [];

export default {
  data() {
    return {
      defaultStore: null,
      calendarStoreOptions,
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  created() {
    this.initStore();
  },
  methods: {
    initStore(){
      initfetchList().then(response => {
        if (response.datas!==null){
          this.calendarStoreOptions = response.datas;
          if (calendarStoreOptions!==null){
            getInfo().then(getInfoRequest=>{
              let user = getInfoRequest.datas;
              for(let store of  this.calendarStoreOptions){
                if (store.id===user.storeId) {
                  this.defaultStore = store.id;
                  console.info("当前用户默认店面："+this.defaultStore);
                  setStoreToken(this.defaultStore);
                  // console.info("当前用户默认店面token："+getStoreToken());
                }
              }
              if (this.defaultStore===null){
                this.defaultStore = this.calendarStoreOptions[0].id;
                console.info("默认店面："+this.defaultStore);
                setStoreToken(this.defaultStore);
                console.info("默认店面token："+getStoreToken());
              }
            });
          }

        }
      })
    },
    changStore(storeId){
      removeStoreToken();
      setStoreToken(storeId);
      console.info("切换店面storeId："+storeId);
      let views = this.$store.state.tagsView.visitedViews;
      let view = null;
      let path = this.$route.path;
      for(let x of views){
        if (x.path===path) {
          view = x;
        }
      }
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
