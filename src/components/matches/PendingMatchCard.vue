<template>
    <div class="card pending-match-card h-100">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="bi bi-hourglass-split me-2"></i>
          <span v-if="match.isRequester">Match Request Sent</span>
          <span v-else>Match Request Received</span>
        </h5>
      </div>
      
      <div class="card-body">
        <div class="d-flex mb-3">
          <div class="destination-icon me-3">
            <i class="bi bi-geo-alt"></i>
          </div>
          <div>
            <h5 class="mb-1">{{ match.destination }}</h5>
            <div class="dates text-muted">
              {{ formatDateRange(match.startDate, match.endDate) }}
            </div>
          </div>
        </div>
        
        <div v-if="match.isRequester" class="waiting-message mb-3">
          <div class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            Waiting for response from the other traveler.
          </div>
        </div>
        
        <div v-else class="match-actions mb-3">
          <div class="d-flex justify-content-center">
            <button 
              class="btn btn-success me-2" 
              @click="$emit('accept-match', match.id)"
            >
              <i class="bi bi-check-circle me-1"></i> Accept
            </button>
            <button 
              class="btn btn-outline-danger" 
              @click="$emit('decline-match', match.id)"
            >
              <i class="bi bi-x-circle me-1"></i> Decline
            </button>
          </div>
        </div>
        
        <div v-if="match.message" class="message-box">
          <div class="message-header">
            <i class="bi bi-chat-left-text me-2"></i>
            Message:
          </div>
          <p class="message-content">
            "{{ match.message }}"
          </p>
        </div>
        
        <div class="match-info">
          <div class="match-date text-muted small">
            Requested {{ formatTimeAgo(match.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PendingMatchCard',
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    emits: ['accept-match', 'decline-match'],
    setup() {
      const formatDateRange = (startDate, endDate) => {
        const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
        const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
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
        formatDateRange,
        formatTimeAgo
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .pending-match-card {
    .destination-icon {
      width: 40px;
      height: 40px;
      background-color: #f8f9fa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      i {
        font-size: 1.25rem;
        color: #4682B4;
      }
    }
    
    .message-box {
      background-color: #f8f9fa;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
      
      .message-header {
        font-weight: 500;
        margin-bottom: 0.5rem;
      }
      
      .message-content {
        font-style: italic;
        margin-bottom: 0;
      }
    }
    
    .match-info {
      text-align: right;
    }
  }
  </style>