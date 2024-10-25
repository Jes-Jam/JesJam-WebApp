# JesJam

<img src="./public/images/jesjam_logo.svg" align="right" alt="JesJam Logo" width="250" height="200" style="margin-top: -10px; margin-right: -10px; margin-bottom: -10px !important;"/>

JesJam is a flashcards app that use spaced repetition method and gamification to enhance learning engagement and retention.

```bash
trust me it work!
```

<br/> 

# Features 🐦‍🔥

## User Roles and Capabilities

### Super Admin
- Review and moderate flashcard publications from authorized users
- Account management capabilities:
  - Suspend or remove authorized user accounts
  - Grant streak continuity exceptions for users

### Authorized User
- **Flashcard Management**
  - Create, read, update, and delete personal flashcards
  - Request publication of flashcards for public access
  - Add favorite cards and classes
  - View personal flashcard collection

- **Learning Features**
  - Study specific classes
  - View comprehensive question lists within classes
  - Track learning streaks
  - Access study history
  - View favorite classes and cards

- **Social Features**
  - Share daily scores on Facebook
  - Share milestone streaks on Facebook
  - Invite friends to join specific classes
  - View personal ranking on leaderboard
  - Share leaderboard achievements on Facebook

### Non-Authorized User
- Browse and review public flashcards
- Access featured classes
- Register to become an authorized user

## Authentication System

Implemented using Clerk Authentication:
- Multiple registration/login options:
  - Email and password
  - Social login via Facebook
  - Secure user authentication flow

## Content Management

### Class Management
- Comprehensive CRUD operations for flashcard categories
- Organize flashcards into structured classes
- Feature specific classes for broader visibility

### Flashcard System
- **Content Creation**
  - Rich media support (Audio/Image)
  - Add memory tips and hints
  - Public and private card creation modes

- **Visibility Control**
  - Private flashcard creation
  - Publication request system
  - Admin review process for public visibility

## User Interface

### Landing Page
- Welcoming interface for all users
- Featured content showcase
- Easy access to key features

### Personalization
- **Favorite Management**
  - Add/remove favorite flashcards
  - Add/remove favorite classes
  - Personalized collection view

### Social and Competitive Features
- **Leaderboard System**
  - Real-time ranking
  - Personal progress tracking
  - Social sharing capabilities

# Licence

<img src="./public/images/AGPLv3_Logo.svg" align="right" alt="JesJam Logo" width="150" height="100" style="margin-top: -10px; margin-right: -10px; margin-bottom: -10px !important;"/>
This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0) with the following additional terms:

- ✅ The source code is open for viewing, modification, and educational use
- ✅ Contributions to the project are welcome
- ❌ Commercial deployment of this codebase as a competing service is not permitted without prior written agreement
- ❌ The project name and branding are protected and require explicit permission for use

For business inquiries, commercial licensing, or any questions, please contact [vireakrothpun@gmail.com]

See the [LICENSE](LICENSE) file for the full AGPL-3.0 terms.