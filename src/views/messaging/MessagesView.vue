<template>
    <DefaultLayout>
      <div class="messages-view">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1>Messages</h1>
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
          <div v-if="conversations.length === 0" class="card text-center py-5">
            <i class="bi bi-chat" style="font-size: 3rem; color: #6c757d;"></i>
            <h5 class="mt-3">No Messages Yet</h5>
            <p class="mb-0">Connect with travel buddies to start chatting!</p>
            <router-link to="/matches" class="btn btn-primary mt-3">
              Find Travel Buddies
            </router-link>
          </div>
          
          <div v-else class="conversations-list">
            <div class="list-group">
              <router-link
                v-for="conversation in conversations"
                :key="conversation.id"
                :to="`/messages/${conversation.id}`"
                class="list-group-item list-group-item-action"
                :class="{ 'unread': conversation.unreadCount > 0 }"
              >
                <div class="d-flex">
                  <div class="user-avatar me-3">
                    <img
                      :src="conversation.userPhotoURL || '/img/default-avatar.png'"
                      :alt="conversation.userDisplayName"
                      class="rounded-circle"
                    />
                    <span v-if="conversation.unreadCount > 0" class="unread-badge">
                      {{ conversation.unreadCount }}
                    </span>
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between">
                      <h5 class="mb-1">{{ conversation.userDisplayName }}</h5>
                      <small v-if="conversation.lastMessage" class="text-muted">
                        {{ formatMessageTime(conversation.lastMessage.createdAt) }}
                      </small>
                    </div>
                    <p class="mb-1 text-truncate" v-if="conversation.lastMessage">
                      {{ conversation.lastMessage.text }}
                    </p>
                    <p class="mb-1 text-muted" v-else>
                      <em>No messages yet</em>
                    </p>
                    <small class="text-muted">
                      <i class="bi bi-geo-alt me-1"></i>
                      {{ conversation.destination }}
                    </small>
                  </div>
                </div>
              </router-link>
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
    name: 'MessagesView',
    components: {
      DefaultLayout
    },
    setup() {
      const store = useStore();
      
      // Computed properties
      const user = computed(() => store.getters['auth/user']);
      const loading = computed(() => store.getters['messages/loading']);
      const error = computed(() => store.getters['messages/error']);
      const conversations = computed(() => store.getters['messages/conversations']);
      
      // Fetch conversations on mount
      onMounted(async () => {
        if (user.value) {
          await store.dispatch('messages/fetchUserConversations', user.value.uid);
        }
      });
      
      // Helper methods
      const formatMessageTime = (timestamp) => {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          // Today - show time
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
          // Yesterday
          return 'Yesterday';
        } else if (diffDays < 7) {
          // Within a week - show day name
          const options = { weekday: 'short' };
          return date.toLocaleDateString(undefined, options);
        } else {
          // Older - show date
          const options = { month: 'short', day: 'numeric' };
          return date.toLocaleDateString(undefined, options);
        }
      };
      
      return {
        loading,
        error,
        conversations,
        formatMessageTime
      };
    }
  };
  </script>
  
  <style scoped>
  .messages-view {
    .user-avatar {
      position: relative;
      
      img {
        width: 50px;
        height: 50px;
        object-fit: cover;
      }
      
      .unread-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #dc3545;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    
    .list-group-item {
      transition: background-color 0.2s;
      
      &.unread {
        background-color: rgba(70, 130, 180, 0.1);
        font-weight: 500;
      }
      
      &:hover {
        background-color: rgba(70, 130, 180, 0.15);
      }
    }
  }
  </style>