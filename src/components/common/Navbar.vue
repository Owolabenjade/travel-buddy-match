<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <img src="@/assets/logo.png" alt="Travel Buddy Match" height="30" class="d-inline-block align-top me-2" />
          Travel Buddy Match
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/trips">My Trips</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/matches">Matches</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/messages">
                Messages
                <span 
                  v-if="unreadConversationsCount > 0" 
                  class="badge bg-danger ms-1"
                >
                  {{ unreadConversationsCount }}
                </span>
              </router-link>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <template v-if="isAuthenticated">
              <li class="nav-item me-2">
                <NotificationDropdown />
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  {{ user?.displayName || 'Account' }}
                </a>
                <div class="dropdown-menu dropdown-menu-end">
                  <router-link class="dropdown-item" to="/profile">Profile</router-link>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#" @click.prevent="logout">Logout</a>
                </div>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <router-link class="nav-link" to="/login">Login</router-link>
              </li>
              <li class="nav-item">
                <router-link class="btn btn-primary" to="/register">Sign Up</router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { computed, onMounted, onUnmounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import NotificationDropdown from '@/components/common/NotificationDropdown.vue';
  
  export default {
    // Renamed to fix ESLint issue
    name: 'TheNavbar',
    components: {
      NotificationDropdown
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
      const user = computed(() => store.getters['auth/user']);
      const unreadConversationsCount = computed(() => store.getters['messages/unreadConversationsCount'] || 0);
      
      // Set up notifications listener when component mounts
      onMounted(() => {
        if (isAuthenticated.value && user.value) {
          store.dispatch('notifications/setupNotificationsListener', user.value.uid);
        }
      });
      
      // Clear notifications listener when component unmounts
      onUnmounted(() => {
        store.dispatch('notifications/clearNotifications');
      });
      
      const logout = async () => {
        try {
          await store.dispatch('auth/logout');
          router.push('/login');
        } catch (error) {
          console.error('Logout error:', error);
        }
      };
      
      return {
        isAuthenticated,
        user,
        unreadConversationsCount,
        logout
      };
    }
  };
  </script>