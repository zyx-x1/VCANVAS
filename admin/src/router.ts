import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/admin",
      name: "admin",
      redirect: "/admin/view",
      component: () => import("@/views/admin/Index.vue"),
      children: [
        {
          path: "view",
          component: () => import("@/views/admin/view.vue"),
        },
        {
          path: "user",
          component: () => import("@/views/admin/user.vue"),
        },
        {
          path: "record",
          component: () => import("@/views/admin/record.vue"),
        },
        {
          path: "notice",
          component: () => import("@/views/admin/notice.vue"),
        },
        {
          path: "addnotice",
          component: () => import("@/views/admin/addnotice.vue"),
        },
        {
          path: "delrecord",
          component: () => import("@/views/admin/delrecord.vue"),
        },
      ],
    },
    {
      path: "/login",
      component: () => import("@/views/Login.vue"),
      children: [
        {
          path: "",
          component: () => import("@/components/login/login.vue"),
        },
        {
          path: "reset",
          component: () => import("@/components/login/reset.vue"),
        },
      ],
    },
  ],
});

const originalPush: Function = Router.prototype.push;
Router.prototype.push = function push(location: any): any {
  return originalPush.call(this, location).catch((err: Error): Error => err);
};
export default router;
