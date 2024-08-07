<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import api from "../api";

const router = useRouter();

const email = ref("");
const password = ref("");
const errors = ref([]);

const showSuccessToast = inject('showSuccessToast');
const showErrorToast = inject('showErrorToast');

const handleLogin = async () => {
    let formData = new FormData();

    formData.append("email", email.value);
    formData.append("password", password.value);

    await api.post("/api/auth", formData)
        .then(res => res.data)
        .then((res) => {
            localStorage.setItem('access_token', res.data.access_token);
            router.push({ name: 'dashboard' });
            showSuccessToast('Login successful!');
        })
        .catch((error) => {
            errors.value = error.response.data;
            showErrorToast('Login failed. Please try again.');
        });
};

</script>

<template>
    <section class="bg-white dark:bg-gray-900 mt-5">
        <div class="py-8 px-4 mx-auto max-w-screen-x lg:py-16">
            <form @submit.prevent="handleLogin()" class="max-w-sm mx-auto">
                <div class="mb-5">
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                        email</label>
                    <input v-model="email" type="email" id="email"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="yourmail@example.com" required />
                </div>
                <div class="mb-5">
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                        password</label>
                    <input v-model="password" type="password" id="password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Your password" required />
                </div>
                <button type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>

        </div>
    </section>
</template>