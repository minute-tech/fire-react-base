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

## Setup Firebase
1. Create live and test Firebase projects for this new site, initializing Analytics, Authentication, Firestore, Storage, Hosting, and Functions in the Firebase project consoles.

2. Clear existing Firebase project aliases:
- $ `firebase use --clear`

3. Set new Firebase project aliases:
- $ `firebase use --add` once for each 'live' and 'test'

4. Set SendGrid key:
- $ `firebase functions:config:set sendgrid_api.key="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx" --project test` 

5. Deploy to alias
- $ `firebase deploy --project=test`
- Note that any Firebase Hosting accessed will always use the `production` environment, and live (not localhost) links, will always be at the `live` Firebase project! i.e. `test-fire-react-base` is still using the `fire-react-base` project env.

6. If custom domain, add it to the authorized domain in Firebase console > Authentication > Sign in Method 
- Make sure to add `sitename.com` and `www.sitename.com`

## Change from Default Base
1. Check app for "TODO:" tags

2. For now manually creating with button, so input theme details into the createCustomSite function in Admin Dashboard

3. To update font, see `App.css` in src assets

4. Add in icons to public 
- Use this site to generate icon from PNG file (https://favicon.io/), then add that 32x32, 192, and 512 icon files to the `public` folder in the project

5. You may want to adjust the Headers such as the Content Security Policy to match your exact app needs.
https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#mitigating_cross-site_scripting
https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
https://www.permissionspolicy.com/

## Multiple hosting URLs at one Firebase project
1. Name the two targets you wish, but first make sure these are hosting site names on each of test and live projects:
 $ `firebase target:apply hosting draft draft-appname`  
 $ `firebase target:apply hosting prod prod-appname`  
 
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

4. Clear target names:
 $ `firebase target:clear hosting draft`

## Pushing current source code to showcase on new project
Building from multiple .env files is using the library installed by `npm install env-cmd`.

1. Create or use another Firebase project and get the config variables to place in our `.env.test1` file. Make sure to set all the steps above that pertain to a Firebase project being used with this template.
- See `package.json` for npm build changes for .test1, etc

2. Add the newly created Firebase project to this React project
 $ `firebase use --add`

3. Run a test environment (.env file is different)
 $ `npm run-script start:test1` 

4. Build a test environment (.env file is different)
 $ `npm run-script build:test1` 

4. Deploy to test environment
 $ `firebase deploy --project=test --only hosting`

## Misc
- More CLI commands: https://firebase.google.com/docs/cli