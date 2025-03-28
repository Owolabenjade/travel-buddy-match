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
            <a href="https://resilient-donut-a8da6c.netlify.app/" target="_blank" class="btn btn-success btn-lg px-4 py-2">
              Try The App
            </a>
          </div>
        </div>
      </div>
      
      <!-- Key Features Section -->
      <div class="key-features-section py-5">
        <div class="container">
          <h2 class="text-center mb-5">Key Features</h2>
          
          <div class="row align-items-center mb-5">
            <div class="col-lg-6">
              <img src="https://images.unsplash.com/photo-1519003300449-424ad0405076?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" class="img-fluid rounded shadow" alt="Smart Matching">
            </div>
            <div class="col-lg-6">
              <h3 class="feature-title">Smart Matching</h3>
              <p class="feature-desc">
                Our intelligent algorithm matches you with travelers who share your interests, travel style, and destination plans. Find companions who will enhance your journey and create memorable experiences together.
              </p>
            </div>
          </div>
          
          <div class="row align-items-center mb-5 flex-lg-row-reverse">
            <div class="col-lg-6">
              <img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" class="img-fluid rounded shadow" alt="Secure Messaging">
            </div>
            <div class="col-lg-6">
              <h3 class="feature-title">Secure Messaging</h3>
              <p class="feature-desc">
                Connect safely with potential travel buddies through our secure in-app messaging system. Get to know each other, discuss trip details, and plan your adventure while keeping your personal information private.
              </p>
            </div>
          </div>
          
          <div class="row align-items-center">
            <div class="col-lg-6">
              <img src="https://images.unsplash.com/photo-1522199710521-72d69614c702?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" class="img-fluid rounded shadow" alt="Trip Planning">
            </div>
            <div class="col-lg-6">
              <h3 class="feature-title">Trip Planning</h3>
              <p class="feature-desc">
                Organize your journeys with our intuitive trip planning tools. Create detailed itineraries, specify your travel dates, preferences, and activities you're interested in. Share these plans with your matched companions to ensure everyone's on the same page.
              </p>
            </div>
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
      
      <!-- About Section -->
<div class="about-section py-5">
  <div class="container">
    <h2 class="text-center mb-5">About This Project</h2>
    
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="card shadow-sm p-4">
          <h3 class="mb-3">The Inspiration</h3>
          <p>
            The idea for Travel Buddy Match was born out of a personal experience during my backpacking trip across Southeast Asia in 2022. 
            I found myself in Bangkok, eager to explore but hesitant to venture out alone. The hostels were full of fellow travelers, 
            but finding someone with similar interests and itineraries was surprisingly difficult. 
          </p>
          <p>
            After spending hours in hostel common rooms trying to find compatible travel companions, I thought: "There has to be a better way!" 
            That's when the concept of Travel Buddy Match began to take shape – a platform that connects like-minded travelers based on their 
            destinations, interests, and travel styles.
          </p>
          <p>
            I developed this application as my Portfolio Project for ALX Software Engineering Program, 
            building it from concept to completion over eight intense weeks. The journey of creating this platform has been as 
            rewarding as the travels that inspired it.
          </p>
          
          <h3 class="mt-4 mb-3">Developer</h3>
          <div class="developer-info">
            <div class="d-flex align-items-center mb-3">
              <div class="developer-img me-3">
                <i class="bi bi-person-circle" style="font-size: 3rem;"></i>
              </div>
              <div>
                <h4 class="mb-1">Benjamin Owolabi</h4>
                <p class="text-muted mb-2">Full Stack Developer</p>
                <div class="social-links">
                  <a href="https://www.linkedin.com/in/benjaminowolabi" target="_blank" class="me-3" title="LinkedIn">
                    <i class="bi bi-linkedin"></i>
                  </a>
                  <a href="https://www.github.com/owolabenjade" target="_blank" class="me-3" title="GitHub">
                    <i class="bi bi-github"></i>
                  </a>
                  <a href="https://www.twitter.com/ademidowolabi" target="_blank" title="Twitter">
                    <i class="bi bi-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <h3 class="mt-4 mb-3">Project Repository</h3>
          <p>
            This project is open source. You can view the code, contribute, or fork the repository on GitHub:
          </p>
          <a href="https://github.com/Owolabenjade/travel-buddy-match" target="_blank" class="btn btn-outline-primary">
            <i class="bi bi-github me-2"></i>View on GitHub
          </a>
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

.key-features-section {
  background-color: white;
}

.feature-title {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-weight: 600;
}

.feature-desc {
  font-size: 1.1rem;
  line-height: 1.6;
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

/* Add some spacing on mobile devices */
@media (max-width: 992px) {
  .row.align-items-center {
    margin-bottom: 3rem;
  }
  
  .col-lg-6 {
    margin-bottom: 2rem;
  }
}

.about-section {
  background-color: #f8f9fa;
}

.about-section p {
  line-height: 1.7;
  margin-bottom: 1rem;
  font-size: 1.05rem;
}

.social-links a {
  color: var(--primary-color);
  font-size: 1.25rem;
  transition: color 0.2s ease;
}

.social-links a:hover {
  color: #2c5282;
}

.developer-img {
  color: var(--primary-color);
}
</style>