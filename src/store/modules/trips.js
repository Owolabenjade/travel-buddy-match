import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where,
    orderBy
  } from 'firebase/firestore';
  import { db } from '@/firebase';
  
  const state = {
    trips: [],
    currentTrip: null,
    loading: false,
    error: null
  };
  
  const getters = {
    trips: state => state.trips,
    currentTrip: state => state.currentTrip,
    loading: state => state.loading,
    error: state => state.error,
    
    // Get upcoming trips (start date is in the future)
    upcomingTrips: state => {
      const now = new Date();
      return state.trips.filter(trip => {
        const startDate = trip.startDate.toDate ? trip.startDate.toDate() : new Date(trip.startDate);
        return startDate >= now;
      }).sort((a, b) => {
        const dateA = a.startDate.toDate ? a.startDate.toDate() : new Date(a.startDate);
        const dateB = b.startDate.toDate ? b.startDate.toDate() : new Date(b.startDate);
        return dateA - dateB;
      });
    },
    
    // Get past trips (end date is in the past)
    pastTrips: state => {
      const now = new Date();
      return state.trips.filter(trip => {
        const endDate = trip.endDate.toDate ? trip.endDate.toDate() : new Date(trip.endDate);
        return endDate < now;
      }).sort((a, b) => {
        const dateA = a.endDate.toDate ? a.endDate.toDate() : new Date(a.endDate);
        const dateB = b.endDate.toDate ? b.endDate.toDate() : new Date(b.endDate);
        return dateB - dateA; // Sort by most recent first
      });
    }
  };
  
  const actions = {
    // Fetch all trips for a user
    async fetchUserTrips({ commit }, userId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const tripsQuery = query(
          collection(db, 'trips'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(tripsQuery);
        const trips = [];
        
        querySnapshot.forEach((doc) => {
          trips.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        commit('SET_TRIPS', trips);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Fetch a specific trip by ID
    async fetchTrip({ commit }, tripId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const tripDoc = await getDoc(doc(db, 'trips', tripId));
        
        if (tripDoc.exists()) {
          commit('SET_CURRENT_TRIP', {
            id: tripDoc.id,
            ...tripDoc.data()
          });
        } else {
          commit('SET_ERROR', 'Trip not found');
        }
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Create a new trip
    async createTrip({ commit }, tripData) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        // Add created timestamp
        const tripWithTimestamp = {
          ...tripData,
          createdAt: new Date()
        };
        
        const docRef = await addDoc(collection(db, 'trips'), tripWithTimestamp);
        
        // Add the new trip to state with its ID
        const newTrip = {
          id: docRef.id,
          ...tripWithTimestamp
        };
        
        commit('ADD_TRIP', newTrip);
        return docRef.id;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Update an existing trip
    // Update an existing trip
  async updateTrip({ commit }, { tripId, tripData }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const tripRef = doc(db, 'trips', tripId);
      await updateDoc(tripRef, tripData);
      
      // Update the trip in state
      commit('UPDATE_TRIP', { tripId, tripData });
      return tripId;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Delete a trip
  async deleteTrip({ commit }, tripId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      await deleteDoc(doc(db, 'trips', tripId));
      commit('REMOVE_TRIP', tripId);
      return true;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Search for trips based on criteria
  async searchTrips({ commit }, { location, startDate, endDate, activities }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      // Start with a base query
      let tripsQuery = collection(db, 'trips');
      
      // Add filters based on provided criteria
      const filters = [];
      
      if (location) {
        filters.push(where('destination', '==', location));
      }
      
      if (startDate) {
        filters.push(where('startDate', '>=', startDate));
      }
      
      if (endDate) {
        filters.push(where('endDate', '<=', endDate));
      }
      
      // Note: For activities, we'd need a more complex query or client-side filtering
      // as Firestore doesn't directly support filtering arrays by containment
      
      // Execute the query with any filters
      const querySnapshot = filters.length > 0 
        ? await getDocs(query(tripsQuery, ...filters))
        : await getDocs(tripsQuery);
      
      const trips = [];
      
      querySnapshot.forEach((doc) => {
        const trip = { id: doc.id, ...doc.data() };
        
        // Client-side filtering for activities if provided
        if (activities && activities.length > 0) {
          const tripActivities = trip.activities || [];
          const hasMatchingActivity = activities.some(activity => 
            tripActivities.includes(activity)
          );
          
          if (!hasMatchingActivity) {
            return; // Skip this trip if no matching activities
          }
        }
        
        trips.push(trip);
      });
      
      return trips;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

const mutations = {
  SET_TRIPS(state, trips) {
    state.trips = trips;
  },
  SET_CURRENT_TRIP(state, trip) {
    state.currentTrip = trip;
  },
  ADD_TRIP(state, trip) {
    state.trips.unshift(trip);
  },
  UPDATE_TRIP(state, { tripId, tripData }) {
    const index = state.trips.findIndex(trip => trip.id === tripId);
    
    if (index !== -1) {
      state.trips[index] = { ...state.trips[index], ...tripData };
    }
    
    if (state.currentTrip && state.currentTrip.id === tripId) {
      state.currentTrip = { ...state.currentTrip, ...tripData };
    }
  },
  REMOVE_TRIP(state, tripId) {
    state.trips = state.trips.filter(trip => trip.id !== tripId);
    
    if (state.currentTrip && state.currentTrip.id === tripId) {
      state.currentTrip = null;
    }
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};