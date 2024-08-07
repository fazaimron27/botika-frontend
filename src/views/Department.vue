<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from "../api";
import { DataTable } from "simple-datatables";
import Modal from '../components/Modal.vue';

const departments = ref([]);
const isModalVisible = ref(false);
const currentDepartment = ref(null);
const isEditMode = ref(false);

const fetchDataDepartments = async () => {
    await api.get('/api/departments')
        .then(res => res.data)
        .then(res => {
            departments.value = res.data;
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
    currentDepartment.value = { name: '' };
    toggleModal();
}

const openEditModal = async (departmentId) => {
    try {
        const response = await api.get(`/api/departments/${departmentId}`);
        currentDepartment.value = response.data.data;
        isEditMode.value = true;
        toggleModal();
    } catch (error) {
        console.error('Error fetching department:', error);
    }
}

const handleSave = async () => {
    try {
        if (isEditMode.value) {
            await api.put(`/api/departments/${currentDepartment.value.id}`, currentDepartment.value);
            alert('Department updated successfully');
        } else {
            await api.post('/api/departments', currentDepartment.value);
            alert('Department created successfully');
        }
        toggleModal();
        window.location.reload();
    } catch (error) {
        console.error('Error saving department:', error);
        alert('Failed to save department');
    }
}

const handleDelete = async (departmentId) => {
    if (confirm('Are you sure you want to delete this department?')) {
        try {
            await api.delete(`/api/departments/${departmentId}`);
            alert('Department deleted successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting department:', error);
            alert('Failed to delete department');
        }
    }
}

onMounted(() => {
    fetchDataDepartments();
});
</script>

<template>
    <section class="bg-white dark:bg-gray-900 mt-5">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
            <button @click="openAddModal" type="button"
                class="w-full text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Add
                New Department</button>
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
                                Actions
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(department, index) in departments" :key="index">
                        <td class="font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ department.name }}
                        </td>
                        <td>
                            <span @click="openEditModal(department.id)"
                                class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 cursor-pointer">Edit</span>
                            <span @click="handleDelete(department.id)"
                                class="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400 cursor-pointer">Delete</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <Modal :title="isEditMode ? 'Edit Department' : 'Add New Department'"
        :modalId="isEditMode ? 'editDepartment' : 'createDepartment'" :isVisible="isModalVisible" @close="toggleModal">
        <template #formContent>
            <form class="space-y-4" @submit.prevent="handleSave">
                <div>
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department
                        Name</label>
                    <input type="text" name="name" id="name" v-model="currentDepartment.name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Department Name" required />
                </div>
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