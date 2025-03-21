<template>
    <DefaultLayout>
      <div class="dashboard-view">
        <h1 class="mb-4">Dashboard</h1>
        
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Your Upcoming Trips</h5>
                <p v-if="upcomingTrips.length === 0" class="text-muted">
                  You don't have any upcoming trips.
                </p>
                <ul v-else class="list-group list-group-flush">
                  <li v-for="trip in upcomingTrips.slice(0, 3)" :key="trip.id" class="list-group-item">
                    <router-link :to="`/trips/${trip.id}`">
                      {{ trip.destination }} ({{ formatDate(trip.startDate) }})
                    </router-link>
                  </li>
                </ul>
                <div class="mt-3">
                  <router-link to="/trips" class="btn btn-outline-primary">View All Trips</router-link>
                  <router-link to="/trips/new" class="btn btn-primary ms-2">Add Trip</router-link>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-6 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Your Matches</h5>
                <p v-if="confirmedMatches.length === 0" class="text-muted">
                  You don't have any confirmed travel buddies yet.
                </p>
                <ul v-else class="list-group list-group-flush">
                  <li v-for="match in confirmedMatches.slice(0, 3)" :key="match.id" class="list-group-item">
                    {{ match.destination }} ({{ formatDate(match.startDate) }})
                  </li>
                </ul>
                <div class="mt-3">
                  <router-link to="/matches" class="btn btn-outline-primary">Find Travel Buddies</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  
  export default {
    name: 'DashboardView',
    components: {
      DefaultLayout
    },
    setup() {
      const store = useStore();
      
      const user = computed(() => store.getters['auth/user']);
      const upcomingTrips = computed(() => store.getters['trips/upcomingTrips'] || []);
      const confirmedMatches = computed(() => store.getters['matches/confirmedMatches'] || []);
      
      onMounted(async () => {
        if (user.value) {
          // Load user data
          try {
            await Promise.all([
              store.dispatch('trips/fetchUserTrips', user.value.uid),
              store.dispatch('matches/fetchUserMatches', user.value.uid)
            ]);
          } catch (error) {
            console.error('Error loading dashboard data:', error);
          }
        }
      });
      
      // Helper functions
      const formatDate = (date) => {
        if (!date) return '';
        
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      };
      
      return {
        upcomingTrips,
        confirmedMatches,
        formatDate
      };
    }
  };
  </script>