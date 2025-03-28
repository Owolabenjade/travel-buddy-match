<template>
    <div class="card match-card h-100">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div class="compatibility-badge me-2">
            {{ match.compatibility }}%
          </div>
          <span class="compatibility-text">Compatible</span>
        </div>
      </div>
      
      <div class="card-body">
        <div class="user-info d-flex mb-3">
          <div class="user-avatar me-3">
            <img
              :src="match.user.photoURL || '/img/default-avatar.png'"
              :alt="match.user.displayName"
              class="rounded-circle"
            />
          </div>
          <div>
            <h5 class="mb-1">{{ match.user.displayName }}</h5>
            <div class="user-languages small text-muted">
              <span v-if="match.user.languages && match.user.languages.length">
                Speaks: {{ match.user.languages.join(', ') }}
              </span>
              <span v-else>No languages specified</span>
            </div>
          </div>
        </div>
        
        <div class="trip-info">
          <div class="mb-2">
            <i class="bi bi-calendar me-2"></i>
            {{ formatDateRange(match.trip.startDate, match.trip.endDate) }}
            <span class="badge bg-success ms-2">Overlapping</span>
          </div>
          
          <div v-if="match.trip.activities && match.trip.activities.length" class="mb-2">
            <div class="label">Activities:</div>
            <div class="activities-tags">
              <span
                v-for="(activity, index) in match.trip.activities.slice(0, 3)"
                :key="index"
                class="badge bg-info me-1 mb-1"
              >
                {{ formatActivity(activity) }}
              </span>
              <span v-if="match.trip.activities.length > 3" class="more-badge">
                +{{ match.trip.activities.length - 3 }} more
              </span>
            </div>
          </div>
          
          <div class="travel-style mb-2">
            <div class="label">Style:</div>
            <span class="badge" :class="getBudgetClass(match.trip.budget)">
              {{ formatBudget(match.trip.budget) }}
            </span>
            <span v-if="match.trip.accommodation" class="badge bg-secondary ms-1">
              {{ formatAccommodation(match.trip.accommodation) }}
            </span>
          </div>
          
          <div v-if="match.trip.description" class="trip-description">
            <p class="text-truncate mb-0" :title="match.trip.description">
              "{{ match.trip.description }}"
            </p>
          </div>
        </div>
      </div>
      
      <div class="card-footer">
        <div class="d-grid">
          <button
            class="btn btn-primary"
            @click="$emit('request-match', { userId: match.userId, tripId: match.tripId, user: match.user })"
          >
            <i class="bi bi-person-plus me-2"></i> Connect
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MatchCard',
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    emits: ['request-match'],
    setup() {
      const formatDateRange = (startDate, endDate) => {
        const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
        const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
        
        const options = { month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
      };
      
      const formatActivity = (activity) => {
        return activity.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      };
      
      const formatBudget = (budget) => {
        const budgetMap = {
          'budget': 'Budget',
          'mid_range': 'Mid Range',
          'luxury': 'Luxury'
        };
        
        return budgetMap[budget] || budget;
      };
      
      const getBudgetClass = (budget) => {
        const classMap = {
          'budget': 'bg-success',
          'mid_range': 'bg-primary',
          'luxury': 'bg-warning'
        };
        
        return classMap[budget] || 'bg-secondary';
      };
      
      const formatAccommodation = (accommodation) => {
        if (!accommodation) return null;
        
        return accommodation.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      };
      
      return {
        formatDateRange,
        formatActivity,
        formatBudget,
        getBudgetClass,
        formatAccommodation
      };
    }
  };
  </script>
  
  <style scoped>
  .match-card {
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .compatibility-badge {
      background-color: #4682B4;
      color: white;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    
    .compatibility-text {
      font-size: 0.875rem;
      color: #4682B4;
    }
    
    .user-avatar {
      img {
        width: 60px;
        height: 60px;
        object-fit: cover;
      }
    }
    
    .label {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .activities-tags {
      margin-top: 0.25rem;
    }
    
    .more-badge {
      font-size: 0.75rem;
      color: #6c757d;
    }
    
    .trip-description {
      margin-top: 0.5rem;
      font-style: italic;
      color: #6c757d;
    }
  }
  </style>