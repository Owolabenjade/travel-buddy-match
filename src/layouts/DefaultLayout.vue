<template>
    <div class="layout-default">
      <Navbar />
      <main class="container py-4">
        <slot></slot>
      </main>
      <footer class="footer mt-auto py-3 bg-light">
        <div class="container text-center">
          <span class="text-muted">© 2023 Travel Buddy Match. All rights reserved.</span>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  import Navbar from '@/components/common/Navbar.vue';
  
  export default {
    name: 'DefaultLayout',
    components: {
      Navbar
    }
  };
  </script>
  
  <style scoped>
  .layout-default {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    
    main {
      flex: 1;
    }
    
    .footer {
      margin-top: auto;
    }
  }
  </style>