<template>
    <DefaultLayout>
      <div class="trips-view">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1>My Trips</h1>
          <router-link to="/trips/new" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i> New Trip
          </router-link>
        </div>
        
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <div v-else>
          <!-- Upcoming Trips Section -->
          <div class="mb-5">
            <h2 class="mb-3">Upcoming Trips</h2>
            
            <div v-if="upcomingTrips.length === 0" class="text-center py-4 bg-light rounded">
              <i class="bi bi-calendar-plus" style="font-size: 3rem; color: #6c757d;"></i>
              <p class="mt-3 mb-0">You don't have any upcoming trips. Plan your next adventure!</p>
              <router-link to="/trips/new" class="btn btn-outline-primary mt-3">
                Plan a Trip
              </router-link>
            </div>
            
            <div v-else class="row">
              <div v-for="trip in upcomingTrips" :key="trip.id" class="col-md-6 col-lg-4 mb-4">
                <TripCard :trip="trip" @delete-trip="confirmDelete" />
              </div>
            </div>
          </div>
          
          <!-- Past Trips Section -->
          <div>
            <h2 class="mb-3">Past Trips</h2>
            
            <div v-if="pastTrips.length === 0" class="text-center py-4 bg-light rounded">
              <i class="bi bi-hourglass" style="font-size: 3rem; color: #6c757d;"></i>
              <p class="mt-3 mb-0">You don't have any past trips yet.</p>
            </div>
            
            <div v-else class="row">
              <div v-for="trip in pastTrips" :key="trip.id" class="col-md-6 col-lg-4 mb-4">
                <TripCard :trip="trip" :isPast="true" @delete-trip="confirmDelete" />
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
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import TripCard from '@/components/trips/TripCard.vue';
  
  export default {
    name: 'TripsView',
    components: {
      DefaultLayout,
      TripCard
    },
    setup() {
      const store = useStore();
      const showDeleteModal = ref(false);
      const tripToDelete = ref(null);
      
      // Computed properties
      const user = computed(() => store.getters['auth/user']);
      const loading = computed(() => store.getters['trips/loading']);
      const error = computed(() => store.getters['trips/error']);
      const upcomingTrips = computed(() => store.getters['trips/upcomingTrips']);
      const pastTrips = computed(() => store.getters['trips/pastTrips']);
      
      // Fetch trips on mount
      onMounted(async () => {
        if (user.value) {
          await store.dispatch('trips/fetchUserTrips', user.value.uid);
        }
      });
      
      // Methods
      const confirmDelete = (tripId) => {
        tripToDelete.value = tripId;
        showDeleteModal.value = true;
      };
      
      const deleteTrip = async () => {
        if (tripToDelete.value) {
          try {
            await store.dispatch('trips/deleteTrip', tripToDelete.value);
            tripToDelete.value = null;
          } catch (error) {
            console.error('Error deleting trip:', error);
          }
        }
      };
      
      return {
        loading,
        error,
        upcomingTrips,
        pastTrips,
        showDeleteModal,
        confirmDelete,
        deleteTrip
      };
    }
  };
  </script>