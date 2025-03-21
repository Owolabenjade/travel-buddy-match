<template>
    <DefaultLayout>
      <div class="home-view">
        <div class="hero-section text-center py-5">
          <h1 class="display-4">Find Your Perfect Travel Companion</h1>
          <p class="lead mb-4">
            Connect with like-minded travelers for your next adventure
          </p>
          <div class="cta-buttons">
            <router-link to="/register" class="btn btn-primary btn-lg me-3">
              Start Your Journey
            </router-link>
            <router-link to="/login" class="btn btn-outline-secondary btn-lg">
              Sign In
            </router-link>
          </div>
        </div>
        
        <div class="features-section py-5">
          <div class="container">
            <h2 class="text-center mb-5">How It Works</h2>
            <div class="row">
              <div class="col-md-4 mb-4">
                <div class="card h-100 p-4 text-center">
                  <div class="feature-icon mb-3">
                    <i class="bi bi-person-plus" style="font-size: 3rem; color: #4682B4;"></i>
                  </div>
                  <h3>Create Your Profile</h3>
                  <p>
                    Tell us about yourself, your travel style, and what you're looking for in a travel buddy.
                  </p>
                </div>
              </div>
              
              <div class="col-md-4 mb-4">
                <div class="card h-100 p-4 text-center">
                  <div class="feature-icon mb-3">
                    <i class="bi bi-map" style="font-size: 3rem; color: #4682B4;"></i>
                  </div>
                  <h3>Plan Your Trip</h3>
                  <p>
                    Add your travel plans including destination, dates, and activities you're interested in.
                  </p>
                </div>
              </div>
              
              <div class="col-md-4 mb-4">
                <div class="card h-100 p-4 text-center">
                  <div class="feature-icon mb-3">
                    <i class="bi bi-people" style="font-size: 3rem; color: #4682B4;"></i>
                  </div>
                  <h3>Match & Connect</h3>
                  <p>
                    We'll match you with compatible travelers and help you connect to plan your adventure together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="testimonials-section py-5 bg-light">
          <div class="container">
            <h2 class="text-center mb-5">Traveler Stories</h2>
            <div class="row">
              <div class="col-md-4 mb-4">
                <div class="card h-100 p-4">
                  <p class="testimonial-text">
                    "I was nervous about traveling alone, but Travel Buddy Match helped me find the perfect companion for my trip to Thailand. We're now great friends!"
                  </p>
                  <div class="testimonial-author">
                    <strong>Sarah, 28</strong> - London, UK
                  </div>
                </div>
              </div>
              
              <div class="col-md-4 mb-4">
                <div class="card h-100 p-4">
                  <p class="testimonial-text">
                    "Thanks to this app, I found someone with the same interests to explore Japan with. It made the experience so much better than going solo."
                  </p>
                  <div class="testimonial-author">
                    <strong>Miguel, 34</strong> - Barcelona, Spain
                  </div>
                </div>
              </div>
              
              <div class="col-md-4 mb-4">
                <div class="card h-100 p-4">
                  <p class="testimonial-text">
                    "As a solo female traveler, safety was my concern. This platform helped me connect with trustworthy companions for my South America backpacking trip."
                  </p>
                  <div class="testimonial-author">
                    <strong>Emma, 25</strong> - Toronto, Canada
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  </template>
  
  <script>
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  
  export default {
    name: 'HomeView',
    components: {
      DefaultLayout
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .hero-section {
    padding: 80px 0;
    background: linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7)), 
                url('../assets/hero-bg.jpg') center/cover no-repeat;
  }
  
  .features-section, .testimonials-section {
    padding: 60px 0;
  }
  
  .testimonial-text {
    font-style: italic;
    margin-bottom: 20px;
  }
  
  .cta-buttons {
    margin-top: 30px;
  }
  </style>