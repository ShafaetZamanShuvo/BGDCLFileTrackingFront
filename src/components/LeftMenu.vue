<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// Props
const props = defineProps({
  acceptFilesCount: {
    type: Number,
    default: 0
  },
  requestedFilesCount: {
    type: Number,
    default: 0
  },
  username: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false   // if false, settings menu won't show
  }
});

// Emits
const emit = defineEmits(['toggle-collapse']);

// Reactive state
const isCollapsed = ref(false);
const isSettingsOpen = ref(false);
const route = useRoute();
const currentPath = computed(() => route.path);

// Methods
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('toggle-collapse', isCollapsed.value);
};

const toggleSettingsMenu = () => {
  if (!props.isAdmin) return;
  isSettingsOpen.value = !isSettingsOpen.value;
};

// Handle window resizing for responsive design
const checkWindowSize = () => {
  if (window.innerWidth <= 768) {
    isCollapsed.value = true;
  }
};

onMounted(() => {
  checkWindowSize();
  window.addEventListener('resize', checkWindowSize);
});
</script>

<template>
  <div class="left-menu bg-light border-end" :class="{ 'collapsed': isCollapsed }">
    
    <nav class="nav flex-column py-3">
      <router-link to="/accept-files" class="nav-link d-flex align-items-center py-3 px-3"
        :class="{ active: currentPath === '/accept-files' }">
        <i class="bi bi-download me-3"></i>
        <span class="menu-text flex-grow-1" :class="{ 'd-none': isCollapsed }">Accept Files</span>
        <span v-if="acceptFilesCount > 0" class="badge bg-danger rounded-pill">
          {{ acceptFilesCount > 99 ? '99+' : acceptFilesCount }}
        </span>
      </router-link>
      
      <router-link to="/requested-files" class="nav-link d-flex align-items-center py-3 px-3"
        :class="{ active: currentPath === '/requested-files' }">
        <i class="bi bi-file-earmark-arrow-down me-3"></i>
        <span class="menu-text flex-grow-1" :class="{ 'd-none': isCollapsed }">Show Requested Files</span>
        <span v-if="requestedFilesCount > 0" class="badge bg-danger rounded-pill">
          {{ requestedFilesCount > 99 ? '99+' : requestedFilesCount }}
        </span>
      </router-link>
      
      <!-- Settings menu (only if admin) -->
      <div v-if="isAdmin" class="nav-item">
        <a href="javascript:void(0)" 
           class="nav-link d-flex align-items-center py-3 px-3"
           :class="{ active: currentPath.startsWith('/settings') }"
           @click="toggleSettingsMenu">
          <i class="bi bi-gear me-3"></i>
          <span class="menu-text flex-grow-1" :class="{ 'd-none': isCollapsed }">Settings</span>
          <i class="bi ms-auto" :class="isSettingsOpen ? 'bi-chevron-up' : 'bi-chevron-down'" v-if="!isCollapsed"></i>
        </a>
        
        <!-- Submenu -->
        <div v-if="isSettingsOpen && !isCollapsed" class="submenu ps-5">
          <router-link to="/settings/add-file-info" class="nav-link py-2" 
            :class="{ active: currentPath === '/settings/add-file-info' }">
            <i class="bi bi-file-plus me-2"></i>
         Add File Info
          </router-link>
          <router-link to="/settings/add-user" class="nav-link py-2" 
            :class="{ active: currentPath === '/settings/add-user' }">
            <i class="bi bi-person-plus me-2"></i>
            Add User Info
          </router-link>
          <router-link to="/settings/add-department" class="nav-link py-2" 
            :class="{ active: currentPath === '/settings/add-department' }">
            <i class="bi bi-building me-2"></i>
            Add Department
          </router-link>
          <router-link to="/settings/add-designation" class="nav-link py-2" 
            :class="{ active: currentPath === '/settings/add-designation' }">
            <i class="bi bi-briefcase me-2"></i>
            Add Designation
          </router-link>
          <router-link to="/settings/add-section" class="nav-link py-2" 
            :class="{ active: currentPath === '/settings/add-section' }">
            <i class="bi bi-building me-2"></i>
            Add Section
          </router-link>
        </div>
      </div>
    </nav>
    
    <div class="mt-auto border-top p-3">
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center" :class="{ 'd-none': isCollapsed }">
          <div class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
            style="width: 32px; height: 32px;">
            {{ username.charAt(0) }}
          </div>
          <div class="small text-truncate">{{ username }}</div>
        </div>
        <button class="btn btn-sm btn-light border rounded-circle" @click="toggleCollapse">
          <i class="bi" :class="isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.left-menu {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 250px;
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1030;
  padding-top: 56px; /* To account for the fixed-top navbar */
}

.left-menu.collapsed {
  width: 80px;
}

.nav-link {
  color: #495057;
  position: relative;
  transition: background-color 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-link.active {
  background-color: rgba(0, 0, 0, 0.075);
  border-left: 4px solid #0d6efd;
  font-weight: 600;
}

.submenu .nav-link {
  font-size: 0.9rem;
  padding-left: 1rem;
}

/* For mobile screens */
@media (max-width: 768px) {
  .left-menu {
    width: 70px;
  }
  
  .left-menu.expanded {
    width: 250px;
  }
}
</style>
