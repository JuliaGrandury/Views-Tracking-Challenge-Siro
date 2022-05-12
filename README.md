# Views-Tracking-Challenge

### Assignment
Implementing a cloud function that can update the `uniqueViewCount` field in the recording document given passed in parameters of `viewerId` and `recordingId` with the following requirements: 
- Needs to be able to handle significant amounts of views within a day (if recording goes viral)
- Only counts unique views (one view per user on a recording)
- Must update data in such a way that a same viewer opening a same recording on different devices would only increment the `uniqueViewCount` once

### Assumptions
- ViewerIds and RecordingIds are unique
- The `trackRecordingView` cloud function will be called by the client every time any user opens any recording in our mobile app

### Solution Design
- Implemented a transaction to ensure that if two requests for the same recording were made by the same viewer simultaneously there would not be double counting
- Queried the UniqueViews collection I added in `types.ts`
- Checked if the particular unique view exists and proceed not to change anything if it does
- If this unique view does not exist, update the recording's uniqueRecordingViewCount and creator of the recording's uniqueViewCount

- Bonus from `track-recording-views.ts` : For the purpose of readability and maintenance, I factored out the interfaces and enum from `track-recording-views.ts` and placed them all in `types.ts`.
- Bonus from `index.ts` : Validated that `viewerId` and `recordingId` are strings (not null or of another type) and are non-empty.

### Setting it up
- You will need to have Node.js and npm installed. If you do not, visit [Download Node.js](https://nodejs.org/en/download/) and install the latest version of npm with `npm install npm@latest -g`. Ensure that both are correctly installed using `node -v` and `npm -v`.
- Clone the repository with `git clone https://github.com/JuliaGrandury/Views-Tracking-Challenge-Siro`
- install the firebase CLI with `npm install -g firebase-tools`
- navigate to the functions directory and install dependencies with `cd functions && npm i`
- initiate and run the emulator at `npm run serve`

### Further development outside of the scope of the project
Could account for the fact that users might briefly open the recording but not view the majority of it and therefore should not be counted as viewers in the uniqueViewCount or uniqueRecordingViewCount.
