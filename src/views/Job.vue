<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from "../api";
import { DataTable } from "simple-datatables";
import Modal from '../components/Modal.vue';

const jobs = ref([]);
const departments = ref([]);
const isModalVisible = ref(false);
const currentJob = ref(null);
const isEditMode = ref(false);

const fetchDataDepartments = async () => {
    await api.get('/api/departments')
        .then(res => res.data)
        .then(res => {
            departments.value = res.data;
        });
}

const fetchDataJobs = async () => {
    await api.get('/api/jobs')
        .then(res => res.data)
        .then(res => {
            jobs.value = res.data;
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
    currentJob.value = { title: '', department_id: '' };
    toggleModal();
}

const openEditModal = async (jobId) => {
    try {
        const response = await api.get(`/api/jobs/${jobId}`);
        currentJob.value = response.data.data;
        isEditMode.value = true;
        toggleModal();
    } catch (error) {
        console.error('Error fetching job:', error);
    }
}

const handleSave = async () => {
    try {
        if (isEditMode.value) {
            await api.put(`/api/jobs/${currentJob.value.id}`, currentJob.value);
            alert('Job updated successfully');
        } else {
            await api.post('/api/jobs', currentJob.value);
            alert('Job created successfully');
        }
        toggleModal();
        window.location.reload();
    } catch (error) {
        console.error('Error saving job:', error);
        alert('Failed to save job');
    }
}

const handleDelete = async (jobId) => {
    if (confirm('Are you sure you want to delete this job?')) {
        try {
            await api.delete(`/api/jobs/${jobId}`);
            alert('Job deleted successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job');
        }
    }
}

onMounted(() => {
    fetchDataJobs();
    fetchDataDepartments();
});
</script>

<template>
    <section class="bg-white dark:bg-gray-900 mt-5">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
            <button @click="openAddModal" type="button"
                class="w-full text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Add
                New Job</button>
            <table id="main-table">
                <thead>
                    <tr>
                        <th>
                            <span class="flex items-center">
                                Title
                            </span>
                        </th>
                        <th>
                            <span class="flex items-center">
                                Department
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
                    <tr v-for="(job, index) in jobs" :key="index">
                        <td class="font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ job.title }}
                        </td>
                        <td class="font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ job.department }}
                        </td>
                        <td>
                            <span @click="openEditModal(job.id)"
                                class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 cursor-pointer">Edit</span>
                            <span @click="handleDelete(job.id)"
                                class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400 cursor-pointer">Delete</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <Modal :title="isEditMode ? 'Edit Job' : 'Add New Job'" :modalId="isEditMode ? 'editJob' : 'createJob'"
        :isVisible="isModalVisible" @close="toggleModal">
        <template #formContent>
            <form class="space-y-4" @submit.prevent="handleSave">
                <div>
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Job
                        Title</label>
                    <input type="text" name="title" id="title" v-model="currentJob.title"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Job Title" required />
                </div>
                <label for="department_id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select
                    a
                    department</label>
                <select id="department_id" name="department_id" v-model="currentJob.department_id"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required>
                    <option v-for="(department, index) in departments" :key="index" :value="department.id">
                        {{ department.name }}</option>
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