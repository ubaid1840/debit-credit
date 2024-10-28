### Getting started
Visit firebase.google.com -> Go to console -> Create new project and app
Open Project settings from settings icon on project overview -> Scroll down and under SDK setup and configuration for node copy each credentials and paste in relevant field inside .env.example
Rename .env.example to .env
Initialize Authentication for Email/Password and Database (development / testing) from firebase project under build category
Open Firebase Database -> Navigate to Rules -> Clear the code and paste below code and click publish

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /{document=**} {
      allow read, write;
    }
  }
} 


### Install all dependencies
```bash
npm install
```

### Install firebase cli
``` bash
npm install -g firebase-tools
```

### Run the development server
``` bash
npm run dev
```

### Create build
``` bash
npm run build // Static build will be created inside dist folder
```

### Firebase hosting steps
``` bash
firebase login
firebase init hosting // Select existing firebase project and select created firebase app. Overwrite any file if asked and run build command again
firebase deploy // Make sure latest build is created before running this command
```

### Firebase troubleshooting
Run the following command if you find trouble running firebase login and restart your Editor / Terminal
``` bash
npm install -g firebase-tools
```