import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/firebase';
import HomeView from '@/views/HomeView.vue';

// Route guard for authenticated routes
const requireAuth = (to, from, next) => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    unsubscribe();
    if (!user) {
      next({ 
        name: 'Login', 
        query: { redirect: to.fullPath } 
      });
    } else {
      next();
    }
  });
};

// Route guard for guest routes (logged in users are redirected)
const requireGuest = (to, from, next) => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    unsubscribe();
    if (user) {
      next({ name: 'Dashboard' });
    } else {
      next();
    }
  });
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    beforeEnter: requireGuest
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    beforeEnter: requireGuest
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/ProfileView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/trips',
    name: 'Trips',
    component: () => import('@/views/trips/TripsView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/trips/new',
    name: 'NewTrip',
    component: () => import('@/views/trips/NewTripView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/trips/:id',
    name: 'TripDetails',
    component: () => import('@/views/trips/TripDetailsView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/matches',
    name: 'Matches',
    component: () => import('@/views/matches/MatchesView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('@/views/messaging/MessagesView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/messages/:matchId',
    name: 'MessageThread',
    component: () => import('@/views/messaging/MessageThreadView.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  },
  {
    path: '/trips/:id/edit',
    name: 'EditTrip',
    component: () => import('@/views/trips/TripEditView.vue'),
    beforeEnter: requireAuth
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;