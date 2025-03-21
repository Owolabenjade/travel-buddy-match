import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/firebase';

const state = {
  profile: null,
  loading: false,
  error: null
};

const getters = {
  profile: state => state.profile,
  loading: state => state.loading,
  error: state => state.error
};

const actions = {
  async fetchProfile({ commit }, userId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        commit('SET_PROFILE', { uid: docSnap.id, ...docSnap.data() });
      } else {
        commit('SET_ERROR', 'Profile not found');
      }
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  async updateProfile({ commit }, { userId, profileData }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, profileData);
      
      // Update the local state with the new data
      commit('UPDATE_PROFILE', profileData);
      return true;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  async uploadProfileImage({ commit }, { userId, file }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      // Create a reference to the storage location
      const storageRef = ref(storage, `profile-images/${userId}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update the user profile with the new image URL
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { photoURL: downloadURL });
      
      // Update local state
      commit('UPDATE_PROFILE', { photoURL: downloadURL });
      
      return downloadURL;
    } catch (error) {
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  async deleteProfileImage({ commit }, userId) { // Removed unused state parameter
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      // Create a reference to the storage location
      const storageRef = ref(storage, `profile-images/${userId}`);
      
      // Delete the file
      await deleteObject(storageRef);
      
      // Update the user profile
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { photoURL: null });
      
      // Update local state
      commit('UPDATE_PROFILE', { photoURL: null });
      
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
  SET_PROFILE(state, profile) {
    state.profile = profile;
  },
  UPDATE_PROFILE(state, profileData) {
    if (state.profile) {
      state.profile = { ...state.profile, ...profileData };
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