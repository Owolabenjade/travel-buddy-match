<template>
    <DefaultLayout>
      <div class="message-thread-view">
        <div v-if="loading && !conversation" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <div v-else-if="conversation" class="chat-container">
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
              <div class="d-flex align-items-center">
                <router-link to="/messages" class="btn btn-sm btn-outline-secondary me-3">
                  <i class="bi bi-arrow-left"></i>
                </router-link>
                
                <div class="user-avatar me-3">
                  <img
                    :src="conversation.userPhotoURL || '/img/default-avatar.png'"
                    :alt="conversation.userDisplayName"
                    class="rounded-circle"
                  />
                </div>
                
                <div>
                  <h5 class="mb-0">{{ conversation.userDisplayName }}</h5>
                  <p class="mb-0 text-muted small">
                    <i class="bi bi-geo-alt me-1"></i>
                    {{ conversation.destination }}
                  </p>
                </div>
              </div>
              
              <div>
                <button class="btn btn-sm btn-outline-secondary" @click="showTripDetails = !showTripDetails">
                  <i class="bi bi-info-circle"></i> Trip Details
                </button>
              </div>
            </div>
            
            <!-- Trip Details Collapse -->
            <div v-if="showTripDetails" class="trip-details p-3 border-bottom bg-light">
              <div class="row">
                <div class="col-md-6">
                  <h6><i class="bi bi-calendar-date me-2"></i> Trip Dates</h6>
                  <p>{{ formatDateRange(conversation.startDate, conversation.endDate) }}</p>
                </div>
                <div class="col-md-6">
                  <h6><i class="bi bi-geo me-2"></i> Destination</h6>
                  <p>{{ conversation.destination }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Chat Messages -->
          <div class="chat-messages p-3" ref="messagesContainer">
            <div v-if="messages.length === 0" class="text-center py-5">
              <i class="bi bi-chat-dots" style="font-size: 3rem; color: #dee2e6;"></i>
              <p class="mt-3 text-muted">No messages yet. Start the conversation!</p>
            </div>
            
            <template v-else>
              <div
                v-for="(message, index) in messages"
                :key="message.id"
                class="message-bubble"
                :class="{
                  'outgoing': message.senderId === user.uid,
                  'incoming': message.senderId !== user.uid,
                  'with-date': shouldShowDate(message, index)
                }"
              >
                <div
                  v-if="shouldShowDate(message, index)"
                  class="message-date text-center my-3"
                >
                  <span>{{ formatMessageDate(message.createdAt) }}</span>
                </div>
                
                <div class="message-content">
                  {{ message.text }}
                  <div class="message-time small">
                    {{ formatMessageTime(message.createdAt) }}
                    <i
                      v-if="message.senderId === user.uid"
                      :class="[
                        'ms-1',
                        message.read ? 'bi bi-check-all text-primary' : 'bi bi-check'
                      ]"
                    ></i>
                  </div>
                </div>
              </div>
            </template>
          </div>
          
          <!-- Chat Input -->
          <div class="chat-input p-3 border-top">
            <form @submit.prevent="sendMessage">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Type a message..."
                  v-model="newMessage"
                  :disabled="sendingMessage"
                />
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="!newMessage.trim() || sendingMessage"
                >
                  <i
                    :class="[
                      sendingMessage ? 'spinner-border spinner-border-sm' : 'bi bi-send'
                    ]"
                  ></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  </template>
  
  <script>
  import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  
  export default {
    name: 'MessageThreadView',
    components: {
      DefaultLayout
    },
    setup() {
      const store = useStore();
      const route = useRoute();
      
      const matchId = route.params.matchId;
      const messagesContainer = ref(null);
      const newMessage = ref('');
      const sendingMessage = ref(false);
      const showTripDetails = ref(false);
      
      // Computed properties
      const user = computed(() => store.getters['auth/user']);
      const loading = computed(() => store.getters['messages/loading']);
      const error = computed(() => store.getters['messages/error']);
      const conversation = computed(() => store.getters['messages/currentConversation']);
      const messages = computed(() => store.getters['messages/messages']);
      
      // Load conversation and messages
      onMounted(async () => {
        if (user.value) {
          await store.dispatch('messages/loadConversation', {
            matchId,
            userId: user.value.uid
          });
          
          // Scroll to bottom of messages
          scrollToBottom();
        }
      });
      
      // Clear conversation and unsubscribe when component is destroyed
      onUnmounted(() => {
        store.dispatch('messages/clearCurrentConversation');
      });
      
      // Watch for new messages to scroll to bottom
      watch(messages, () => {
        scrollToBottom();
      });
      
      // Helper methods
      const formatDateRange = (startDate, endDate) => {
        const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
        const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
      };
      
      const formatMessageTime = (timestamp) => {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
      
      const formatMessageDate = (timestamp) => {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const isToday = date.toDateString() === today.toDateString();
        const isYesterday = date.toDateString() === yesterday.toDateString();
        
        if (isToday) {
          return 'Today';
        } else if (isYesterday) {
          return 'Yesterday';
        } else {
          return date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      };
      
      const shouldShowDate = (message, index) => {
        if (index === 0) return true;
        
        const currentDate = message.createdAt.toDate ? message.createdAt.toDate() : new Date(message.createdAt);
        const prevDate = messages.value[index - 1].createdAt.toDate
          ? messages.value[index - 1].createdAt.toDate()
          : new Date(messages.value[index - 1].createdAt);
        
        return currentDate.toDateString() !== prevDate.toDateString();
      };
      
      const scrollToBottom = () => {
        nextTick(() => {
          if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
          }
        });
      };
      
      const sendMessage = async () => {
        if (!newMessage.value.trim() || !user.value || !conversation.value) return;
        
        sendingMessage.value = true;
        
        try {
          await store.dispatch('messages/sendMessage', {
            matchId,
            senderId: user.value.uid,
            text: newMessage.value.trim()
          });
          
          newMessage.value = '';
        } catch (error) {
          console.error('Error sending message:', error);
        } finally {
          sendingMessage.value = false;
        }
      };
      
      return {
        matchId,
        messagesContainer,
        newMessage,
        sendingMessage,
        showTripDetails,
        user,
        loading,
        error,
        conversation,
        messages,
        formatDateRange,
        formatMessageTime,
        formatMessageDate,
        shouldShowDate,
        sendMessage
      };
    }
  };
  </script>
  
  <style scoped>
  .message-thread-view {
    height: calc(100vh - 160px);
    display: flex;
    flex-direction: column;
    
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      overflow: hidden;
      
      .chat-header {
        background-color: #fff;
        
        .user-avatar {
          img {
            width: 40px;
            height: 40px;
            object-fit: cover;
          }
        }
      }
      
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        background-color: #f8f9fa;
        
        .message-date {
          span {
            background-color: rgba(0, 0, 0, 0.1);
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 0.8rem;
            color: #6c757d;
          }
        }
        
        .message-bubble {
          max-width: 75%;
          margin-bottom: 10px;
          
          &.outgoing {
            margin-left: auto;
            
            .message-content {
              background-color: #4682B4;
              color: #fff;
              border-radius: 18px 18px 4px 18px;
              
              .message-time {
                color: rgba(255, 255, 255, 0.8);
              }
            }
          }
          
          &.incoming {
            margin-right: auto;
            
            .message-content {
              background-color: #fff;
              border-radius: 18px 18px 18px 4px;
              
              .message-time {
                color: #adb5bd;
              }
            }
          }
          
          .message-content {
            padding: 10px 15px;
            position: relative;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            
            .message-time {
              font-size: 0.7rem;
              text-align: right;
              margin-top: 4px;
            }
          }
        }
      }
      
      .chat-input {
        background-color: #fff;
        
        .input-group {
          .form-control {
            border-right: none;
            
            &:focus {
              box-shadow: none;
            }
          }
          
          .btn {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
    }
  }
  </style>