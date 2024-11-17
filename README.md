This is the backend of the Assignment Submission Portal. 
The system supports two types of users: Users and Admins.

Technologies Used
  Node.js for backend development.
  Express.js for routing and handling HTTP requests.
  MongoDB for storing users, admins, and assignments.
  Google OAuth2 for authentication without Passport.js.
  Mongoose for MongoDB object modeling.

Setup
  Prerequisites
    Node.js and npm installed on your machine.
    MongoDB running locally or use a cloud-based MongoDB service like MongoDB Atlas.
    Google Developer Account to create OAuth2 credentials.

Installation Steps
  1. Clone the repository: git clone <repository-url>
                           cd assignment-submission-portal
 2. Install dependencies : npm install
 3. Set up environment variables: .env file in root directory
                                  GOOGLE_CLIENT_ID=your-google-client-id
                                  GOOGLE_CLIENT_SECRET=your-google-client-secret
                                  GOOGLE_REDIRECT_URI=your-redirect-uri
                                  MONGO_URI=your-mongodb-connection-uri
 4. Start server : npm start
 
