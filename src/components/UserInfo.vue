<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue';
</script>
<template>
   <DefaultLayout>
        <div class="container py-4">
            <Notification :success="success" :error="error" />
        </div>
        <div class="container py-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title">User Information</h5>
                </div>
                <div class="card-body">
                    <p><strong>Username:</strong> {{ currentUser?.username || 'N/A' }}</p>
                    <p><strong>Name:</strong> {{ currentUser?.fullName || 'N/A' }}</p>
                    <p><strong>Email:</strong> {{ currentUser?.email || 'N/A' }}</p>
                    <p><strong>Designation:</strong> {{ currentUser?.designation || 'N/A' }}</p>
                    <p><strong>Section:</strong> {{ currentUser?.section || 'N/A' }}</p>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>
<style scoped>
</style>