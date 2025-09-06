import { cert, initializeApp } from "firebase-admin/app";
import { BulkWriter, getFirestore } from "firebase-admin/firestore";
import { initialize } from "fireorm";

const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS!, 'base64').toString("utf-8"));


initializeApp({
    credential: cert(credentials),
    databaseURL: `https://${credentials.project_id}.firebaseio.com`,
});

const db = getFirestore();

db.settings({ ignoreUndefinedProperties: true });

initialize(db, {
    validateModels: true,
});