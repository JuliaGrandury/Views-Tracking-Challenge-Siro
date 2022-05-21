//import * as functions from "firebase-functions";
import { db } from "./index";
import * as admin from "firebase-admin";
import { Recording } from "./types";

/* BONUS OPPORTUNITY
It's not great (it's bad) to throw all of this code in one file.
Can you help us organize this code better? (DONE)
*/

export async function trackRecordingView(viewerId: string, recordingId: string): Promise<void> {
  // TODO: implement this function (DOING)
  // logs can be viewed in the firebase emulator ui
  // functions.logger.debug("viewerId: ", viewerId);
  // functions.logger.debug("recordingId: ", recordingId);

  //Snapshot reference to the possibly existing Unique View Document
  const uniqueViewRef = db.collection("UniqueViews").where("viewerId", "==", viewerId).where("recordingId", "==", recordingId);
  const increment = admin.firestore.FieldValue.increment(1);

  try{
    await db.runTransaction(async (t): Promise<void> => {

      //Querying UniqueViews collection for current user/recording match
      //If the UniqueView already exists do nothing
      const uniqueViewSnap = await t.get(uniqueViewRef);
      if (!uniqueViewSnap.empty) return;
  
      //If it doesn't 
      //Add a doc to UniqueViews to ensure no double counting
      t.set(db.collection("UniqueViews").doc(), { viewerId, recordingId });
  
      //Update respective Recording doc
      const recordingRef = db.collection("Recordings").doc(recordingId);
      const recordingDoc = await recordingRef.get();
      if (!recordingDoc.exists) return;
      t.update(recordingRef, { uniqueViewCount: increment, });

      //Update respective User doc (typed with as)
      const { creatorId } = recordingDoc.data() as Recording;
      const creatorRef = db.collection("Users").doc(creatorId);
      t.update(creatorRef, { uniqueRecordingViewCount: increment, });
    })
  } catch (e) {
    console.log(e)
  }
}


