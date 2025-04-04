# 🧳 Travel Buddy Match

## The Journey Behind the Code 🌍

Have you ever found yourself in a foreign city, eager to explore but hesitant to venture out alone? That's exactly where I was in Bangkok during my solo trip in 2022. The hostel was packed with fellow travelers, yet finding someone interested in the same activities and schedule felt like searching for a needle in a haystack!

I spent countless hours in hostel common rooms, joining WhatsApp groups, and scrolling through travel forums trying to find compatible travel companions. It struck me then: **there had to be a better way**. That epiphany planted the seed for Travel Buddy Match.

## What is Travel Buddy Match? 🤝

Travel Buddy Match is a platform that connects solo travelers with compatible companions based on shared interests, destinations, and travel styles. Think of it as a friendship matchmaker for those memorable journeys!

- **Deployed Landing Page:** [Travel Buddy Match](https://owolabenjade.github.io/travel-buddy-landing/)
- **Final Project Blog Article:** [Building Travel Buddy Match - A Journey](https://medium.com/@benjaminowolabi/building-travel-buddy-match-a-journey-1234567890)
- **Developer:** [Benjamin Owolabi](https://www.linkedin.com/in/benjaminowolabi)

## Features & Screenshots 📱

### Smart Matching Algorithm ✨

The heart of the application! I designed an algorithm that considers:
- Travel dates and destination overlap
- Activity preferences
- Travel styles (budget, luxury, adventure, etc.)
- Accommodation preferences

The algorithm assigns compatibility scores (0-100%) by weighting these factors:
```javascript
function calculateCompatibility(trip1, trip2) {
  let score = 0;
  const maxScore = 100;
  
  // Check activities overlap (40% of total score)
  if (trip1.activities && trip2.activities) {
    const trip1Activities = new Set(trip1.activities);
    const overlappingActivities = trip2.activities.filter(activity => trip1Activities.has(activity));
    const activityOverlapPercentage = overlappingActivities.length / 
      Math.max(trip1.activities.length, trip2.activities.length);
    score += activityOverlapPercentage * 40;
  }
  
  // Check budget compatibility (30% of total score)
  if (trip1.budget === trip2.budget) {
    score += 30; // Exact budget match
  } else if (
    (trip1.budget === 'budget' && trip2.budget === 'mid_range') ||
    (trip1.budget === 'mid_range' && trip2.budget === 'budget') ||
    (trip1.budget === 'mid_range' && trip2.budget === 'luxury') ||
    (trip1.budget === 'luxury' && trip2.budget === 'mid_range')
  ) {
    score += 15; // Adjacent budget categories
  }
  
  // ... other compatibility factors
  
  return Math.min(Math.round(score), maxScore);
}
```

This was challenging to get right! Originally, I had a simpler boolean match system, but quickly realized that nuanced scoring created much better matches.

### Real-time Messaging 💬

Implemented a real-time chat system using Firebase's Firestore with listeners that update messages instantly:

```javascript
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
```

### Trip Planning Tools 📝

Create detailed trip plans with:
- Date ranges
- Destination details
- Activity preferences
- Budget levels
- Accommodation preferences

## Technical Challenges & Learning Journey 🧠

### Firebase Authentication: Roadblocks and Revelations

When I began this project, I had limited experience with Firebase. Implementing authentication was my first major hurdle. The error messages were cryptic:

```
Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.).
```

I spent **three days** troubleshooting this before realizing I needed to create the actual Firebase project first! 😅 This taught me the importance of thoroughly reading documentation before diving into implementation.

### The SCSS Dilemma

My initial decision to use SCSS for styling led to unexpected deployment issues. The build would fail with:

```
Module Error (from ../node_modules/sass-loader/dist/cjs.js):
Cannot find module 'sass'
```

Rather than simply installing the missing dependency, I took the opportunity to refactor to plain CSS with custom properties (CSS variables). This actually improved maintainability and reduced dependencies - a blessing in disguise!

```css
/* Before (SCSS) */
$primary-color: #4682B4;

.button {
  background-color: $primary-color;
}

/* After (CSS Variables) */
:root {
  --primary-color: #4682B4;
}

.button {
  background-color: var(--primary-color);
}
```

### Scaling Back for MVP

I initially planned to implement:
- Group travel matching
- In-app notifications
- Location-based recommendations
- Travel itinerary generation

However, I quickly realized I needed to focus on the core functionality first. This hard decision taught me about prioritization and shipping a focused product - a skill I believe is crucial in any development role.

## The Tech Stack 🛠️

- **Frontend:** Vue.js 3, Vuex (state management), Vue Router, Bootstrap 5
- **Backend:** Firebase (Authentication, Firestore, Storage)
- **Development:** Webpack, Babel, ESLint
- **Deployment:** GitHub Pages

## Installation & Setup 💻

Want to run the project locally? Here's how:

```bash
# Clone the repository
git clone https://github.com/Owolabenjade/travel-buddy-match.git

# Navigate to the project directory
cd travel-buddy-match

# Install dependencies
npm install

# Create a .env.local file with your Firebase configuration
touch .env.local
```

Add the following to your `.env.local` file (replace with your Firebase details):

```
VUE_APP_FIREBASE_API_KEY=your-api-key
VUE_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VUE_APP_FIREBASE_PROJECT_ID=your-project
VUE_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VUE_APP_FIREBASE_APP_ID=your-app-id
VUE_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Usage 🚀

```bash
# Development server
npm run serve

# Build for production
npm run build

# Linting
npm run lint
```

## The 8-Week Journey: Timeline & Reflections ⏱️

| Week | Focus | Challenges | Wins |
|------|-------|------------|------|
| 1-2 | Project planning, UI design | Scope creep, too many features | Finalized core features, created wireframes |
| 3-4 | Frontend setup, Vue components | Learning Vue 3 Composition API | Completed responsive UI components |
| 5-6 | Firebase integration | Authentication issues, data modeling | Real-time messaging working! |
| 7 | Matching algorithm | Complex logic, performance concerns | Optimized algorithm for better matches |
| 8 | Testing, bug fixes, deployment | SCSS issues, Firebase security | Successful deployment, working MVP |

**Key Learnings:**
1. Start small, iterate often
2. Read documentation thoroughly
3. Don't be afraid to pivot when something isn't working
4. Test with real users early (my friends became invaluable testers!)

## Future Roadmap 🗺️

This is just the beginning! For v2, I envision:

- [ ] Mobile app versions with React Native
- [ ] AI-powered trip recommendations
- [ ] Integration with travel booking APIs
- [ ] Group travel coordination
- [ ] Safety verification features

## Contributing 🤲

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## The Developer Behind the Code 👨‍💻

**Benjamin Owolabi**
- [LinkedIn](https://www.linkedin.com/in/benjaminowolabi)
- [GitHub](https://github.com/owolabenjade)
- [Twitter](https://twitter.com/ademidowolabi)

As a budding software engineer with a passion for travel, this project represents the intersection of my technical skills and personal interests. The eight weeks I spent developing Travel Buddy Match taught me more than just coding - they reinforced the importance of empathy in designing solutions that address real human needs.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements 🙏

- **ALX Software Engineering Program** for the opportunity and guidance
- My fellow travelers in Bangkok who inspired this idea
- Open source communities for Vue.js and Firebase
- My friends who tested early versions and provided invaluable feedback