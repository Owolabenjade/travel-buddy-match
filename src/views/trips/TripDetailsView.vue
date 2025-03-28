<template>
    <DefaultLayout>
      <div class="trip-details-view">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <div v-else-if="trip">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <router-link to="/trips" class="btn btn-sm btn-outline-secondary mb-2">
                <i class="bi bi-arrow-left"></i> Back to Trips
              </router-link>
              <h1>{{ trip.destination }}</h1>
            </div>
            
            <div class="trip-actions">
              <router-link :to="`/trips/${trip.id}/edit`" class="btn btn-outline-primary me-2">
                <i class="bi bi-pencil"></i> Edit
              </router-link>
              <button class="btn btn-danger" @click="confirmDelete">
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-8">
              <div class="card mb-4">
                <div class="card-header">
                  <h3>Trip Details</h3>
                </div>
                <div class="card-body">
                  <div class="trip-dates mb-4">
                    <h5><i class="bi bi-calendar-date me-2"></i> When</h5>
                    <p class="mb-0">{{ formatDateRange(trip.startDate, trip.endDate) }}</p>
                    <p class="text-muted">
                      <span class="badge" :class="getTripStatusClass(trip.startDate, trip.endDate)">
                        {{ getTripStatus(trip.startDate, trip.endDate) }}
                      </span>
                    </p>
                  </div>
                  
                  <div class="trip-description mb-4">
                    <h5><i class="bi bi-card-text me-2"></i> Description</h5>
                    <p>{{ trip.description || 'No description provided.' }}</p>
                  </div>
                  
                  <div class="trip-activities mb-4">
                    <h5><i class="bi bi-stars me-2"></i> Activities</h5>
                    <div class="activity-tags">
                      <span
                        v-for="(activity, index) in trip.activities"
                        :key="index"
                        class="badge bg-info me-2 mb-2 p-2"
                      >
                        {{ formatActivity(activity) }}
                      </span>
                      <span v-if="!trip.activities || trip.activities.length === 0" class="text-muted">
                        No activities specified
                      </span>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6 mb-4">
                      <h5><i class="bi bi-cash-coin me-2"></i> Budget</h5>
                      <span class="badge" :class="getBudgetClass(trip.budget)">
                        {{ formatBudget(trip.budget) }}
                      </span>
                    </div>
                    
                    <div class="col-md-6 mb-4">
                      <h5><i class="bi bi-house-door me-2"></i> Accommodation</h5>
                      <p>{{ formatAccommodation(trip.accommodation) || 'No preference' }}</p>
                    </div>
                  </div>
                  
                  <div class="trip-looking-for">
                    <h5><i class="bi bi-people me-2"></i> Looking For</h5>
                    <div class="looking-for-tags">
                      <span
                        v-for="(item, index) in trip.lookingFor"
                        :key="index"
                        class="badge bg-primary me-2 mb-2 p-2"
                      >
                        {{ formatLookingFor(item) }}
                      </span>
                      <span v-if="!trip.lookingFor || trip.lookingFor.length === 0" class="text-muted">
                        Not specified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="card mb-4">
                <div class="card-header">
                <h3>Match Status</h3>
              </div>
              <div class="card-body">
                <div v-if="isPastTrip" class="text-center py-3">
                  <i class="bi bi-clock-history" style="font-size: 2rem; color: #6c757d;"></i>
                  <p class="mt-3 mb-0">This trip is in the past.</p>
                </div>
                
                <div v-else>
                  <div v-if="!trip.isPublic" class="text-center py-3">
                    <i class="bi bi-eye-slash" style="font-size: 2rem; color: #6c757d;"></i>
                    <p class="mt-3 mb-0">This trip is private and not visible to other travelers.</p>
                    <button class="btn btn-outline-primary mt-3" @click="makePublic">Make Public</button>
                  </div>
                  
                  <div v-else class="text-center py-3">
                    <i class="bi bi-people" style="font-size: 2rem; color: #4682B4;"></i>
                    <p class="mt-3 mb-0">This trip is visible to other travelers!</p>
                    <p class="text-muted">You'll be notified when someone wants to connect.</p>
                    <button class="btn btn-outline-secondary mt-3" @click="makePrivate">Make Private</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header">
                <h3>Potential Matches</h3>
              </div>
              <div class="card-body">
                <div class="text-center py-3">
                  <i class="bi bi-search" style="font-size: 2rem; color: #4682B4;"></i>
                  <p class="mt-3 mb-0">Looking for compatible travel buddies...</p>
                  <router-link to="/matches" class="btn btn-primary mt-3">
                    Find Matches
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <b-modal
        v-model="showDeleteModal"
        title="Confirm Deletion"
        ok-title="Delete"
        ok-variant="danger"
        @ok="deleteTrip"
      >
        <p class="my-2">Are you sure you want to delete this trip? This action cannot be undone.</p>
      </b-modal>
    </div>
  </DefaultLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

export default {
  name: 'TripDetailsView',
  components: {
    DefaultLayout
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    const tripId = route.params.id;
    const showDeleteModal = ref(false);
    
    // Computed properties
    const loading = computed(() => store.getters['trips/loading']);
    const error = computed(() => store.getters['trips/error']);
    const trip = computed(() => store.getters['trips/currentTrip']);
    
    // Check if the trip is in the past
    const isPastTrip = computed(() => {
      if (!trip.value) return false;
      
      const now = new Date();
      const endDate = trip.value.endDate.toDate ? trip.value.endDate.toDate() : new Date(trip.value.endDate);
      
      return endDate < now;
    });
    
    // Fetch trip data on mount
    onMounted(async () => {
      await store.dispatch('trips/fetchTrip', tripId);
    });
    
    // Methods
    const formatDateRange = (startDate, endDate) => {
      const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
      const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
    };
    
    const getTripStatus = (startDate, endDate) => {
      const now = new Date();
      const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
      const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
      
      if (now < start) {
        return 'Upcoming';
      } else if (now > end) {
        return 'Past';
      } else {
        return 'In Progress';
      }
    };
    
    const getTripStatusClass = (startDate, endDate) => {
      const status = getTripStatus(startDate, endDate);
      
      const classMap = {
        'Upcoming': 'bg-info',
        'In Progress': 'bg-success',
        'Past': 'bg-secondary'
      };
      
      return classMap[status] || 'bg-secondary';
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
    
    const formatLookingFor = (item) => {
      return item.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };
    
    const confirmDelete = () => {
      showDeleteModal.value = true;
    };
    
    const deleteTrip = async () => {
      try {
        await store.dispatch('trips/deleteTrip', tripId);
        router.push('/trips');
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    };
    
    const makePublic = async () => {
      try {
        await store.dispatch('trips/updateTrip', {
          tripId,
          tripData: { isPublic: true }
        });
      } catch (error) {
        console.error('Error updating trip visibility:', error);
      }
    };
    
    const makePrivate = async () => {
      try {
        await store.dispatch('trips/updateTrip', {
          tripId,
          tripData: { isPublic: false }
        });
      } catch (error) {
        console.error('Error updating trip visibility:', error);
      }
    };
    
    return {
      loading,
      error,
      trip,
      isPastTrip,
      showDeleteModal,
      formatDateRange,
      getTripStatus,
      getTripStatusClass,
      formatActivity,
      formatBudget,
      getBudgetClass,
      formatAccommodation,
      formatLookingFor,
      confirmDelete,
      deleteTrip,
      makePublic,
      makePrivate
    };
  }
};
</script>

<style scoped>
.trip-details-view {
  h5 {
    margin-bottom: 1rem;
  }
  
  .activity-tags, .looking-for-tags {
    margin-top: 10px;
  }
}
</style>