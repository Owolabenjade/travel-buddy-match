<template>
    <DefaultLayout>
      <div class="matches-view">
        <h1 class="mb-4">Travel Buddies</h1>
        
        <div class="matches-tabs mb-4">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeTab === 'find' }"
                href="#" 
                @click.prevent="setActiveTab('find')"
              >
                Find Travel Buddies
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeTab === 'pending' }"
                href="#" 
                @click.prevent="setActiveTab('pending')"
              >
                Pending Requests
                <span 
                  v-if="pendingMatches.length" 
                  class="badge bg-primary ms-2"
                >
                  {{ pendingMatches.length }}
                </span>
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeTab === 'confirmed' }"
                href="#" 
                @click.prevent="setActiveTab('confirmed')"
              >
                Confirmed Buddies
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Find Travel Buddies Tab -->
        <div v-if="activeTab === 'find'" class="find-matches-tab">
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Select a Trip to Find Matches</h5>
              <p class="card-text">Choose one of your upcoming trips to find potential travel buddies with similar interests and overlapping dates.</p>
              
              <div v-if="loading" class="text-center py-3">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              
              <div v-else-if="upcomingTrips.length === 0" class="text-center py-3">
                <i class="bi bi-calendar-plus" style="font-size: 3rem; color: #6c757d;"></i>
                <p class="mt-3 mb-0">You don't have any upcoming trips. Plan a trip to find travel companions!</p>
                <router-link to="/trips/new" class="btn btn-outline-primary mt-3">
                  Plan a Trip
                </router-link>
              </div>
              
              <div v-else>
                <div class="form-group">
                  <label for="trip-select" class="form-label">Select a trip:</label>
                  <select 
                    id="trip-select" 
                    class="form-select" 
                    v-model="selectedTripId"
                    @change="findMatches"
                  >
                    <option value="">-- Select a trip --</option>
                    <option 
                      v-for="trip in upcomingTrips" 
                      :key="trip.id" 
                      :value="trip.id"
                    >
                      {{ trip.destination }} ({{ formatDateRange(trip.startDate, trip.endDate) }})
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Potential Matches Results -->
          <div v-if="selectedTripId">
            <div v-if="matchesLoading" class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading matches...</span>
              </div>
              <p class="mt-3">Finding your perfect travel buddies...</p>
            </div>
            
            <div v-else-if="potentialMatches.length === 0" class="card">
              <div class="card-body text-center py-5">
                <i class="bi bi-search" style="font-size: 3rem; color: #6c757d;"></i>
                <h5 class="mt-3">No Matches Found</h5>
                <p class="mb-0">We couldn't find any travelers with overlapping trips to {{ selectedTripDestination }}.</p>
                <p class="text-muted">Try another destination or check back later as more travelers plan their trips.</p>
              </div>
            </div>
            
            <div v-else>
              <h4 class="mb-3">Potential Travel Buddies for {{ selectedTripDestination }}</h4>
              
              <div class="row">
                <div 
                  v-for="match in potentialMatches" 
                  :key="match.tripId" 
                  class="col-md-6 col-lg-4 mb-4"
                >
                  <MatchCard 
                    :match="match" 
                    @request-match="handleRequestMatch"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pending Requests Tab -->
        <div v-if="activeTab === 'pending'" class="pending-matches-tab">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <div v-else-if="pendingMatches.length === 0" class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-hourglass" style="font-size: 3rem; color: #6c757d;"></i>
              <h5 class="mt-3">No Pending Requests</h5>
              <p class="mb-0">You don't have any pending match requests at the moment.</p>
            </div>
          </div>
          
          <div v-else>
            <div class="row">
              <div 
                v-for="match in pendingMatches" 
                :key="match.id" 
                class="col-lg-6 mb-4"
              >
                <PendingMatchCard 
                  :match="match" 
                  @accept-match="acceptMatch"
                  @decline-match="declineMatch"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Confirmed Buddies Tab -->
        <div v-if="activeTab === 'confirmed'" class="confirmed-matches-tab">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          
          <div v-else-if="confirmedMatches.length === 0" class="card">
            <div class="card-body text-center py-5">
              <i class="bi bi-people" style="font-size: 3rem; color: #6c757d;"></i>
              <h5 class="mt-3">No Confirmed Travel Buddies Yet</h5>
              <p class="mb-0">Start by finding potential matches and sending requests!</p>
              <button class="btn btn-primary mt-3" @click="setActiveTab('find')">
                Find Travel Buddies
              </button>
            </div>
          </div>
          
          <div v-else>
            <div class="row">
              <div 
                v-for="match in confirmedMatches" 
                :key="match.id" 
                class="col-lg-6 mb-4"
              >
                <ConfirmedMatchCard 
                  :match="match" 
                  @view-messages="goToMessages"
                  @delete-match="confirmDeleteMatch"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Match Request Modal -->
        <b-modal
          v-model="showRequestModal"
          title="Request to Connect"
          ok-title="Send Request"
          ok-variant="primary"
          @ok="sendMatchRequest"
        >
          <p>
            Send a match request to <strong>{{ requestMatch.userName }}</strong> for your trip to <strong>{{ selectedTripDestination }}</strong>.
          </p>
          <div class="form-group">
            <label for="request-message" class="form-label">Add a personal message (optional):</label>
            <textarea
              id="request-message"
              class="form-control"
              rows="4"
              v-model="requestMatch.message"
              placeholder="Introduce yourself and explain why you'd make good travel companions..."
            ></textarea>
          </div>
        </b-modal>
        
        <!-- Delete Match Confirmation Modal -->
        <b-modal
          v-model="showDeleteModal"
          title="Confirm Disconnection"
          ok-title="Disconnect"
          ok-variant="danger"
          @ok="deleteMatch"
        >
          <p class="my-2">Are you sure you want to disconnect from this travel buddy? This action cannot be undone.</p>
        </b-modal>
      </div>
    </DefaultLayout>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  import MatchCard from '@/components/matches/MatchCard.vue';
  import PendingMatchCard from '@/components/matches/PendingMatchCard.vue';
  import ConfirmedMatchCard from '@/components/matches/ConfirmedMatchCard.vue';
  
  export default {
    name: 'MatchesView',
    components: {
      DefaultLayout,
      MatchCard,
      PendingMatchCard,
      ConfirmedMatchCard
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      
      // State
      const activeTab = ref('find');
      const selectedTripId = ref('');
      const matchesLoading = ref(false);
      const showRequestModal = ref(false);
      const showDeleteModal = ref(false);
      const requestMatch = ref({
        userId: '',
        tripId: '',
        userName: '',
        message: ''
      });
      const matchToDelete = ref(null);
      
      // Computed properties
      const user = computed(() => store.getters['auth/user']);
      const loading = computed(() => store.getters['matches/loading'] || store.getters['trips/loading']);
      const error = computed(() => store.getters['matches/error']);
      const upcomingTrips = computed(() => store.getters['trips/upcomingTrips']);
      const potentialMatches = computed(() => store.getters['matches/potentialMatches']);
      const pendingMatches = computed(() => store.getters['matches/pendingMatches']);
      const confirmedMatches = computed(() => store.getters['matches/confirmedMatches']);
      
      const selectedTripDestination = computed(() => {
        if (!selectedTripId.value) return '';
        
        const trip = upcomingTrips.value.find(trip => trip.id === selectedTripId.value);
        return trip ? trip.destination : '';
      });
      
      // Fetch data on mount
      onMounted(async () => {
        if (user.value) {
          await Promise.all([
            store.dispatch('trips/fetchUserTrips', user.value.uid),
            store.dispatch('matches/fetchUserMatches', user.value.uid)
          ]);
        }
      });
      
      // Methods
      const setActiveTab = (tab) => {
        activeTab.value = tab;
      };
      
      const formatDateRange = (startDate, endDate) => {
        const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
        const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
        
        const options = { month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
      };
      
      const findMatches = async () => {
        if (!selectedTripId.value || !user.value) return;
        
        matchesLoading.value = true;
        
        try {
          await store.dispatch('matches/findPotentialMatches', {
            tripId: selectedTripId.value,
            userId: user.value.uid
          });
        } catch (error) {
          console.error('Error finding matches:', error);
        } finally {
          matchesLoading.value = false;
        }
      };
      
      const handleRequestMatch = (matchData) => {
        requestMatch.value = {
            userId: matchData.userId,
            tripId: matchData.tripId,
            userName: matchData.user.displayName || 'this traveler',
            message: ''
        };
        showRequestModal.value = true;
        };
      
      const sendMatchRequest = async () => {
        if (!selectedTripId.value || !requestMatch.value.tripId) return;
        
        try {
          await store.dispatch('matches/requestMatch', {
            requesterTripId: selectedTripId.value,
            recipientTripId: requestMatch.value.tripId,
            message: requestMatch.value.message
          });
          
          // Clear form and show success message
          requestMatch.value = {
            userId: '',
            tripId: '',
            userName: '',
            message: ''
          };
          
          // Show success notification
          // This would typically be handled by a notification system
        } catch (error) {
          console.error('Error sending match request:', error);
        }
      };
      
      const acceptMatch = async (matchId) => {
        try {
          await store.dispatch('matches/acceptMatch', matchId);
          // Show success notification
        } catch (error) {
          console.error('Error accepting match:', error);
        }
      };
      
      const declineMatch = async (matchId) => {
        try {
          await store.dispatch('matches/declineMatch', matchId);
          // Show success notification
        } catch (error) {
          console.error('Error declining match:', error);
        }
      };
      
      const confirmDeleteMatch = (matchId) => {
        matchToDelete.value = matchId;
        showDeleteModal.value = true;
      };
      
      const deleteMatch = async () => {
        if (!matchToDelete.value) return;
        
        try {
          await store.dispatch('matches/deleteMatch', matchToDelete.value);
          matchToDelete.value = null;
          // Show success notification
        } catch (error) {
          console.error('Error deleting match:', error);
        }
      };
      
      const goToMessages = (matchId) => {
        router.push(`/messages/${matchId}`);
      };
      
      // Watch for trip changes to reset match results
      watch(() => selectedTripId.value, (newValue) => {
        if (!newValue) {
          store.commit('matches/SET_POTENTIAL_MATCHES', []);
        }
      });
      
      return {
        activeTab,
        selectedTripId,
        matchesLoading,
        loading,
        error,
        upcomingTrips,
        potentialMatches,
        pendingMatches,
        confirmedMatches,
        selectedTripDestination,
        showRequestModal,
        showDeleteModal,
        requestMatch,
        setActiveTab,
        formatDateRange,
        findMatches,
        requestMatch,
        sendMatchRequest,
        acceptMatch,
        declineMatch,
        confirmDeleteMatch,
        deleteMatch,
        goToMessages
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .matches-view {
    .nav-tabs {
      border-bottom: 1px solid #dee2e6;
      
      .nav-link {
        color: #495057;
        background-color: transparent;
        border: 1px solid transparent;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        padding: 0.5rem 1rem;
        font-weight: 500;
        
        &:hover {
          border-color: #e9ecef #e9ecef #dee2e6;
        }
        
        &.active {
          color: #4682B4;
          background-color: #fff;
          border-color: #dee2e6 #dee2e6 #fff;
        }
      }
    }
  }
  </style>