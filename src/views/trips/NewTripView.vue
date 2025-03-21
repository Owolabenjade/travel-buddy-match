<template>
    <DefaultLayout>
      <div class="new-trip-view">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1>Plan a New Trip</h1>
          <router-link to="/trips" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-2"></i> Back to Trips
          </router-link>
        </div>
        
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="createTrip">
              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>
              
              <div class="mb-3">
                <label for="destination" class="form-label">Destination*</label>
                <input
                  type="text"
                  class="form-control"
                  id="destination"
                  v-model="tripForm.destination"
                  required
                  placeholder="Where are you going?"
                />
              </div>
              
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="startDate" class="form-label">Start Date*</label>
                  <input
                    type="date"
                    class="form-control"
                    id="startDate"
                    v-model="tripForm.startDate"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label for="endDate" class="form-label">End Date*</label>
                  <input
                    type="date"
                    class="form-control"
                    id="endDate"
                    v-model="tripForm.endDate"
                    required
                  />
                  <div v-if="dateError" class="text-danger mt-1">
                    {{ dateError }}
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="description" class="form-label">Trip Description</label>
                <textarea
                  class="form-control"
                  id="description"
                  rows="4"
                  v-model="tripForm.description"
                  placeholder="Describe your travel plans and what you're looking for in a travel buddy..."
                ></textarea>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Activities</label>
                <div class="activity-checkboxes row">
                  <div class="col-md-4 mb-2" v-for="activity in availableActivities" :key="activity.value">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :id="`activity-${activity.value}`"
                        :value="activity.value"
                        v-model="tripForm.activities"
                      />
                      <label class="form-check-label" :for="`activity-${activity.value}`">
                        {{ activity.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Budget Level*</label>
                <div class="row budget-options">
                  <div class="col-md-4 mb-2">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="budget-budget"
                        value="budget"
                        v-model="tripForm.budget"
                        required
                      />
                      <label class="form-check-label" for="budget-budget">
                        Budget
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4 mb-2">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="budget-mid"
                        value="mid_range"
                        v-model="tripForm.budget"
                        required
                      />
                      <label class="form-check-label" for="budget-mid">
                        Mid Range
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4 mb-2">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="budget-luxury"
                        value="luxury"
                        v-model="tripForm.budget"
                        required
                      />
                      <label class="form-check-label" for="budget-luxury">
                        Luxury
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Accommodation Preference</label>
                <select class="form-select" v-model="tripForm.accommodation">
                  <option value="">No preference</option>
                  <option value="hostel">Hostel</option>
                  <option value="budget_hotel">Budget Hotel</option>
                  <option value="mid_range_hotel">Mid-range Hotel</option>
                  <option value="luxury_hotel">Luxury Hotel</option>
                  <option value="airbnb">Airbnb / Vacation Rental</option>
                  <option value="camping">Camping</option>
                </select>
              </div>
              
              <div class="mb-3">
                <label class="form-label">Looking For</label>
                <div class="row looking-for-options">
                  <div class="col-md-4 mb-2">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="looking-companion"
                        value="travel_companion"
                        v-model="tripForm.lookingFor"
                      />
                      <label class="form-check-label" for="looking-companion">
                        Travel Companion
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4 mb-2">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="looking-tips"
                        value="local_tips"
                        v-model="tripForm.lookingFor"
                      />
                      <label class="form-check-label" for="looking-tips">
                        Local Tips
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4 mb-2">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="looking-meetup"
                        value="meetup"
                        v-model="tripForm.lookingFor"
                      />
                      <label class="form-check-label" for="looking-meetup">
                        Meetup
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mb-3 form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="public"
                  v-model="tripForm.isPublic"
                />
                <label class="form-check-label" for="public">
                  Make this trip visible to other travelers
                </label>
              </div>
              
              <div class="text-end mt-4">
                <router-link to="/trips" class="btn btn-outline-secondary me-2">
                  Cancel
                </router-link>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading || !isFormValid"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Create Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  </template>
  
  <script>
  import { ref, reactive, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  
  export default {
    name: 'NewTripView',
    components: {
      DefaultLayout
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const loading = ref(false);
      const error = ref(null);
      const dateError = ref(null);
      
      // Trip form data
      const tripForm = reactive({
        destination: '',
        startDate: '',
        endDate: '',
        description: '',
        activities: [],
        budget: '',
        accommodation: '',
        lookingFor: [],
        isPublic: true
      });
      
      // Available activities
      const availableActivities = [
        { value: 'sightseeing', label: 'Sightseeing' },
        { value: 'hiking', label: 'Hiking' },
        { value: 'food', label: 'Food & Dining' },
        { value: 'beaches', label: 'Beaches' },
        { value: 'museums', label: 'Museums' },
        { value: 'nightlife', label: 'Nightlife' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'photography', label: 'Photography' },
        { value: 'adventure', label: 'Adventure Activities' },
        { value: 'relaxation', label: 'Relaxation' },
        { value: 'cultural', label: 'Cultural Experiences' },
        { value: 'wildlife', label: 'Wildlife' }
      ];
      
      // Computed property to check if the form is valid
      const isFormValid = computed(() => {
        return tripForm.destination.trim() !== '' && 
               tripForm.startDate !== '' && 
               tripForm.endDate !== '' && 
               tripForm.budget !== '' && 
               !dateError.value;
      });
      
      // Watch for changes to dates and validate
      watch([() => tripForm.startDate, () => tripForm.endDate], ([newStartDate, newEndDate]) => {
        if (newStartDate && newEndDate) {
          const startDate = new Date(newStartDate);
          const endDate = new Date(newEndDate);
          
          if (endDate < startDate) {
            dateError.value = 'End date cannot be before start date';
          } else {
            dateError.value = null;
          }
        }
      });
      
      // Methods
      const createTrip = async () => {
        if (!isFormValid.value) return;
        
        loading.value = true;
        error.value = null;
        
        try {
          const user = store.getters['auth/user'];
          if (!user) throw new Error('You must be logged in to create a trip');
          
          // Prepare trip data
          const tripData = {
            ...tripForm,
            userId: user.uid,
            createdBy: user.displayName || 'Anonymous',
            startDate: new Date(tripForm.startDate),
            endDate: new Date(tripForm.endDate),
            createdAt: new Date()
          };
          
          // Create trip in Firestore
          const tripId = await store.dispatch('trips/createTrip', tripData);
          
          // Redirect to trip details page
          router.push(`/trips/${tripId}`);
        } catch (err) {
          console.error('Error creating trip:', err);
          error.value = err.message;
        } finally {
          loading.value = false;
        }
      };
      
      return {
        loading,
        error,
        dateError,
        tripForm,
        availableActivities,
        isFormValid,
        createTrip
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .activity-checkboxes, .budget-options, .looking-for-options {
    margin-top: 8px;
  }
  </style>