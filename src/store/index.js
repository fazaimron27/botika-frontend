import { reactive, watch } from "vue";

const initialState = JSON.parse(localStorage.getItem("store")) || {
  isAuthenticated: false,
};

export const store = reactive({
  ...initialState,
  setAuthenticated(status) {
    this.isAuthenticated = status;
  },
});

watch(
  () => store.isAuthenticated,
  (newValue) => {
    localStorage.setItem("store", JSON.stringify(store));
  }
);
