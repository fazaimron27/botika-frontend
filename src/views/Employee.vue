<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from "../api";
import { DataTable } from "simple-datatables";
import Modal from '../components/Modal.vue';

const employees = ref([]);
const jobs = ref([]);
const isModalVisible = ref(false);
const currentEmployee = ref(null);
const isEditMode = ref(false);

const fetchDataJobs = async () => {
    await api.get('/api/jobs')
        .then(res => res.data)
        .then(res => {
            jobs.value = res.data;
        });
}

const fetchDataEmployees = async () => {
    await api.get('/api/employees')
        .then(res => res.data)
        .then(res => {
            employees.value = res.data;
            nextTick(() => {
                const dataTable = new DataTable("#main-table", {
                    searchable: false,
                    sortable: false,
                    paging: false,
                });
            });
        });
}

const toggleModal = () => {
    isModalVisible.value = !isModalVisible.value;
}

const openAddModal = () => {
    isEditMode.value = false;
    currentEmployee.value = { name: '', email: '', phone: '', job_id: '', status: '' };
    toggleModal();
}

const openEditModal = async (employeeId) => {
    console.log('employeeId:', employeeId);
    try {
        const response = await api.get(`/api/employees/${employeeId}`);
        currentEmployee.value = response.data.data;
        isEditMode.value = true;
        toggleModal();
    } catch (error) {
        console.error('Error fetching employee:', error);
    }
}

const handleSave = async () => {
    try {
        if (isEditMode.value) {
            await api.put(`/api/employees/${currentEmployee.value.id}`, currentEmployee.value);
            alert('Employee updated successfully');
        } else {
            await api.post('/api/employees', currentEmployee.value);
            alert('Employee created successfully');
        }
        toggleModal();
        window.location.reload();
    } catch (error) {
        console.error('Error saving employee:', error);
        alert('Failed to save employee');
    }
}

const handleDelete = async (employeeId) => {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            await api.delete(`/api/employees/${employeeId}`);
            alert('Employee deleted successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Failed to delete employee');
        }
    }
}

onMounted(() => {
    fetchDataEmployees();
    fetchDataJobs();
});
</script>

<template>
    <section class="bg-white dark:bg-gray-900 mt-5">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
            <button @click="openAddModal" type="button"
                class="w-full text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Add
                New Employee</button>
            <table id="main-table">
                <thead>
                    <tr>
                        <th>
                            <span class="flex items-center">
                                Name
                            </span>
                        </th>
                        <th>
                            <span class="flex items-center">
                                Email
                            </span>
                        </th>
                        <th>
                            <span class="flex items-center">
                                Phone
                            </span>
                        </th>
                        <th>
                            <span class="flex items-center">
                                Job
                            </span>
                        </th>
                        <th>
                            <span class="flex items-center">
                                Status
                            </span>
                        </th>
                        <th>
                            <span class="flex items-center">
                                Actions
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(employee, index) in employees" :key="index">
                        <td class="font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ employee.name }}
                        </td>
                        <td class="font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ employee.email }}
                        </td>
                        <td class="font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ employee.phone }}
                        </td>
                        <td class="font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ employee.job }}
                        </td>
                        <td :class="{ 'text-green-800 dark:text-green-300': employee.status === 'active', 'text-red-800 dark:text-red-300': employee.status === 'inactive' }"
                            class="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {{ employee.status }}
                        </td>
                        <td>
                            <span @click="openEditModal(employee.id)"
                                class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 cursor-pointer">Edit</span>
                            <span @click="handleDelete(employee.id)"
                                class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400 cursor-pointer">Delete</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <Modal :title="isEditMode ? 'Edit Employee' : 'Add New Employee'"
        :modalId="isEditMode ? 'editEmployee' : 'createEmployee'" :isVisible="isModalVisible" @close="toggleModal">
        <template #formContent>
            <form class="space-y-4" @submit.prevent="handleSave">
                <div>
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employee
                        Name</label>
                    <input type="text" name="name" id="name" v-model="currentEmployee.name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Employee Name" required />
                </div>
                <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employee
                        Email</label>
                    <input type="email" name="email" id="email" v-model="currentEmployee.email"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Employee Email" required />
                </div>
                <div>
                    <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Employee
                        Phone</label>
                    <input type="text" name="phone" id="phone" v-model="currentEmployee.phone"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Employee Phone" required />
                </div>
                <label for="job_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select
                    a
                    job</label>
                <select id="job_id" name="job_id" v-model="currentEmployee.job_id"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required>
                    <option v-for="(job, index) in jobs" :key="index" :value="job.id">
                        {{ job.title }}</option>
                </select>
                <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an
                    status</label>
                <select id="status" name="status" v-model="currentEmployee.status"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button type="submit"
                    class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{
                        isEditMode ? 'Update' : 'Create' }}</button>
            </form>
        </template>
    </Modal>
</template>

<style>
.cursor-pointer {
    cursor: pointer;
}
</style>