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
  } from 'firebase/firestore';
  import { db } from '@/firebase';
  
  const state = {
    matches: [],
    potentialMatches: [],
    loading: false,
    error: null
  };
  
  const getters = {
    matches: state => state.matches,
    potentialMatches: state => state.potentialMatches,
    loading: state => state.loading,
    error: state => state.error,
    
    pendingMatches: state => {
      return state.matches.filter(match => match.status === 'pending');
    },
    
    confirmedMatches: state => {
      return state.matches.filter(match => match.status === 'confirmed');
    }
  };
  
  const actions = {
    // Fetch all matches for a user
    async fetchUserMatches({ commit }, userId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        // Get matches where the user is either the requester or the recipient
        const requesterQuery = query(
          collection(db, 'matches'),
          where('requesterId', '==', userId)
        );
        
        const recipientQuery = query(
          collection(db, 'matches'),
          where('recipientId', '==', userId)
        );
        
        const [requesterSnapshot, recipientSnapshot] = await Promise.all([
          getDocs(requesterQuery),
          getDocs(recipientQuery)
        ]);
        
        const matches = [];
        
        // Process matches where user is the requester
        requesterSnapshot.forEach(doc => {
          matches.push({
            id: doc.id,
            ...doc.data(),
            isRequester: true
          });
        });
        
        // Process matches where user is the recipient
        recipientSnapshot.forEach(doc => {
          // Avoid duplicates if somehow both conditions are true
          if (!matches.some(match => match.id === doc.id)) {
            matches.push({
              id: doc.id,
              ...doc.data(),
              isRequester: false
            });
          }
        });
        
        commit('SET_MATCHES', matches);
        return matches;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Find potential match candidates for a trip
    async findPotentialMatches({ commit }, { tripId, userId }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        // First get the trip details
        const tripDoc = await getDoc(doc(db, 'trips', tripId));
        
        if (!tripDoc.exists()) {
          throw new Error('Trip not found');
        }
        
        const trip = tripDoc.data();
        
        // Query for public trips with overlapping dates in the same destination
        const tripsQuery = query(
          collection(db, 'trips'),
          where('destination', '==', trip.destination),
          where('isPublic', '==', true),
          where('userId', '!=', userId) // Exclude the user's own trips
        );
        
        const tripsSnapshot = await getDocs(tripsQuery);
        const potentialMatches = [];
        
        // Process each potential match
        for (const doc of tripsSnapshot.docs) {
          const matchTrip = {
            id: doc.id,
            ...doc.data()
          };
          
          // Convert dates for comparison
          const tripStartDate = trip.startDate.toDate ? trip.startDate.toDate() : new Date(trip.startDate);
          const tripEndDate = trip.endDate.toDate ? trip.endDate.toDate() : new Date(trip.endDate);
          const matchStartDate = matchTrip.startDate.toDate ? matchTrip.startDate.toDate() : new Date(matchTrip.startDate);
          const matchEndDate = matchTrip.endDate.toDate ? matchTrip.endDate.toDate() : new Date(matchTrip.endDate);
          
          // Check if dates overlap
          const datesOverlap = (
            (tripStartDate <= matchEndDate && tripStartDate >= matchStartDate) ||
            (tripEndDate >= matchStartDate && tripEndDate <= matchEndDate) ||
            (tripStartDate <= matchStartDate && tripEndDate >= matchEndDate)
          );
          
          if (datesOverlap) {
            // Get user profile for this potential match
            const userProfile = await getDoc(doc(db, 'users', matchTrip.userId));
            
            if (userProfile.exists()) {
              // Calculate compatibility score
              const compatibilityScore = calculateCompatibility(trip, matchTrip);
              
              potentialMatches.push({
                tripId: matchTrip.id,
                userId: matchTrip.userId,
                user: userProfile.data(),
                trip: matchTrip,
                compatibility: compatibilityScore,
                datesOverlap: {
                  start: Math.max(tripStartDate.getTime(), matchStartDate.getTime()),
                  end: Math.min(tripEndDate.getTime(), matchEndDate.getTime())
                }
              });
            }
          }
        }
        
        // Sort by compatibility score
        potentialMatches.sort((a, b) => b.compatibility - a.compatibility);
        
        commit('SET_POTENTIAL_MATCHES', potentialMatches);
        return potentialMatches;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Request a match with another user for a specific trip
    async requestMatch({ commit }, { requesterTripId, recipientTripId, message }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        // Get trip data for both trips
        const [requesterTripDoc, recipientTripDoc] = await Promise.all([
          getDoc(doc(db, 'trips', requesterTripId)),
          getDoc(doc(db, 'trips', recipientTripId))
        ]);
        
        if (!requesterTripDoc.exists() || !recipientTripDoc.exists()) {
          throw new Error('One or both trips not found');
        }
        
        const requesterTrip = requesterTripDoc.data();
        const recipientTrip = recipientTripDoc.data();
        
        // Create the match document
        const matchData = {
          requesterId: requesterTrip.userId,
          requesterTripId,
          recipientId: recipientTrip.userId,
          recipientTripId,
          status: 'pending',
          message: message || '',
          createdAt: new Date(),
          destination: requesterTrip.destination,
          startDate: requesterTrip.startDate,
          endDate: requesterTrip.endDate
        };
        
        const matchRef = await addDoc(collection(db, 'matches'), matchData);
        
        // Create a notification for the recipient
        await addDoc(collection(db, 'notifications'), {
          userId: recipientTrip.userId,
          type: 'match_request',
          matchId: matchRef.id,
          message: `You have a new match request for your trip to ${recipientTrip.destination}`,
          isRead: false,
          createdAt: new Date()
        });
        
        // Return the match with ID
        const newMatch = {
          id: matchRef.id,
          ...matchData,
          isRequester: true
        };
        
        commit('ADD_MATCH', newMatch);
        return newMatch;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Accept a match request
    async acceptMatch({ commit }, matchId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const matchRef = doc(db, 'matches', matchId);
        const matchDoc = await getDoc(matchRef);
        
        if (!matchDoc.exists()) {
          throw new Error('Match not found');
        }
        
        const match = matchDoc.data();
        
        // Update match status
        await updateDoc(matchRef, {
          status: 'confirmed',
          updatedAt: new Date()
        });
        
        // Create a notification for the requester
        await addDoc(collection(db, 'notifications'), {
          userId: match.requesterId,
          type: 'match_accepted',
          matchId,
          message: `Your match request for ${match.destination} has been accepted!`,
          isRead: false,
          createdAt: new Date()
        });
        
        // Update local state
        commit('UPDATE_MATCH', {
          matchId,
          data: { status: 'confirmed', updatedAt: new Date() }
        });
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Decline a match request
    async declineMatch({ commit }, matchId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const matchRef = doc(db, 'matches', matchId);
        const matchDoc = await getDoc(matchRef);
        
        if (!matchDoc.exists()) {
          throw new Error('Match not found');
        }
        
        const match = matchDoc.data();
        
        // Update match status
        await updateDoc(matchRef, {
          status: 'declined',
          updatedAt: new Date()
        });
        
        // Create a notification for the requester
        await addDoc(collection(db, 'notifications'), {
          userId: match.requesterId,
          type: 'match_declined',
          matchId,
          message: `Your match request for ${match.destination} has been declined.`,
          isRead: false,
          createdAt: new Date()
        });
        
        // Update local state
        commit('UPDATE_MATCH', {
          matchId,
          data: { status: 'declined', updatedAt: new Date() }
        });
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Delete a match connection
    async deleteMatch({ commit }, matchId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        await deleteDoc(doc(db, 'matches', matchId));
        commit('REMOVE_MATCH', matchId);
        return true;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  };
  
  const mutations = {
    SET_MATCHES(state, matches) {
      state.matches = matches;
    },
    SET_POTENTIAL_MATCHES(state, potentialMatches) {
      state.potentialMatches = potentialMatches;
    },
    ADD_MATCH(state, match) {
      state.matches.unshift(match);
    },
    UPDATE_MATCH(state, { matchId, data }) {
      const index = state.matches.findIndex(match => match.id === matchId);
      if (index !== -1) {
        state.matches[index] = { ...state.matches[index], ...data };
      }
    },
    REMOVE_MATCH(state, matchId) {
      state.matches = state.matches.filter(match => match.id !== matchId);
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  };
  
  // Helper function to calculate compatibility score between two trips
  function calculateCompatibility(trip1, trip2) {
    let score = 0;
    const maxScore = 100;
    
    // Check activities overlap
    if (trip1.activities && trip2.activities) {
      const trip1Activities = new Set(trip1.activities);
      const overlappingActivities = trip2.activities.filter(activity => trip1Activities.has(activity));
      
      // Add points based on percentage of overlapping activities
      const activityOverlapPercentage = overlappingActivities.length / 
        Math.max(trip1.activities.length, trip2.activities.length);
      
      score += activityOverlapPercentage * 40; // Activities are worth up to 40 points
    }
    
    // Check budget compatibility
    if (trip1.budget === trip2.budget) {
      score += 30; // Exact budget match is worth 30 points
    } else if (
      (trip1.budget === 'budget' && trip2.budget === 'mid_range') ||
      (trip1.budget === 'mid_range' && trip2.budget === 'budget') ||
      (trip1.budget === 'mid_range' && trip2.budget === 'luxury') ||
      (trip1.budget === 'luxury' && trip2.budget === 'mid_range')
    ) {
      score += 15; // Adjacent budget categories get 15 points
    }
    
    // Check accommodation compatibility
    if (trip1.accommodation && trip2.accommodation && trip1.accommodation === trip2.accommodation) {
      score += 20; // Same accommodation preference is worth 20 points
    }
    
    // Check "looking for" overlap
    if (trip1.lookingFor && trip2.lookingFor) {
      const trip1LookingFor = new Set(trip1.lookingFor);
      const overlappingLookingFor = trip2.lookingFor.filter(item => trip1LookingFor.has(item));
      
      // Add points based on percentage of overlapping "looking for" items
      const lookingForOverlapPercentage = overlappingLookingFor.length / 
        Math.max(trip1.lookingFor.length, trip2.lookingFor.length);
      
      score += lookingForOverlapPercentage * 10; // Looking for overlap is worth up to 10 points
    }
    
    // Return a score from 0-100
    return Math.min(Math.round(score), maxScore);
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };