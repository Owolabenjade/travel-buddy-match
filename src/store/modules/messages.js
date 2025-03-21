import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy,
    limit, 
    getDocs, 
    getDoc, 
    doc, 
    updateDoc,
    onSnapshot
  } from 'firebase/firestore';
  import { db } from '@/firebase';
  
  const state = {
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null,
    unsubscribe: null
  };
  
  const getters = {
    conversations: state => state.conversations,
    currentConversation: state => state.currentConversation,
    messages: state => state.messages,
    loading: state => state.loading,
    error: state => state.error,
    
    unreadConversationsCount: state => {
      return state.conversations.filter(convo => convo.unreadCount > 0).length;
    }
  };
  
  const actions = {
    // Fetch all conversations for a user
    async fetchUserConversations({ commit }, userId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        // Get all matches where the user is a participant and match is confirmed
        const matchesQuery = query(
          collection(db, 'matches'),
          where('status', '==', 'confirmed'),
          where('participants', 'array-contains', userId)
        );
        
        const matchesSnapshot = await getDocs(matchesQuery);
        const conversations = [];
        
        // For each match, get the last message
        for (const matchDoc of matchesSnapshot.docs) {
          const match = { id: matchDoc.id, ...matchDoc.data() };
          
          // Get the other user's info
          const otherUserId = match.participants.find(id => id !== userId);
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Get the last message in the conversation
            const messagesQuery = query(
              collection(db, 'messages'),
              where('matchId', '==', match.id),
              orderBy('createdAt', 'desc'),
              limit(1)
            );
            
            const messagesSnapshot = await getDocs(messagesQuery);
            let lastMessage = null;
            let unreadCount = 0;
            
            if (!messagesSnapshot.empty) {
              lastMessage = {
                id: messagesSnapshot.docs[0].id,
                ...messagesSnapshot.docs[0].data()
              };
              
              // Count unread messages
              const unreadQuery = query(
                collection(db, 'messages'),
                where('matchId', '==', match.id),
                where('senderId', '!=', userId),
                where('read', '==', false)
              );
              
              const unreadSnapshot = await getDocs(unreadQuery);
              unreadCount = unreadSnapshot.size;
            }
            
            conversations.push({
              id: match.id,
              destination: match.destination,
              startDate: match.startDate,
              endDate: match.endDate,
              userId: otherUserId,
              userDisplayName: userData.displayName,
              userPhotoURL: userData.photoURL,
              lastMessage,
              unreadCount
            });
          }
        }
        
        // Sort conversations by last message timestamp (most recent first)
        conversations.sort((a, b) => {
          const timeA = a.lastMessage ? a.lastMessage.createdAt.toDate() : new Date(0);
          const timeB = b.lastMessage ? b.lastMessage.createdAt.toDate() : new Date(0);
          return timeB - timeA;
        });
        
        commit('SET_CONVERSATIONS', conversations);
        return conversations;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Load a specific conversation and its messages
    async loadConversation({ commit, state }, { matchId, userId }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        // Get match details
        const matchDoc = await getDoc(doc(db, 'matches', matchId));
        
        if (!matchDoc.exists()) {
          throw new Error('Conversation not found');
        }
        
        const match = { id: matchDoc.id, ...matchDoc.data() };
        
        // Get the other user's info
        const otherUserId = match.participants.find(id => id !== userId);
        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        
        if (!userDoc.exists()) {
          throw new Error('User not found');
        }
        
        const userData = userDoc.data();
        
        // Create the conversation object
        const conversation = {
          id: match.id,
          destination: match.destination,
          startDate: match.startDate,
          endDate: match.endDate,
          userId: otherUserId,
          userDisplayName: userData.displayName,
          userPhotoURL: userData.photoURL
        };
        
        commit('SET_CURRENT_CONVERSATION', conversation);
        
        // Set up real-time listener for messages
        if (state.unsubscribe) {
          state.unsubscribe();
        }
        
        const messagesQuery = query(
          collection(db, 'messages'),
          where('matchId', '==', matchId),
          orderBy('createdAt', 'asc')
        );
        
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const messages = [];
          
          snapshot.forEach(doc => {
            messages.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          commit('SET_MESSAGES', messages);
          
          // Mark received messages as read
          messages.forEach(async message => {
            if (message.senderId !== userId && !message.read) {
              await updateDoc(doc(db, 'messages', message.id), { read: true });
            }
          });
        });
        
        commit('SET_UNSUBSCRIBE', unsubscribe);
        return conversation;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    // Send a new message
    async sendMessage({ commit }, { matchId, senderId, text }) {
      try {
        // Add the message to Firestore
        const messageData = {
          matchId,
          senderId,
          text,
          read: false,
          createdAt: new Date()
        };
        
        const messageRef = await addDoc(collection(db, 'messages'), messageData);
        
        // Return the message with ID
        return {
          id: messageRef.id,
          ...messageData
        };
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },
    
    // Clear current conversation and listener when leaving the chat
    clearCurrentConversation({ commit, state }) {
      if (state.unsubscribe) {
        state.unsubscribe();
      }
      
      commit('SET_CURRENT_CONVERSATION', null);
      commit('SET_MESSAGES', []);
      commit('SET_UNSUBSCRIBE', null);
    }
  };
  
  const mutations = {
    SET_CONVERSATIONS(state, conversations) {
      state.conversations = conversations;
    },
    UPDATE_CONVERSATION(state, { id, data }) {
      const index = state.conversations.findIndex(convo => convo.id === id);
      if (index !== -1) {
        state.conversations[index] = { ...state.conversations[index], ...data };
      }
    },
    SET_CURRENT_CONVERSATION(state, conversation) {
      state.currentConversation = conversation;
    },
    SET_MESSAGES(state, messages) {
      state.messages = messages;
    },
    ADD_MESSAGE(state, message) {
      state.messages.push(message);
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