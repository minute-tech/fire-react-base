# Fire React Base
Fire React Base is a CMS template for creating web apps with Firebase and React.js.

## App Accounts:
These accounts may already be provided by your company, so check first!
* [GitHub](https://github.com/)
    * GitHub is a Microsoft company that safely stores and syncs our code base to the cloud and is an industry standard. I usually just used my personal Github account for this.
* [Firebase](https://firebase.google.com)
    * Firebase is a backend platform providing services for apps like databasing, web hosting, file storage, user authentication, server side functions, and more. Their infrastructure is backed by Google Cloud Platform (Firebase was purchased by Google).
    Millions of developers worldwide empower their apps with Firebase!
* [SendGrid](https://www.sendgrid.com/)
    * SendGrid is a Twilio company that is a developer friendly, reliable email sending and management platform. You will need to get a few values like the app ID, admin, and search API keys, and add to Firebase Function config and/or .env file. You'll also want to create a Dynamic Template in the Email API tab, and copy the values from the functions > src > utils > email-templates > ContactMessage.html to a new dynamic template on the SendGrid Dashboard.
* [Algolia](https://www.algolia.com/)
    * Algolia is a search platform that is mainly used for full-text search in our app, aka if I searched "Dog", any indexed results with "Dog" in them would return the result like "Dog hat" or "Cat-Dog". Algolia is also acts as a backup source of data. 
* [Tiny](https://www.tiny.cloud/)
    * Tiny MCE is a rich text editor for the custom pages and notes and more! This is free for now, but some form features like showing custom fonts may cost money.

## System Installs
* [Node.js](https://nodejs.org/en/download/current)
    * Used for running npm mainly, which is our Javascript package manager. Install the "Current" version for your OS.
* [Firebase CLI](https://firebase.google.com/docs/cli)
    * Used to run out backend deploying commands mainly, like `firebase deploy`.
* [Github Desktop](https://desktop.github.com/)
    * You can also use the CLI, but the Desktop version is much easier on my feeble brain.
* [git](https://git-scm.com/downloads)
    * This often is a question prompt when installing Node.js I believe to also install "git", so you may already have it installed from this, if not heres the link.
* [Visual Studio Code Insiders](https://code.visualstudio.com/insiders/)
    * This is just my personal preference IDE to edit code files and have an inline terminal window on, but there are many other IDEs. 
    I use the "Insiders" VSCode because you can link a Github profile to your VSCode profile and save preferences. See bottom of README for Doug's favorite VSCode Extensions!
* [Python2.7 or 3](https://www.python.org/downloads/)
    * Not 100% on this one because this is almost always already installed, so try without manually installing this.
* [Something Else](https://www.minute.tech)
    * I will add to this list if I forgot any, I know I did...

## NPM Libraries:

### Frontend:
* [react](https://www.npmjs.com/package/react)
    * Component organization and front end rendering
* [firebase](https://www.npmjs.com/package/firebase)
    * Database, authentication, server side functions, file storage, etc
* [react-router-dom](https://www.npmjs.com/package/react-router-dom)
    * Link and page navigation
* [styled-components](https://www.npmjs.com/package/styled-components)
    * JavaScript CSS styling
* [polished](https://www.npmjs.com/package/polished)
    * Supplementary library to styled-components that provides utility functions to manipulate CSS
* [@tinymce/tinymce-react](https://www.npmjs.com/package/@tinymce/tinymce-react)
    * Rich text editor
* [react-helmet-async](https://www.npmjs.com/package/react-helmet-async)
    * Dynamic page meta data, such as page title
* [react-grid-system](https://www.npmjs.com/package/react-grid-system)
    * Responsive grid system
* [react-image-lightbox](https://www.npmjs.com/package/react-image-lightbox)
    * Enlarging images for easy viewing mobile and desktop
* [react-hook-form](https://www.npmjs.com/package/react-hook-form)
    * Breezy form building
* [react-toastify](https://www.npmjs.com/package/react-toastify)
    * Notification alerts
* [react-confirm-alert](https://www.npmjs.com/package/react-confirm-alert)
    * Confirmation dialogues
* [react-icons](https://www.npmjs.com/package/react-icons)
    * Quickly and easily use popular icons such as Font Awesome
* [react-csv](https://www.npmjs.com/package/react-csv)
    * Simple library to export a JS object to CSV
### Backend:
* [firebase](https://www.npmjs.com/package/firebase)
    * Access to Firebase base SDK for databasing and more
* [firebase-admin](https://www.npmjs.com/package/firebase-admin)
    * Access to Firebase admin SDK for authentication and more
* [firebase-functions](https://www.npmjs.com/package/firebase-functions)
    * Server side functions
* [algoliasearch](https://www.npmjs.com/package/algoliasearch)
    * Full-text search and data backup
* [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail)
    * Mail sending and templating
* [lodash](https://www.npmjs.com/package/lodash)
    * Helper functions, primarily used for deep cloning objects
* [@loadable/component](https://www.npmjs.com/package/@loadable/component)
    * For loading function for custom dynamic react-icons in menus


## Initialization

**1. Create Github project using this template**
   - Name with a dash `-` instead of a dot `.` such as `appname-com` to line up with Firebase project name

**2. Clone this new Github project to desktop for setup**

**3. Create 2 Firebase projects (live and test) for this new site @ https://console.firebase.google.com/**
   - Names with a dash `-` instead of a dot `.` such as `appname-com` to match GitHub repo name
   - Initialize Analytics, Authentication, Firestore, Storage, Hosting, and Functions in the Firebase project console by clicking through those tabs on the left
   - Add a web app under Gear > Project Settings > Your Apps, then grab the Config snippet to copy paste the values into a `.env` file in the main repo directory (copy and rename `template.env` to `.env`)
   - You be prompted for Blaze billing in Functions tab, enable and set an alert to like $25, this won't cost much unless your app blows up!

**4. Install NPM libraries**
   - Run `npm install` in the terminal window in main directory
   - Navigate to functions directory with `cd ./functions/` then run `npm install` there as well, then back to main directory `cd ../`

**5. Set new Firebase project aliases**
   - Delete file `.firebaserc`
   - $ `firebase use --add` once for each 'live' and 'test'

**6. Set Firebase Function config variables (SendGrid & Algolia)**
    - $ `firebase functions:config:set sendgrid_api.key="SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" --project test`
    - $ `firebase functions:config:set sendgrid_api.key="SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" --project live`
    - $ `firebase functions:config:set algolia_api.app_id="XXXXXXX" algolia_api.admin_key="XXXXXXXXXXXXXXXXXXX" algolia_api.search_key="XXXXXXXXXXXXXXXXXXX" --project test`
    - $ `firebase functions:config:set algolia_api.app_id="XXXXXXX" algolia_api.admin_key="XXXXXXXXXXXXXXXXXXX" algolia_api.search_key="XXXXXXXXXXXXXXXXXXX" --project live`

**7. Enable MFA on GCP** 
- Enable multi-factor authentication (MFA) for this new project: https://console.cloud.google.com/marketplace/details/google-cloud-platform/customer-identity?project=fire-react-base
- Add a test phone number with a test code to use for ever login (like +11234567890 and 123123) AND add the authorized domain if custom domain.

**8. Update URLs in `cors.json` to include relevant domains**
   - This is needed to load fonts from the URL they are stored under. 
   - Edit the `cors.json` and `test-cors.json` file in the base directory so it has all the URLs you'd be using for live and test environments
   - Make sure `gsutil` is installed on your system and it's added to your path: https://cloud.google.com/storage/docs/gsutil_install
   - Ensure you are authed: $ `gcloud auth login`
   - Deploy to GCP project using the follow command in the local project folder terminal: $ `gsutil cors set cors.json gs://fire-react-base.appspot.com`, `gsutil cors set test-cors.json gs://test-fire-react-base.appspot.com` etc
   - Double check bucket name here if needed: https://console.cloud.google.com/storage/browser?project=fire-react-base&prefix=
   - See https://stackoverflow.com/questions/37760695/firebase-storage-and-access-control-allow-origin for more info!

**9. Search for TODOs around code**
   - "Fire React Base" / "fire-react-base" / "test-fire-react-base" usages replaced by your app name in some places
   - Update `name` in `package.json` from `fire-react-base` to your appname
   - Update `robots.txt` to be the main domain for this site, with extension path of `/sitemap.xml`. This is used for SEO.
   - Update `sitemap.xml` to be the main domain for this site with current date. Remember to come back to this file and update the paths for SEO!
   - Update `manifest.json` to be this app's name and colors. This file is used for installing the web app on mobile and desktop devices.
   - Update `index.html` in `public` folder such as default `<title>`, `theme-color`, `description`, and more
   - Update `README.md`, at least the title and description to this project. I just copy-paste the same description used in `index.html`.

**10. Add in icons to public**
   - Use this site to generate icon from PNG file (https://favicon.io/), then add that 48x48, 192, apple-touch-icon and 512 icon files to the `public` folder in the project

**11. You may want to adjust the Headers such as the Content Security Policy to match your exact app needs.**
   - Check `firebase.json`
   - https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#mitigating_cross-site_scripting
   - https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
   - https://www.permissionspolicy.com/

**12. Build**
   - $ `npm run-script build`
   - $ `npm run-script build:test1` if using another `.env`

**13. Deploy to alias**
   - $ `firebase deploy --project=live`
   - Note that any Firebase Hosting accessed will always use the `production` environment, and live (not localhost) links, will always be at the `live` Firebase project! i.e. `test-fire-react-base` is still using the `fire-react-base` project env.

**99. Extra Config**
   - If custom domain, add it to the authorized domain in Firebase console > Authentication > Sign in Method 
       - Make sure to add `appname.com` and `www.appname.com`
       - You can add a redirect from `appname.web.app` & `appname.firebaseapp.com` to your custom domain by adding to `firebase.json`:
       ```
        "hosting": {
            "public": "build",
            "redirects": [
                    {
                    "source": "/",
                    "destination": "https://www.website.com/",
                    "type": 301
                    }
                ],
            ....
        }
        ```
   - For extra security, limit your API keys to certain functions, domains, etc
       - https://console.cloud.google.com/apis/credentials
   - You may want to update the default font at `App.css` in src assets but not necessarily fully needed anymore since you can easily just upload your font in the Site Manager tab, but if you want to change the default font its at a `.ttf`/`.otf` font file placed in assets > fonts.

## Customization
Any further customizations would be done through hard coding the source code. Have fun coding!!

**1. Default `site` collection created when the first user doc is added and is auto set to be a super admin.**

**2. Edit the site and theme details on the `Manage Site` tab of the Admin Dashboard.**

**3. If you want to work with new or different data, you will need to create, update, or delete logic in these locations:**
- Create `ManageExample.js` file by copying an existing Management page like for Feedback, then import that page under the `Views.js` file so it is routed to a URL path.
- Create new object under `ITEMS` in the `constants.js` file with relevant variable names, data collection fields, validation schemas, styling, etc. Reference or copy usage from other default item collections. Code adjustments may need to be made to fit your use case. 
- While in the `functions` folder, create a new or copy an existing items listener page under `listeners` and name the file & variables within accordingly. This listener file has 3 listeners, 1 onCreate, 1 onUpdate, and 1 onDelete, and will run whenever a Firestore collection document for that collection is changed. Use this file to make sensitive backend actions happen! Remember to also add this new set of listeners to the `index.ts` file in this `functions` folder, name them accordingly.
- Update the `ROLES` object in the `ITEMS` constant object within the `constants.ts` file in the `functions` backend folder. You will be changing the collections the rules apply to here such as under `depKeys` key.
- When complete with setup on front end of the new items to collect, copy this `ITEMS` constant from above into to the `constants.ts` in the `functions` folder at the root directory of the project. You will place the object within the existing `ITEMS` constant. This will copy the changes to the `ROLES` and any new items to the backend `constants.ts`.
- Update `firestore.rules` by creating a new or copying an existing collection rule set for this new item collection. Think about how you want the data to be access! Can anyone create it? These rules can be adjusted slightly with the ManageRoles page by super admins and setting a user's role accordingly.
- Add item collections to `RESERVED_ROLES` constant in .js and .ts files.
- Remember to build and deploy all these changes to Firebase!

**4. Passable props to the item structure fed into CustomInput component:**
- `key` (`string`, `required`): Unique key that will be the key for the value on the database structure.
- `type` (`constant.string`, `required`):
- `label` (`string`, default `""`): This is the human readable value for the frontend interface when describing this data.
- `shown` (`boolean`, default `false`): Whether or not this value is shown in the table.
- `placeholder` (`string`, default `""`): Light grey text when the field is empty to guide user
- `uneditable` (`boolean`, default `false`): Do we want this field to be read only?
- `tooltip` (`string`, default `""`): Small popup when you hover over the "i" icon element next to the field label.
- `tooltipLink` (`string`, default `""`): The tooltip becomes clickable which will open a new tab for the link
- `breakpoints` (`object`, default `{ sm: 12, md: 12, lg:12, xl: 12, xxl: 12, xxxl: 12 }`): Set a custom break point for a column. Value of `12` being a full row, and `1` being 1/12 of the row. See `react-grid-system` library.
- `validators` (`object`, default `{}`): Set validating props for the field, check the validation prop on `react-hook-form`, it is just passed directly there. 
- `subColumns` (`array`, `[]`): If DATA_TYPE === ARRAY then we will utilize the fieldArray type of `react-hook-form` library, adding the functionality to dynamically add more fields to an array type field. This currently only accepts a few types we have needed so far like checkbox, text, and select fields.
- `nestedColumns` (`array`, default `[]`): If DATA_TYPE === OBJECT then we will pull a recursive CustomInput out of this and will output to database as a nested value under the 
- `options` (`array`, default `[]`): If using a field like checkbox, select, etc that iterate over options to display in the field, use this for those string options.
- `defaultArrayFieldStruct` (`object`, default `{}`): If using a DATA_TYPE === ARRAY then we will need this to define the default structure of the first values being added.
- `initialValue` (`array`, default `[]`): This can be used to set the initial value that the fields will populate filled with, aka we set this value when we are updating an existing value from the database.
- `userLookup` (`boolean`, default `false`): Set to true if we are dependently grabbing user's ID AND their user object, because when we push to database we want to push more than just the user's first and last name, but also their ID, email, etc.
- `isUrl` (`boolean`, default `false`): Whether or not we display and validate the URL as such.
- `parentCollection` (`string`, default `""`): Collection key we will be searching for in useEffect
- `dependency` (`string`, default `""`): Key value we will be looking to be filled out first, and we will be filling this option with values based on that selection
    - You can edit the dependency setup in the useEffect of the ManageItem.js file:
    ```
    ...
        setDependents([
            {
                parentKey: "client", // Key value we will be looking for, first it that will need to be filled out first, before child appears.
                childKey: "poc", // Key value we will show when parent is filled.
                parentArray: tempClients, // Array of objects we will sift through once the user selects the parent value
                parentArrayOptionArrayKey: "contacts", // Once the user selects the parent value, we will need to know what key for the value we are grabbing from that parent document object and populating the select field with. This is a field WITHIN the document, not an array of documents!
                parentArrayOptionLabelKey: "name", // Options need to be a simple string, not an object, so what key will we be looking for in the array of objects to make the label of the option?
            }
        ]);
    ...
    ```

***Example:***
See how I use the `INPUT` constant values to fill in some values.
```
    {
        label: INPUT.ADDRESS.COUNTRY.LABEL,
        key: INPUT.ADDRESS.COUNTRY.KEY,
        placeholder: INPUT.ADDRESS.COUNTRY.PLACEHOLDER,
        tooltip: "County must be 2 character ISO code. Click to view examples.",
        tooltipLink: "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements",
        uneditable: false,
        type: DATA_TYPE.TEXT,
        breakpoints: {
            sm: 12,
            md: 6,
            lg: 3,
        },
        validators: {
            required: INPUT.ADDRESS.COUNTRY.ERRORS.REQUIRED,
            maxLength: {
                value: INPUT.ADDRESS.COUNTRY.ERRORS.MAX.KEY,
                message: INPUT.ADDRESS.COUNTRY.ERRORS.MAX.MESSAGE,
            },
            minLength: {
                value: INPUT.ADDRESS.COUNTRY.ERRORS.MIN.KEY,
                message: INPUT.ADDRESS.COUNTRY.ERRORS.MIN.MESSAGE,
            },
        },
    },
```

## Multiple Firebase project .env's 
Building from multiple .env files is using the library installed by `npm install env-cmd`.

**1. Create or use another Firebase project and get the config variables to place in our `.env.test1` file. Make sure to set all the steps above that pertain to a Firebase project being used with this template.**
   - See `package.json` for npm build changes for .test1, etc

**2. Add the newly created Firebase project to this React project**
   - $ `firebase use --add`

**3. Run a test environment (.env file is different)**
   - $ `npm run-script start:test1`

**4. Build a test environment (.env file is different)**
   - $ `npm run-script build:test1` 

**5. Deploy to test environment**
   - $ `firebase deploy --project=test --only hosting`

## Multiple hosting URLs for one Firebase project 
Sometimes you may want to showcase a quick frontend draft for the client. You can deploy that build directly to a new hosting URL like "draft1"

**1. Name the two targets you wish, but first make sure these are hosting site names on each of test and live projects:**
   -  $ `firebase target:apply hosting draft draft-appname`  
   -  $ `firebase target:apply hosting prod prod-appname`  
 
**2. Then update `firebase.json` file like so:**
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

**3. Then deploy to specific target like so:**
   - $ `firebase deploy --only hosting:draft --project=test`

**4. Clear target names:**
   - $ `firebase target:clear hosting draft`

## Misc:
- Check Firebase config values: $ `firebase functions:config:get --project=live`
- More Firebase CLI commands: https://firebase.google.com/docs/cli


- Doug's favorite VSCode Extensions!
    - christian-kohler.npm-intellisense-1.4.4
    - dotjoshjohnson.xml-2.5.1
    - dsznajder.es7-react-js-snippets-4.4.3
    - ecmel.vscode-html-css-1.13.1
    - equimper.react-native-react-redux-2.0.6
    - esbenp.prettier-vscode-9.10.4
    - extensions.json
    - github.copilot-1.78.9758
    - gruntfuggly.todo-tree-0.0.224
    - icrawl.discord-vscode-5.8.0
    - irongeek.vscode-env-0.1.0
    - lyzerk.linecounter-0.2.7
    - mikestead.dotenv-1.0.1
    - mrmlnc.vscode-scss-0.10.0
    - ms-vsliveshare.vsliveshare-1.0.5834
    - msjsdiag.vscode-react-native-1.10.2
    - neilding.language-liquid-0.1.1
    - paulmolluzzo.convert-css-in-js-1.1.3
    - streetsidesoftware.code-spell-checker-2.20.3
    - toba.vsfire-1.4.1
    - tomoki1207.pdf-1.2.2
    - tyriar.lorem-ipsum-1.3.1
    - zignd.html-css-class-completion-1.20.0