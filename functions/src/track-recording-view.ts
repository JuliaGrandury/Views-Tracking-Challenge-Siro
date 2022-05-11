import * as functions from "firebase-functions";
import {db} from "./index";
import { Recording, User, Collections } from "./types";

export async function trackRecordingView(viewerId: string, recordingId: string): Promise<void> {
  // TODO: implement this function

  // logs can be viewed in the firebase emulator ui
  functions.logger.debug("viewerId: ", viewerId);
  functions.logger.debug("recordingId: ", recordingId);


  // ATTN: the rest of the code in this file is only here to show how firebase works

  // read from a document
  const documentSnapshot = await db.collection("collection").doc("doc").get();
  if (documentSnapshot.exists) {
    const data = documentSnapshot.data();
    functions.logger.debug("it did exist!", data);
  } else {
    functions.logger.debug("it didn't exist");
  }

  // overwrite a document based on the data you have when sending the write request
  // set overwrites all existing fields and creates new documents if necessary
  await db.collection("collection").doc("doc").set({id: "id", field: "foo"});
  // update will fail if the document exists and will only update fields included
  // in your update
  await db.collection("collection").doc("doc").update({id: "id", field: "bar"});

  // update based on data inside the document at the time of the write using a transaction
  // https://firebase.google.com/docs/firestore/manage-data/transactions#web-version-9

  await db.runTransaction(async (t): Promise<void> => {
    const ref = db.collection("collection").doc("doc");
    const docSnapshot = await t.get(ref);
    // do something with the data
    t.set(ref, {id: "id", field: "foobar"});
  });
}
