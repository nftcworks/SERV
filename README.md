# SERV

SERV is a mobile marketplace interface with five preloaded expert profiles in design, web development, marketing, business, and education. Desktop visitors see a short message asking them to open it on a phone.

Double-click **Start SERV.bat** on Windows to start the local server and open `http://127.0.0.1:4173`. Keep the launcher window open while using SERV. To see the mobile app on your PC, open your browser’s developer tools and turn on its phone preview. Node.js is required; no project packages need to be installed.

To try it on a phone over the same Wi-Fi, run `"Start SERV.bat" phone` in Command Prompt from the project folder, then open the **Same Wi-Fi** address printed in the window. Use this mode on a network you trust. Run `npm run build` to create a static copy in `dist/`.

To publish the website on GitHub Pages, push this folder to `main`, then choose **Settings → Pages → Deploy from a branch → main → /(root)**. Pages serves the root `index.html` and its assets directly, so no Node.js build is needed. Open the published link on a phone or in a browser's mobile preview. GitHub Pages is public by default.

To try the offline Android app, transfer **SERV.apk** to an Android 8 or newer phone and open it there. The APK includes the same screens and assets. Saved experts, projects, and applications are stored separately from the website.

To rebuild the test APK on Windows, double-click **Build SERV APK.bat**. It needs Node.js, JDK 17 on PATH, Android SDK Platform 35, and Android Build Tools 35.0.0. The script uses the same web files and creates **SERV.apk** in this folder.

- Search by name, specialty, or city; filter by expertise and sort by hourly rate.
- Open a profile or bookmark it to revisit later from Saved.
- Post a project brief, compare experts, choose one, mark the project complete, and save a rating.
- Set up a local profile in Account to update your display name, set notification preferences, or fill out an expert application.

Bookmarks, projects, ratings, notification preferences, and expert applications are saved in the current browser. Applications are not sent for review. Profile stats and verification marks are preloaded design data. The local profile lasts for the current browser session. It does not create a server account or connect to Google. SERV does not send messages, contact experts, or take payments.
