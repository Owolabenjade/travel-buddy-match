<template>
    <div class="card trip-card h-100">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">{{ trip.destination }}</h5>
        <div class="dropdown">
          <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <router-link :to="`/trips/${trip.id}`" class="dropdown-item">
                <i class="bi bi-eye me-2"></i> View Details
              </router-link>
            </li>
            <li>
              <router-link :to="`/trips/${trip.id}/edit`" class="dropdown-item">
                <i class="bi bi-pencil me-2"></i> Edit Trip
              </router-link>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <button class="dropdown-item text-danger" @click="$emit('delete-trip', trip.id)">
                <i class="bi bi-trash me-2"></i> Delete Trip
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="card-body">
        <div class="trip-dates mb-3">
          <i class="bi bi-calendar-date me-2"></i>
          {{ formatDateRange(trip.startDate, trip.endDate) }}
          <span v-if="isPast" class="badge bg-secondary ms-2">Past</span>
        </div>
        
        <p class="card-text">{{ trip.description || 'No description provided.' }}</p>
        
        <div class="trip-activities">
          <h6>Activities:</h6>
          <div class="activity-tags">
            <span
              v-for="(activity, index) in trip.activities"
              :key="index"
              class="badge bg-info me-2 mb-2"
            >
              {{ formatActivity(activity) }}
            </span>
            <span v-if="!trip.activities || trip.activities.length === 0" class="text-muted">
              No activities specified
            </span>
          </div>
        </div>
      </div>
      
      <div class="card-footer d-flex justify-content-between align-items-center">
        <div>
          <span class="badge" :class="getBudgetClass(trip.budget)">
            {{ formatBudget(trip.budget) }}
          </span>
        </div>
        
        <router-link :to="`/trips/${trip.id}`" class="btn btn-sm btn-primary">
          Details
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TripCard',
    props: {
      trip: {
        type: Object,
        required: true
      },
      isPast: {
        type: Boolean,
        default: false
      }
    },
    emits: ['delete-trip'],
    setup() {
      // Helper methods
      const formatDateRange = (startDate, endDate) => {
        const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
        const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
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
      
      return {
        formatDateRange,
        formatActivity,
        formatBudget,
        getBudgetClass
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .trip-card {
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
  }
  
  .activity-tags {
    margin-top: 8px;
  }
  </style>