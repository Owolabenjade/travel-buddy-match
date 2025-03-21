<template>
    <div class="dropdown">
      <button
        class="btn btn-link position-relative text-decoration-none"
        type="button"
        data-bs-toggle="dropdown"
        @click="checkNotifications"
      >
        <i class="bi bi-bell fs-5"></i>
        <span
          v-if="unreadCount > 0"
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
          <span class="visually-hidden">unread notifications</span>
        </span>
      </button>
      
      <div class="dropdown-menu dropdown-menu-end notification-dropdown">
        <div class="dropdown-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">Notifications</h6>
          <button
            v-if="notifications.length > 0 && unreadCount > 0"
            class="btn btn-sm btn-link text-decoration-none"
            @click="markAllAsRead"
          >
            Mark all as read
          </button>
        </div>
        
        <div v-if="loading" class="text-center py-3">
          <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div v-else-if="notifications.length === 0" class="text-center py-3">
          <i class="bi bi-bell-slash text-muted"></i>
          <p class="mb-0 text-muted small">No notifications</p>
        </div>
        
        <div v-else class="notification-list">
          
            v-for="notification in notifications"
            :key="notification.id"
            href="#"
            class="dropdown-item notification-item"
            :class="{ 'unread': !notification.isRead }"
            @click.prevent="handleNotificationClick(notification)"
          >
            <div class="d-flex">
              <div class="notification-icon me-3">
                <i :class="getNotificationIcon(notification.type)"></i>
              </div>
              <div class="flex-grow-1">
                <p class="mb-1">{{ notification.message }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">{{ formatTimeAgo(notification.createdAt) }}</small>
                  <button
                    class="btn btn-sm btn-link p-0"
                    @click.stop="deleteNotification(notification.id)"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'NotificationDropdown',
    setup() {
      const store = useStore();
      const router = useRouter();
      
      // Computed properties
      const notifications = computed(() => store.getters['notifications/notifications']);
      const unreadCount = computed(() => store.getters['notifications/unreadCount']);
      const loading = computed(() => store.getters['notifications/loading']);
      
      // Methods
      const checkNotifications = () => {
        // This function is called when the dropdown is opened
        // It's a placeholder for future functionality
      };
      
      const markAllAsRead = async () => {
        try {
          await store.dispatch('notifications/markAllAsRead');
        } catch (error) {
          console.error('Error marking all notifications as read:', error);
        }
      };
      
      const handleNotificationClick = async (notification) => {
        // Mark as read
        if (!notification.isRead) {
          await store.dispatch('notifications/markAsRead', notification.id);
        }
        
        // Handle different notification types
        switch (notification.type) {
          case 'match_request':
            router.push('/matches?tab=pending');
            break;
          case 'match_accepted':
            router.push(`/messages/${notification.matchId}`);
            break;
          case 'match_declined':
            router.push('/matches?tab=find');
            break;
          case 'new_message':
            router.push(`/messages/${notification.matchId}`);
            break;
          default:
            // Generic action for other notification types
            break;
        }
      };
      
      const deleteNotification = async (id) => {
        try {
          await store.dispatch('notifications/deleteNotification', id);
        } catch (error) {
          console.error('Error deleting notification:', error);
        }
      };
      
      const getNotificationIcon = (type) => {
        const iconMap = {
          'match_request': 'bi bi-person-plus text-primary',
          'match_accepted': 'bi bi-check-circle text-success',
          'match_declined': 'bi bi-x-circle text-danger',
          'new_message': 'bi bi-chat-dots text-info'
        };
        
        return iconMap[type] || 'bi bi-bell';
      };
      
      const formatTimeAgo = (timestamp) => {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffDay > 0) {
          return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
        } else if (diffHour > 0) {
          return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
        } else if (diffMin > 0) {
          return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
        } else {
          return 'just now';
        }
      };
      
      return {
        notifications,
        unreadCount,
        loading,
        checkNotifications,
        markAllAsRead,
        handleNotificationClick,
        deleteNotification,
        getNotificationIcon,
        formatTimeAgo
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .notification-dropdown {
    width: 320px;
    padding: 0;
    
    .dropdown-header {
      padding: 0.5rem 1rem;
      border-bottom: 1px solid #e9ecef;
    }
    
    .notification-list {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .notification-item {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f8f9fa;
      
      &:hover {
        background-color: rgba(70, 130, 180, 0.05);
      }
      
      &.unread {
        background-color: rgba(70, 130, 180, 0.1);
        
        p {
          font-weight: 500;
        }
      }
      
      .notification-icon {
        width: 40px;
        height: 40px;
        background-color: #f8f9fa;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        i {
          font-size: 1.25rem;
        }
      }
    }
  }
  </style>