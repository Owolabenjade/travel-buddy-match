<template>
    <DefaultLayout>
      <div class="register-view">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <div class="card p-4">
              <h1 class="text-center mb-4">Create an Account</h1>
              
              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>
              
              <form @submit.prevent="handleRegister">
                <div class="mb-3">
                  <label for="displayName" class="form-label">Full Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="displayName"
                    v-model="displayName"
                    required
                    autocomplete="name"
                  >
                </div>
                
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
                    autocomplete="new-password"
                    minlength="6"
                  >
                  <div class="form-text">
                    Password must be at least 6 characters long
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    v-model="confirmPassword"
                    required
                    autocomplete="new-password"
                  >
                  <div v-if="passwordMismatch" class="text-danger mt-1">
                    Passwords don't match
                  </div>
                </div>
                
                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="terms"
                    v-model="agreeToTerms"
                    required
                  >
                  <label class="form-check-label" for="terms">
                    I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a>
                  </label>
                </div>
                
                <div class="d-grid gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="loading || !formValid"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Create Account
                  </button>
                </div>
              </form>
              
              <div class="text-center mt-3">
                <p>
                  Already have an account?
                  <router-link to="/login">Log in</router-link>
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
  import { useRouter } from 'vue-router';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  
  export default {
    name: 'RegisterView',
    components: {
      DefaultLayout
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const displayName = ref('');
      const email = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const agreeToTerms = ref(false);
      
      const loading = computed(() => store.getters['auth/loading']);
      const error = computed(() => store.getters['auth/error']);
      
      const passwordMismatch = computed(() => {
        return password.value && confirmPassword.value && password.value !== confirmPassword.value;
      });
      
      const formValid = computed(() => {
        return displayName.value.trim() !== '' && 
               email.value.trim() !== '' && 
               password.value.length >= 6 && 
               password.value === confirmPassword.value && 
               agreeToTerms.value;
      });
      
      const handleRegister = async () => {
      if (!formValid.value) return;

      try {
      await store.dispatch('auth/register', {
      displayName: displayName.value,
      email: email.value,
      password: password.value
    });
    
    // Redirect to dashboard instead of profile
    router.push('/dashboard');
    } catch (err) {
    console.error('Registration error:', err);
    }
  };
      
      return {
        displayName,
        email,
        password,
        confirmPassword,
        agreeToTerms,
        loading,
        error,
        passwordMismatch,
        formValid,
        handleRegister
      };
    }
  };
  </script>