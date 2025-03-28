<template>
  <div id="app">
    <router-view v-if="authInitialized" />
    <div v-else class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const authInitialized = ref(false);
    
    onMounted(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          store.commit('auth/SET_USER', user);
        } else {
          store.commit('auth/SET_USER', null);
        }
        authInitialized.value = true;
      });
      
      return () => unsubscribe();
    });
    
    return {
      authInitialized
    };
  }
};
</script>