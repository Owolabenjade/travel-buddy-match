<template>
  <DefaultLayout>
    <div class="home-view">
      <!-- Large Hero Section with Cover Image -->
      <div class="hero-section text-center py-5">
        <div class="container">
          <h1 class="display-3 fw-bold">Travel Buddy Match</h1>
          <p class="lead fs-4 mb-4">
            Connect with like-minded travelers for your next adventure
          </p>
          <div class="cta-buttons mt-5">
            <router-link to="/register" class="btn btn-primary btn-lg me-3 px-4 py-2">
              Start Your Journey
            </router-link>
            <a href="https://your-deployed-app-url.com" target="_blank" class="btn btn-success btn-lg px-4 py-2">
              Try The App
            </a>
          </div>
        </div>
      </div>
      
      <!-- Features Section -->
      <div class="features-section py-5">
        <div class="container">
          <h2 class="text-center mb-5">How It Works</h2>
          <div class="row">
            <div class="col-md-4 mb-4">
              <div class="card h-100 p-4 text-center">
                <div class="feature-icon mb-3">
                  <i class="bi bi-person-plus" style="font-size: 3rem; color: var(--primary-color);"></i>
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
                  <i class="bi bi-map" style="font-size: 3rem; color: var(--primary-color);"></i>
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
                  <i class="bi bi-people" style="font-size: 3rem; color: var(--primary-color);"></i>
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
      
      <!-- Testimonials Section -->
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

<style scoped>
.hero-section {
  padding: 120px 0;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
              url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') center/cover no-repeat;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin-top: -24px; /* To counteract padding from DefaultLayout */
}

.features-section, .testimonials-section {
  padding: 80px 0;
}

.testimonial-text {
  font-style: italic;
  position: relative;
  padding-left: 20px;
  margin-bottom: 20px;
}

.testimonial-text::before {
  content: '"';
  font-size: 40px;
  color: var(--primary-color);
  position: absolute;
  left: -5px;
  top: -10px;
}

.cta-buttons {
  margin-top: 30px;
}

.feature-icon {
  background-color: rgba(70, 130, 180, 0.1);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>