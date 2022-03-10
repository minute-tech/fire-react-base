# Fire React Base
Fire React Base is a template for creating web apps with Firebase and React.js.

## Featured NPM libraries:
* react 
    * Component organization and front end rendering
* firebase
    * Database, authentication, server side functions, file storage, etc
* react-router-dom
    * Link and page navigation
* styled-components
    * JavaScript CSS styling
* react-helmet-async
    * Dynamic page titles
* react-image-lightbox
    * Enlarging images for easy viewing mobile and desktop
* react-flexbox-grid
    * Grid system with rows and columns which scales depending on screen size
* formik
    * Breezy form building
* yup
    * Form validation
* react-toastify
    * Notification alerts
* react-confirm-alert
    * Confirmation dialogues
* react-icons
    * Popular icon usage like font Awesome

## Setup Base
1. Create live and test Firebase projects for this new site, initializing Analytics, Authentication, Firestore, Storage, Hosting, and Functions in the Firebase project consoles.

2. Clear existing Firebase project aliases:
- $ `firebase use --clear`

3. Set new Firebase project aliases:
- $ `firebase use --add` once for each 'live' and 'test'

4. Set SendGrid key:
- $ `firebase functions:config:set sendgrid_api.key="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx" --project test` 

5. Deploy to alias
- $ `firebase deploy --project=test`


### One Firebase project, multiple hosting URLs
1. Name the two targets you wish, but first make sure these are hosting site names on each of test and live projects:
 $ `firebase target:apply hosting draft draft-appname`  
 $ `firebase target:apply hosting prod test-fire-react-base`  
 
2. Then update `firebase.json` file like so:  
```
...
"hosting": [
    {
      "target": "draft",
      "public": "build",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    },
    {
      "target": "prod",
      "public": "build",
      "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}

```  

3. Then deploy to specific target like so:  
 $ `firebase deploy --only hosting:draft --project=test`

4. Clear target names
 $ `firebase target:clear hosting draft`

## Misc
- More CLI commands: https://firebase.google.com/docs/cli