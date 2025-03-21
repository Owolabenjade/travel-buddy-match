import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    updateProfile 
  } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import { auth, db } from '@/firebase';
  
  const state = {
    user: null,
    loading: false,
    error: null
  };
  
  const getters = {
    isAuthenticated: state => !!state.user,
    user: state => state.user,
    loading: state => state.loading,
    error: state => state.error
  };
  
  const actions = {
    async register({ commit }, { email, password, displayName }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with display name
        await updateProfile(userCredential.user, {
          displayName
        });
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          displayName,
          email,
          createdAt: new Date(),
          photoURL: null,
          bio: '',
          preferences: {},
          languages: []
        });
        
        commit('SET_USER', userCredential.user);
        return userCredential.user;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async login({ commit }, { email, password }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        commit('SET_USER', userCredential.user);
        return userCredential.user;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async logout({ commit }) {
      try {
        await signOut(auth);
        commit('SET_USER', null);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    }
  };
  
  const mutations = {
    SET_USER(state, user) {
      state.user = user;
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