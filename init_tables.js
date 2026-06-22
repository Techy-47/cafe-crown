const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

async function initTables() {
  const serviceAccountPath = 'c:\\Users\\79856\\Desktop\\Code Base\\Money\\Cafe Crown\\.env.local';
  console.log("Not running, need env parsing for JS, but will just wait for manual creation if necessary.");
}
