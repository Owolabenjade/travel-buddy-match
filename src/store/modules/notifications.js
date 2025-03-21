import { 
    collection, 
    query, 
    where, 
    orderBy, 
    doc, 
    updateDoc,
    deleteDoc,
    onSnapshot
  } from 'firebase/firestore';
  import { db } from '@/firebase';
  
  const state = {
    notifications: [],
    loading: false,
    error: null,
    unsubscribe: null
  };
  
  const getters = {
    notifications: state => state.notifications,
    unreadCount: state => state.notifications.filter(n => !n.isRead).length,
    loading: state => state.loading,
    error: state => state.error
  };
  
  const actions = {
    // Setup real-time listener for user notifications
    setupNotificationsListener({ commit, state }, userId) {
      if (state.unsubscribe) {
        state.unsubscribe();
      }
      
      commit('SET_LOADING', true);
      
      try {
        const notificationsQuery = query(
          collection(db, 'notifications'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
          const notifications = [];
          
          snapshot.forEach(doc => {
            notifications.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          commit('SET_NOTIFICATIONS', notifications);
          commit('SET_LOADING', false);
        });
        
        commit('SET_UNSUBSCRIBE', unsubscribe);
      } catch (error) {
        commit('SET_ERROR', error.message);
        commit('SET_LOADING', false);
      }
    },
    
    // Mark a notification as read
    async markAsRead({ commit }, notificationId) {
      try {
        await updateDoc(doc(db, 'notifications', notificationId), {
          isRead: true
        });
        
        commit('UPDATE_NOTIFICATION', {
          id: notificationId,
          data: { isRead: true }
        });
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    // Mark all notifications as read
    async markAllAsRead({ commit, state }) {
      try {
        const updates = state.notifications
          .filter(n => !n.isRead)
          .map(n => updateDoc(doc(db, 'notifications', n.id), { isRead: true }));
        
        await Promise.all(updates);
        
        commit('MARK_ALL_READ');
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    // Delete a notification
    async deleteNotification({ commit }, notificationId) {
      try {
        await deleteDoc(doc(db, 'notifications', notificationId));
        commit('REMOVE_NOTIFICATION', notificationId);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    // Clear listener when logging out
    clearNotifications({ commit, state }) {
      if (state.unsubscribe) {
        state.unsubscribe();
      }
      
      commit('SET_NOTIFICATIONS', []);
      commit('SET_UNSUBSCRIBE', null);
    }
  };
  
  const mutations = {
    SET_NOTIFICATIONS(state, notifications) {
      state.notifications = notifications;
    },
    UPDATE_NOTIFICATION(state, { id, data }) {
      const index = state.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        state.notifications[index] = { ...state.notifications[index], ...data };
      }
    },
    MARK_ALL_READ(state) {
      state.notifications = state.notifications.map(n => ({
        ...n,
        isRead: true
      }));
    },
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id);
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_UNSUBSCRIBE(state, unsubscribe) {
      state.unsubscribe = unsubscribe;
    }
  };
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };