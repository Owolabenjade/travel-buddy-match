import { createStore } from 'vuex'
import auth from './modules/auth'
import profile from './modules/profile'
import trips from './modules/trips'
import matches from './modules/matches'
import messages from './modules/messages'
import notifications from './modules/notifications'

export default createStore({
  modules: {
    auth,
    profile,
    trips,
    matches,
    messages,
    notifications
  }
})