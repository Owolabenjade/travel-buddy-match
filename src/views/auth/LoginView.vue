<template>
    <DefaultLayout>
      <div class="login-view">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <div class="card p-4">
              <h1 class="text-center mb-4">Login</h1>
              
              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>
              
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    required
                    autocomplete="email"
                  >
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="password"
                    required
                    autocomplete="current-password"
                  >
                </div>
                
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Login
                  </button>
                </div>
              </form>
              
              <div class="text-center mt-3">
                <p>
                  Don't have an account?
                  <router-link to="/register">Sign up</router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  
  export default {
    name: 'LoginView',
    components: {
      DefaultLayout
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      
      const email = ref('');
      const password = ref('');
      const loading = computed(() => store.getters['auth/loading']);
      const error = computed(() => store.getters['auth/error']);
      
      const handleLogin = async () => {
        try {
          await store.dispatch('auth/login', {
            email: email.value,
            password: password.value
          });
          
          // Redirect to intended destination or dashboard
          const redirectPath = route.query.redirect || '/dashboard';
          router.push(redirectPath);
        } catch (err) {
          console.error('Login error:', err);
        }
      };
      
      return {
        email,
        password,
        loading,
        error,
        handleLogin
      };
    }
  };
  </script>