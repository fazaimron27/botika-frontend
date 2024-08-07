<template>
    <div v-if="show" :id="alertId" :class="alertClass" role="alert">
        <svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
            viewBox="0 0 20 20">
            <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span class="sr-only">Info</span>
        <div class="ms-3 text-sm font-medium">
            {{ message }}
        </div>
        <button type="button" class="ms-auto -mx-1.5 -my-1.5" :class="buttonClass" @click="closeAlert"
            aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
        </button>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            required: true,
            validator: value => ['success', 'error', 'warning', 'info', 'dark'].includes(value)
        },
        message: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        alertId() {
            return `alert-${this.type}`;
        },
        alertClass() {
            return [
                'flex items-center p-4 mb-4 rounded-lg',
                {
                    'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400': this.type === 'success',
                    'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400': this.type === 'error',
                    'text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300': this.type === 'warning',
                    'text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400': this.type === 'info',
                    'bg-gray-50 dark:bg-gray-800': this.type === 'dark'
                }
            ];
        },
        buttonClass() {
            return [
                'rounded-lg focus:ring-2 p-1.5 hover:bg-gray-200 inline-flex items-center justify-center h-8 w-8',
                {
                    'bg-green-50 text-green-500 focus:ring-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700': this.type === 'success',
                    'bg-red-50 text-red-500 focus:ring-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700': this.type === 'error',
                    'bg-yellow-50 text-yellow-500 focus:ring-yellow-400 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700': this.type === 'warning',
                    'bg-blue-50 text-blue-500 focus:ring-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700': this.type === 'info',
                    'bg-gray-50 text-gray-500 focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white': this.type === 'dark'
                }
            ];
        }
    },
    methods: {
        closeAlert() {
            this.$emit('update:show', false);
        }
    }
};
</script>