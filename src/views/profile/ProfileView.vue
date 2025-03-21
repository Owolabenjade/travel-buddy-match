<template>
    <DefaultLayout>
      <div class="profile-view">
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card">
              <div class="card-body text-center">
                <div class="profile-image-container mb-3">
                  <div v-if="profile && profile.photoURL" class="profile-image">
                    <img :src="profile.photoURL" alt="Profile" class="img-fluid rounded-circle">
                    <button
                      class="btn btn-sm btn-danger profile-image-remove"
                      @click="handleDeleteImage"
                      title="Remove image"
                    >
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                  <div v-else class="profile-image-placeholder">
                    <i class="bi bi-person-circle"></i>
                    <div class="upload-overlay">
                      <i class="bi bi-camera"></i>
                    </div>
                  </div>
                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileChange"
                    accept="image/*"
                    class="d-none"
                  />
                  <button
                    class="btn btn-sm btn-primary mt-2"
                    @click="triggerFileInput"
                  >
                    {{ profile && profile.photoURL ? 'Change Photo' : 'Upload Photo' }}
                  </button>
                </div>
                
                <h3 class="mb-0">{{ profile ? profile.displayName : 'Loading...' }}</h3>
                <p class="text-muted">{{ profile ? profile.email : '' }}</p>
                
                <div class="profile-stats mt-3">
                  <div class="row">
                    <div class="col-4 border-end">
                      <div class="h5 mb-0">{{ tripsCount }}</div>
                      <div class="small text-muted">Trips</div>
                    </div>
                    <div class="col-4 border-end">
                      <div class="h5 mb-0">{{ matchesCount }}</div>
                      <div class="small text-muted">Matches</div>
                    </div>
                    <div class="col-4">
                      <div class="h5 mb-0">{{ profile?.languages?.length || 0 }}</div>
                      <div class="small text-muted">Languages</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-8">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <h4 class="mb-0">Profile Information</h4>
                <button
                  class="btn btn-primary"
                  @click="isEditing = !isEditing"
                >
                  {{ isEditing ? 'Cancel' : 'Edit Profile' }}
                </button>
              </div>
              <div class="card-body">
                <div v-if="loading" class="text-center py-4">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
                
                <div v-else-if="error" class="alert alert-danger">
                  {{ error }}
                </div>
                
                <div v-else>
                  <form v-if="isEditing" @submit.prevent="updateProfile">
                    <div class="mb-3">
                      <label for="displayName" class="form-label">Full Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="displayName"
                        v-model="formData.displayName"
                        required
                      />
                    </div>
                    
                    <div class="mb-3">
                      <label for="bio" class="form-label">About Me</label>
                      <textarea
                        class="form-control"
                        id="bio"
                        rows="4"
                        v-model="formData.bio"
                        placeholder="Tell other travelers about yourself..."
                      ></textarea>
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label">Age</label>
                      <input
                        type="number"
                        class="form-control"
                        v-model.number="formData.age"
                        min="18"
                        max="120"
                      />
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label">Gender</label>
                      <select class="form-select" v-model="formData.gender">
                        <option value="">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label">Languages</label>
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control"
                          v-model="newLanguage"
                          placeholder="Add a language"
                        />
                        <button
                          type="button"
                          class="btn btn-outline-primary"
                          @click="addLanguage"
                        >
                          Add
                        </button>
                      </div>
                      <div class="mt-2">
                        <span
                          v-for="(lang, index) in formData.languages"
                          :key="index"
                          class="badge bg-primary me-2 mb-2 p-2"
                        >
                          {{ lang }}
                          <i class="bi bi-x-circle ms-1" @click="removeLanguage(index)"></i>
                        </span>
                      </div>
                    </div>
                    
                    <h5 class="mt-4 mb-3">Travel Preferences</h5>
                    
                    <div class="mb-3">
                      <label class="form-label">Travel Style</label>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="style1"
                          v-model="formData.preferences.travelStyles"
                          value="budget"
                        />
                        <label class="form-check-label" for="style1">Budget</label>
                      </div>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="style2"
                          v-model="formData.preferences.travelStyles"
                          value="luxury"
                        />
                        <label class="form-check-label" for="style2">Luxury</label>
                      </div>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="style3"
                          v-model="formData.preferences.travelStyles"
                          value="adventure"
                        />
                        <label class="form-check-label" for="style3">Adventure</label>
                      </div>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="style4"
                          v-model="formData.preferences.travelStyles"
                          value="cultural"
                        />
                        <label class="form-check-label" for="style4">Cultural</label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="style5"
                          v-model="formData.preferences.travelStyles"
                          value="relaxation"
                        />
                        <label class="form-check-label" for="style5">Relaxation</label>
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label">Preferred Activities</label>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="act1"
                          v-model="formData.preferences.activities"
                          value="hiking"
                        />
                        <label class="form-check-label" for="act1">Hiking</label>
                      </div>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="act2"
                          v-model="formData.preferences.activities"
                          value="sightseeing"
                        />
                        <label class="form-check-label" for="act2">Sightseeing</label>
                      </div>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="act3"
                          v-model="formData.preferences.activities"
                          value="food"
                        />
                        <label class="form-check-label" for="act3">Food & Dining</label>
                      </div>
                      <div class="form-check mb-2">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="act4"
                          v-model="formData.preferences.activities"
                          value="photography"
                        />
                        <label class="form-check-label" for="act4">Photography</label>
                      </div>
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="act5"
                          v-model="formData.preferences.activities"
                          value="nightlife"
                        />
                        <label class="form-check-label" for="act5">Nightlife</label>
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label">Accommodation Preferences</label>
                      <select class="form-select" v-model="formData.preferences.accommodation">
                        <option value="hostel">Hostel</option>
                        <option value="budget_hotel">Budget Hotel</option>
                        <option value="mid_range_hotel">Mid-range Hotel</option>
                        <option value="luxury_hotel">Luxury Hotel</option>
                        <option value="airbnb">Airbnb / Vacation Rental</option>
                        <option value="camping">Camping</option>
                      </select>
                    </div>
                    
                    <div class="text-end mt-4">
                      <button type="button" class="btn btn-outline-secondary me-2" @click="isEditing = false">
                        Cancel
                      </button>
                      <button type="submit" class="btn btn-primary" :disabled="updateLoading">
                        <span v-if="updateLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Save Changes
                      </button>
                    </div>
                  </form>
                  
                  <div v-else>
                    <div class="profile-detail-section mb-4">
                      <h5>About Me</h5>
                      <p v-if="profile && profile.bio">{{ profile.bio }}</p>
                      <p v-else class="text-muted">No bio added yet</p>
                    </div>
                    
                    <div class="row mb-4">
                      <div class="col-md-6">
                        <div class="profile-detail-section">
                          <h5>Personal Information</h5>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <strong>Age:</strong> {{ profile && profile.age ? profile.age : 'Not specified' }}
                            </li>
                            <li class="mb-2">
                              <strong>Gender:</strong> {{ profile && profile.gender ? formatGender(profile.gender) : 'Not specified' }}
                            </li>
                            <li>
                              <strong>Languages:</strong>
                              <span v-if="profile && profile.languages && profile.languages.length">
                                {{ profile.languages.join(', ') }}
                              </span>
                              <span v-else class="text-muted">None added</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div class="col-md-6">
                        <div class="profile-detail-section">
                          <h5>Travel Preferences</h5>
                          <ul class="list-unstyled">
                            <li class="mb-2">
                              <strong>Travel Style:</strong>
                              <span v-if="profile && profile.preferences && profile.preferences.travelStyles && profile.preferences.travelStyles.length">
                                {{ formatArray(profile.preferences.travelStyles) }}
                              </span>
                              <span v-else class="text-muted">Not specified</span>
                            </li>
                            <li class="mb-2">
                              <strong>Activities:</strong>
                              <span v-if="profile && profile.preferences && profile.preferences.activities && profile.preferences.activities.length">
                                {{ formatArray(profile.preferences.activities) }}
                              </span>
                              <span v-else class="text-muted">Not specified</span>
                            </li>
                            <li>
                              <strong>Accommodation:</strong>
                              <span v-if="profile && profile.preferences && profile.preferences.accommodation">
                                {{ formatAccommodation(profile.preferences.accommodation) }}
                              </span>
                              <span v-else class="text-muted">Not specified</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  </template>
  
  <script>
  import { ref, computed, reactive, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import DefaultLayout from '@/layouts/DefaultLayout.vue';
  
  export default {
    name: 'ProfileView',
    components: {
      DefaultLayout
    },
    setup() {
      const store = useStore();
      const fileInput = ref(null);
      const isEditing = ref(false);
      const newLanguage = ref('');
      const updateLoading = ref(false);
      
      // Computed properties
      const user = computed(() => store.getters['auth/user']);
      const profile = computed(() => store.getters['profile/profile']);
      const loading = computed(() => store.getters['profile/loading']);
      const error = computed(() => store.getters['profile/error']);
      
      // Placeholder counts for trips and matches
      const tripsCount = ref(0);
      const matchesCount = ref(0);
      
      // Form data
      const formData = reactive({
        displayName: '',
        bio: '',
        age: null,
        gender: '',
        languages: [],
        preferences: {
          travelStyles: [],
          activities: [],
          accommodation: ''
        }
      });
      
      // Initialize form data from profile
      const initFormData = () => {
        if (profile.value) {
          formData.displayName = profile.value.displayName || '';
          formData.bio = profile.value.bio || '';
          formData.age = profile.value.age || null;
          formData.gender = profile.value.gender || '';
          formData.languages = [...(profile.value.languages || [])];
          
          // Initialize preferences
          if (profile.value.preferences) {
            formData.preferences.travelStyles = [...(profile.value.preferences.travelStyles || [])];
            formData.preferences.activities = [...(profile.value.preferences.activities || [])];
            formData.preferences.accommodation = profile.value.preferences.accommodation || '';
          }
        }
      };
      
      // Fetch profile data
      onMounted(async () => {
        if (user.value) {
          await store.dispatch('profile/fetchProfile', user.value.uid);
          initFormData();
          
          // Fetch trips count (this is a placeholder - implement actual count later)
          // This would typically be done by querying trips collection
          tripsCount.value = Math.floor(Math.random() * 5);
          
          // Fetch matches count (this is a placeholder - implement actual count later)
          // This would typically be done by querying matches collection
          matchesCount.value = Math.floor(Math.random() * 10);
        }
      });
      
      // Methods
      const triggerFileInput = () => {
        fileInput.value.click();
      };
      
      const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
          await store.dispatch('profile/uploadProfileImage', {
            userId: user.value.uid,
            file
          });
        } catch (error) {
          console.error('Error uploading image:', error);
        }
        
        // Reset the file input
        event.target.value = '';
      };
      
      const handleDeleteImage = async () => {
        try {
          await store.dispatch('profile/deleteProfileImage', user.value.uid);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      };
      
      const addLanguage = () => {
        if (newLanguage.value.trim() && !formData.languages.includes(newLanguage.value.trim())) {
          formData.languages.push(newLanguage.value.trim());
          newLanguage.value = '';
        }
      };
      
      const removeLanguage = (index) => {
        formData.languages.splice(index, 1);
      };
      
      const updateProfile = async () => {
        updateLoading.value = true;
        
        try {
          await store.dispatch('profile/updateProfile', {
            userId: user.value.uid,
            profileData: {
              displayName: formData.displayName,
              bio: formData.bio,
              age: formData.age,
              gender: formData.gender,
              languages: formData.languages,
              preferences: {
                travelStyles: formData.preferences.travelStyles,
                activities: formData.preferences.activities,
                accommodation: formData.preferences.accommodation
              }
            }
          });
          
          isEditing.value = false;
        } catch (error) {
          console.error('Error updating profile:', error);
        } finally {
          updateLoading.value = false;
        }
      };
      
      // Helper methods for formatting
      const formatGender = (gender) => {
        const map = {
          male: 'Male',
          female: 'Female',
          other: 'Other'
        };
        return map[gender] || gender;
      };
      
      const formatArray = (arr) => {
        if (!arr || !arr.length) return '';
        
        return arr.map(item => {
          return item.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }).join(', ');
      };
      
      const formatAccommodation = (acc) => {
        if (!acc) return '';
        
        return acc.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      };
      
      return {
        profile,
        loading,
        error,
        fileInput,
        isEditing,
        formData,
        newLanguage,
        updateLoading,
        tripsCount,
        matchesCount,
        triggerFileInput,
        handleFileChange,
        handleDeleteImage,
        addLanguage,
        removeLanguage,
        updateProfile,
        formatGender,
        formatArray,
        formatAccommodation
      };
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .profile-image-container {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }
  
  .profile-image {
    position: relative;
    width: 100%;
    height: 100%;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .profile-image-remove {
      position: absolute;
      top: 5px;
      right: 5px;
      border-radius: 50%;
      padding: 0.25rem;
      width: 28px;
      height: 28px;
    }
  }
  
  .profile-image-placeholder {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border-radius: 50%;
    cursor: pointer;
    
    i {
      font-size: 5rem;
      color: #ced4da;
    }
    
    .upload-overlay {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background-color: #4682B4;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      i {
        font-size: 1rem;
        color: #fff;
      }
    }
  }
  
  .profile-detail-section {
    h5 {
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
  }
  </style>