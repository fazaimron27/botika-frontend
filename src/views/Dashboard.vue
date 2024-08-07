<script setup>
import { ref, onMounted } from 'vue';
import api from "../api";

const employeeSummary = ref({
    employee_count: 0,
    status_counts: {
        active_count: 0,
        inactive_count: 0
    },
    department_counts: {}
});

onMounted(async () => {
    try {
        const response = await api.get('/api/dashboard/employee-summary');
        console.log('Employee summary:', response.data);
        employeeSummary.value = response.data.data;
    } catch (error) {
        console.error('Error fetching employee summary:', error);
    }
});
</script>

<template>
    <section class="bg-white dark:bg-gray-900 mt-5">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
            <h1
                class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Dashboard the Fullstack Dev App</h1>
            <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">Here at
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta mollitia porro amet aperiam sequi
                consequuntur ad, nam repudiandae totam itaque consequatur dolore, eum molestias excepturi obcaecati
                repellendus in at. Aut.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="card bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold">Total Employees</h3>
                    <p class="mt-2">{{ employeeSummary.employee_count }}</p>
                </div>
                <div class="card bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold">Active Employees</h3>
                    <p class="mt-2">{{ employeeSummary.status_counts.active_count }}</p>
                    <h3 class="text-lg font-semibold mt-4">Inactive Employees</h3>
                    <p class="mt-2">{{ employeeSummary.status_counts.inactive_count }}</p>
                </div>
                <div class="card bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold">Department Counts</h3>
                    <ul class="mt-2">
                        <li v-for="(count, department) in employeeSummary.department_counts" :key="department">
                            {{ department }}: {{ count }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>