<template>
    <div class="card confirmed-match-card h-100">
      <div class="card-header bg-success text-white">
        <h5 class="mb-0">
          <i class="bi bi-people-fill me-2"></i>
          Travel Buddy Confirmed
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
        
        <div class="match-details mb-3">
          <div class="alert alert-success">
            <i class="bi bi-check-circle me-2"></i>
            You've successfully matched with another traveler for this trip!
          </div>
        </div>
        
        <div class="match-actions d-flex justify-content-center mb-3">
          <button 
            class="btn btn-primary me-2" 
            @click="$emit('view-messages', match.id)"
          >
            <i class="bi bi-chat-dots me-1"></i> Messages
          </button>
          <button 
            class="btn btn-outline-danger" 
            @click="$emit('delete-match', match.id)"
          >
            <i class="bi bi-x-circle me-1"></i> Disconnect
          </button>
        </div>
        
        <div class="match-info">
          <div class="match-date text-muted small">
            Matched on {{ formatMatchDate(match.updatedAt || match.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ConfirmedMatchCard',
    props: {
      match: {
        type: Object,
        required: true
      }
    },
    emits: ['view-messages', 'delete-match'],
    setup() {
      const formatDateRange = (startDate, endDate) => {
        const start = startDate.toDate ? startDate.toDate() : new Date(startDate);
        const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
      };
      
      const formatMatchDate = (timestamp) => {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      };
      
      return {
        formatDateRange,
        formatMatchDate
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .confirmed-match-card {
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
    
    .match-info {
      text-align: right;
    }
  }
  </style>