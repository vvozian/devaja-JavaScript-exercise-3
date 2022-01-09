const functions = require("firebase-functions");

const admin = require('firebase-admin');
admin.initializeApp();


const setCORS = (res) => { res.set('Access-Control-Allow-Origin', '*'); return res }

// Set emoji endpoint
exports.setEmoji = functions.https.onRequest(async (req, res) => {
  setCORS(res);

  const emojiId = req.query.id;
  const emojiName = req.query.name;

  await admin.firestore().collection('emoji').doc(emojiId).set({ name: emojiName });

  res.json({ code: "0", response: { id: emojiId, name: emojiName } });
});

// Get emoji endpoint
exports.getEmojiName = functions.https.onRequest(async (req, res) => {
  setCORS(res);

  const emojiId = req.query.id;

  const record = await admin.firestore().collection('emoji').doc(emojiId).get();
  let name = null;
  if (record.exists) {
    name = record.data().name;
  }

  res.json({ code: "0", response: { id: emojiId, name: name } });
});

// Get emoji list endpoint
exports.getEmojiList = functions.https.onRequest(async (req, res) => {
  setCORS(res);

  let collections = {};

  await admin.firestore().collection('emoji').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        collections[doc.id] = doc.data().name;
      });
    });

  res.json({ code: "0", response: collections });
});