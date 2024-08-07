import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/",
    name: "dashboard",
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue"),
  },
  {
    path: "/departments",
    name: "departments.index",
    component: () =>
      import(
        /* webpackChunkName: "departments.index" */ "../views/Department.vue"
      ),
  },
  {
    path: "/jobs",
    name: "jobs.index",
    component: () =>
      import(/* webpackChunkName: "jobs.index" */ "../views/Job.vue"),
  },
  {
    path: "/employees",
    name: "employees.index",
    component: () =>
      import(/* webpackChunkName: "employees.index" */ "../views/Employee.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem("access_token");
  if (to.name !== "login" && !accessToken) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
