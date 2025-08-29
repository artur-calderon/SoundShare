import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { initialize } from "fireorm";

const credencials = require("../credentials.json");

initializeApp({
    credential: cert(credencials),
    databaseURL: `https://${credencials.project_id}.firebaseio.com`,
});

const db = getFirestore();

db.settings({ ignoreUndefinedProperties: true });

initialize(db, {
    validateModels: true,
});