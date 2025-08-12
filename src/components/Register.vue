<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "../services/LoginService.js"; // implement this in your service

const credentials = ref({
  username: "",
  email: "",
  password: "",
  role: []
});

const error = ref(null);
const success = ref(null);
const router = useRouter();

const availableRoles = ["user", "mod", "admin"];

const toggleRole = (role) => {
  const index = credentials.value.role.indexOf(role);
  if (index > -1) {
    credentials.value.role.splice(index, 1);
  } else {
    credentials.value.role.push(role);
  }
};

const isSelected = (role) => credentials.value.role.includes(role);

const submitForm = async (event) => {
  event.preventDefault();
  error.value = null;
  success.value = null;

  try {
    const { username, email, password, role } = credentials.value;

    const response = await register({ username, email, password, role });

    if (response && response.message) {
      success.value = "Registration successful! Redirecting to login...";
      setTimeout(() => router.push({ name: "Login" }), 1500);
    }
  } catch (err) {
    console.error("Registration failed:", err.response?.data || err.message);
    error.value =
      err.response?.data?.message || "Registration failed. Please try again.";
  }
};
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="row w-100">
      <!-- Left side -->
      <div class="col-md-6 d-flex justify-content-center align-items-center py-5">
        <div class="text-center">
          <img src="../assets/bgdcl.jpeg" alt="Company Logo" class="w-40 mb-4" />
          <h1 class="display-4">Bakhrabad Gas Distribution Company Limited</h1>
          <p class="lead text-muted">Customer File Tracking System</p>
        </div>
      </div>

      <!-- Right side -->
      <div class="col-md-6 bg-light rounded p-5">
        <h2 class="text-center mb-4">Register Account</h2>

        <form @submit="submitForm">
          <!-- Username -->
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              v-model="credentials.username"
              id="username"
              class="form-control"
              placeholder="Enter username"
              required
            />
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              v-model="credentials.email"
              id="email"
              class="form-control"
              placeholder="Enter email"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              v-model="credentials.password"
              id="password"
              class="form-control"
              placeholder="Enter password"
              required
            />
          </div>

          <!-- Role Pills -->
          <div class="mb-3">
            <label class="form-label">Select Role(s)</label>
            <div class="d-flex gap-2 flex-wrap">
              <span
                v-for="role in availableRoles"
                :key="role"
                class="badge rounded-pill px-3 py-2 role-pill"
                :class="isSelected(role) ? 'bg-primary' : 'bg-secondary'"
                style="cursor: pointer;"
                @click="toggleRole(role)"
              >
                {{ role }}
              </span>
            </div>
          </div>

          <!-- Error message -->
          <div class="mb-3" v-if="error">
            <div class="alert alert-danger">{{ error }}</div>
          </div>

          <!-- Success message -->
          <div class="mb-3" v-if="success">
            <div class="alert alert-success">{{ success }}</div>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn btn-primary w-100">Register</button>

          <!-- Already have account -->
          <div class="mt-3 text-center">
            <small class="text-muted">
              Already have an account?
              <router-link to="/login" class="text-primary">Login here</router-link>
            </small>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
.role-pill {
  transition: all 0.2s ease;
}
.role-pill:hover {
  opacity: 0.85;
}
</style>
