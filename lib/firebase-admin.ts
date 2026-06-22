// Firebase Admin SDK — server-side only
// This file must NEVER be imported from client components

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App;

function initAdmin(): App {
  if (getApps().length > 0) return getApps()[0];

  // In production, use a service account JSON stored as an environment variable
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : {
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      };

  return initializeApp({
    credential: cert(serviceAccount),
    databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`,
  });
}

app = initAdmin();

export const db: Firestore = getFirestore(app);
export const auth: Auth    = getAuth(app);
