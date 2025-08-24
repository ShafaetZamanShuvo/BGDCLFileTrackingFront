<script setup>
import { ref, onMounted, computed } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import Notification from './Notification.vue';
import UtilService from '../services/UtilService';
import { getUserInfo } from '../services/LoginService';

const success = ref('');
const error = ref('');
const currentUser = ref(null);
const users = ref([]);
const isLoading = ref(true);

// Form data
const form = ref({
  username: '',
  department: '',
  section: '',
  designation: '',
  email: ''
});

// Dropdown values (can be loaded from API later)
const usernames = ref([]);
const departments = ref(['HR', 'Finance', 'IT', 'Operations']);
const sections = ref(['Section A', 'Section B', 'Section C']);
const designations = ref(['Manager', 'Assistant Manager', 'Officer', 'Staff']);

// Notifications
const showSuccess = (message) => {
  error.value = '';
  success.value = message;
  setTimeout(() => { success.value = ''; }, 4000);
};

const showError = (message) => {
  success.value = '';
  error.value = message;
  setTimeout(() => { error.value = ''; }, 4000);
};

// Load users on mount
onMounted(async () => {
  try {
    currentUser.value = await getUserInfo(localStorage.getItem('authToken'));
    users.value = await UtilService.getAllUserIds();  // API call to load users
    usernames.value = users.value.map(u => u.username);
  } catch (err) {
    showError('Failed to load user data');
  } finally {
    isLoading.value = false;
  }
});

// Save or update user
const saveUser = async () => {
  try {
    if (!form.value.username) {
      showError('Please select a username');
      return;
    }
    // await UserService.saveOrUpdateUser(form.value);
    // showSuccess('User information saved successfully');
    // users.value = await UserService.getAllUsers(); // reload table
  } catch (err) {
    showError('Failed to save user information');
  }
};
</script>

<template>
  <DefaultLayout>
    <div class="container py-4">
      <Notification :success="success" :error="error" />
    </div>

    <div class="container py-4">
      <div class="bg-white p-4 rounded shadow-sm">
        <h2 class="text-center mb-4">Manage User Information</h2>

        <!-- User Form -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header fw-bold">Update User Info</div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Username</label>
                <select v-model="form.username" class="form-select">
                  <option disabled value="">Select Username</option>
                  <option v-for="u in usernames" :key="u" :value="u">{{ u }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" v-model="form.email" class="form-control" placeholder="Enter email" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Department</label>
                <select v-model="form.department" class="form-select">
                  <option disabled value="">Select Department</option>
                  <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Section</label>
                <select v-model="form.section" class="form-select">
                  <option disabled value="">Select Section</option>
                  <option v-for="s in sections" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">Designation</label>
                <select v-model="form.designation" class="form-select">
                  <option disabled value="">Select Designation</option>
                  <option v-for="des in designations" :key="des" :value="des">{{ des }}</option>
                </select>
              </div>
            </div>
            <div class="text-end mt-3">
              <button class="btn btn-primary" @click="saveUser">
                <i class="bi bi-save me-2"></i> Save / Update
              </button>
            </div>
          </div>
        </div>

        <!-- User Table -->
        <div class="card shadow-sm border-0">
          <div class="card-header fw-bold d-flex justify-content-between">
            <span>All Users</span>
            <span class="badge bg-primary">{{ users.length }} users</span>
          </div>
          <div class="card-body p-0">
            <div v-if="isLoading" class="text-center py-3">Loading users...</div>
            <div v-else-if="users.length === 0" class="text-center py-3">
              <em>No users found.</em>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr class="text-center">
                    <th>#</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Section</th>
                    <th>Designation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(u, index) in users" :key="u.id">
                    <td class="text-center fw-bold">{{ index + 1 }}</td>
                    <td>{{ u.username }}</td>
                    <td>{{ u.fullName }}</td>
                    <td>{{ u.email }}</td>
                    <td>{{ u.department }}</td>
                    <td>{{ u.section }}</td>
                    <td>{{ u.designation }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  </DefaultLayout>
</template>
