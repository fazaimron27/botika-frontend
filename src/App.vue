<script setup>
import { ref, provide } from 'vue';
import Nav from './components/Nav.vue';
import Toast from './components/Toast.vue';

const showToast = ref(false);
const toastType = ref('');
const toastMessage = ref('');

const showSuccessToast = (message) => {
    toastType.value = 'success';
    toastMessage.value = message;
    showToast.value = true;
};

const showErrorToast = (message) => {
    toastType.value = 'error';
    toastMessage.value = message;
    showToast.value = true;
};

provide('showSuccessToast', showSuccessToast);
provide('showErrorToast', showErrorToast);
provide('showToast', showToast);
provide('toastType', toastType);
provide('toastMessage', toastMessage);
</script>

<template>
    <Nav />
    <div class="toast-container">
        <Toast v-if="showToast" :type="toastType" :message="toastMessage" @update:show="showToast = false" />
    </div>
    <router-view></router-view>
</template>

<style scoped>
.toast-container {
    position: fixed;
    top: 50px;
    /* Adjust this value as needed */
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    /* Ensure it is above other elements */
}
</style>