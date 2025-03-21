<template>
    <DefaultLayout>
      <div class="not-found-view text-center py-5">
        <h1 class="display-1">404</h1>
        <h2 class="mb-4">Page Not Found</h2>
        <p class="lead mb-4">The page you're looking for doesn't exist or has been moved.</p>
        <router-link to="/" class="btn btn-primary">Go Home</router-link>
      </div>
    </DefaultLayout>
  </template>
  
  <script>
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  
  export default {
    name: 'NotFoundView',
    components: {
      DefaultLayout
    }
  };
  </script>