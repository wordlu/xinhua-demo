import routerInstance from "./index";
import store from "@store";
import { getSessionStorage } from "@utils/storage";
import { arrayFind, arrayFindDeepWithType } from "../utils/util";

function checkMenuAuth(route) {
  console.log(route);
  if (route.meta.ignoreAuth) {
    return true;
  }
  let r= route;
  let curCode = r.meta.authority;
  let index = r.path.lastIndexOf('/');
  if (index > 0) {
    let parentRouter = arrayFind(r.matched, 'path', r.path.slice(0, index));
    if (parentRouter) {
      curCode = `${parentRouter.meta.authority}_${curCode}`;
    }
  }
  if (arrayFindDeepWithType(store.getters.authorizes, 'authorize', curCode)) {
    return true;
  } else {
    return false;
  }
}

const whiteList = ['/login'];

routerInstance.beforeEach((to, from, next) => {
  if (getSessionStorage('auth_token')) {
    if (!store.getters.authorizes) {
      store
        .dispatch('fetchAuthorizes')
        .then(() => {
          next({ ...to });
          next();
        });
    } else {
      console.log(123);
      next();
      if (!checkMenuAuth(to)) {
        store.dispatch('logOut');
        next({ path: '/login' });
        next();
      } else {
        next();
      }
    }
  } else {
    console.log(456);
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      console.log(12333333);
      next('/login');
    }
  }
});

routerInstance.afterEach(() => {
  const elMain = document.getElementsByClassName('el-main')[0];
  elMain && elMain.scrollTo(0, 0);
});