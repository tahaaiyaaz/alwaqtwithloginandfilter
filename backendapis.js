// const functions = require("firebase-functions");
// const admin = require('firebase-admin');
// const express = require('express');
// const cors = require('cors');
// const geofire = require('geofire-common');

// // Initialize admin
// admin.initializeApp();

// // Initialize express
// const app = express();

// // Enable CORS
// app.use(cors({ origin: true }));

// // Use admin.firestore() instead of getFirestore
// const db = admin.firestore();

const functions = require("firebase-functions");

const ba = require("firebase/firestore"); // Firestore SDK
const bc = require("firebase/auth");
const {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
} = require("firebase/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const initializeApp = require("firebase/app");
const geofire = require("geofire-common"); // Geohashing library

// const cors = require('cors')({origin: true});

const cors = require("cors")({ origin: true });
const firebaseConfig = {
  apiKey: "AIzaSyBWVgsCD9hq0rm_GQLCmkkFicu_xyhEnNY",
  authDomain: "froarit-masjid.firebaseapp.com",
  projectId: "froarit-masjid",
  storageBucket: "froarit-masjid.firebasestorage.app",
  messagingSenderId: "317063348459",
  appId: "1:317063348459:web:156b424e584e42800afeae",
  // measurementId: "G-GDPVSJHNVM"
};

const app = initializeApp.initializeApp(firebaseConfig);
const db = ba.getFirestore(app);
const express = require("express");

const app2 = express();

exports.helloWorld = functions.https.onRequest(
  {
    region: "asia-south1",
    memory: "1GiB", // or "2GiB", "4GiB"
    cpu: 1, // or 2, 4 for more intensive tasks
    concurrency: 300, // controls the max number of concurrent executions
    timeoutSeconds: 60, // increase timeout if needed
  },
  app2
);

app2.use((req, res, next) => {
  console.log("step 1 ");

  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "PUT,GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  // res.set('Access-Control-Max-Age', '3600');

  // Handle preflight requests (OPTIONS)
  // if (req.method === 'OPTIONS') {
  //     res.status(204).send('');
  //     return;
  // }
  console.log("going to next");
  next();
});

// Wrap your endpoint with cors handling

app2.get("/getNearestMasjid", async (req, res) => {
  try {
    console.log("step 1 ");
    let { latitude, longitude, radiusInKm = 50 } = req.query;

    console.log("starting ", latitude, longitude, radiusInKm);
    if (!latitude || !longitude) {
      return res.status(400).send({ message: "Missing latitude or longitude" });
    }
    try {
      latitude = parseFloat(latitude);
      longitude = parseFloat(longitude);
    } catch (error) {
      console.error("Error parsing latitude or longitude:", error);
      return res
        .status(400)
        .send({ message: "Invalid latitude or longitude format" });
    }

    let center = [latitude, longitude];
    let bounds = geofire.geohashQueryBounds(center, radiusInKm);
    let queries = bounds.map(([start, end]) =>
      query(
        ba.collection(db, "allmasjids"),
        ba.where("geohash", ">=", start),
        ba.where("geohash", "<=", end)
      )
    );

    let promises = queries.map((q) => ba.getDocs(q));
    let snapshots = await Promise.all(promises);
    let matchingMasjids = [];

    snapshots.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        let masjid = doc.data();
        let distanceInMeters =
          geofire.distanceBetween(center, [
            masjid.location.latitude,
            masjid.location.longitude,
          ]) * 1000;
        if (distanceInMeters <= radiusInKm * 1000) {
          matchingMasjids.push({ id: doc.id, ...masjid });
        }
      });
    });

    console.log("complete");
    res
      .status(200)
      .send({
        message: "Nearby masjids fetched successfully",
        masjids: matchingMasjids,
      });
  } catch (error) {
    console.error("Error getting nearest masjid:", error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});

app2.post("/addmasjid", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.set("Access-Control-Allow-Methods", "GET, POST"); // Allow specific HTTP methods
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow headers like Content-Type

  try {
    console.log("trying to add new masajid");
    const { latitude, longitude, countryName, cityName, stateName, details } =
      req.body;

    if (
      !latitude ||
      !longitude ||
      !countryName ||
      !cityName ||
      !stateName ||
      !details
    ) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    let geohash = geofire.geohashForLocation([latitude, longitude]);

    let masjidData = {
      location: new ba.GeoPoint(latitude, longitude),
      geohash,
      countryName,
      cityID: cityName,
      stateId: stateName,
      details,
    };
    console.log("masjidData", masjidData);

    let docRef = await ba.addDoc(ba.collection(db, "allmasjids"), masjidData);

    res
      .status(201)
      .send({ message: "Masjid added successfully", masjidId: docRef.id });
  } catch (error) {
    console.error("Error adding masjid:", error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});
app2.put("/updateMasjid", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const { masjidId, updates } = req.body;

    console.log(res.body);
    if (!masjidId || !updates) {
      return res
        .status(400)
        .send({ message: "Missing or invalid masjidId or updates" });
    }
    // console.log(masjidId,updates)
    // Reference to the specific masjid document
    //         const masjidRef = ba.doc(ba.collection(db, "allmasjids"), masjidId);

    //         // Check if the document exists
    //         let masjidDoc = await ba.getDoc(masjidRef);
    //         if (!masjidDoc.exists()) {
    //             return res.status(404).send({ message: "Masjid not found" });
    //         }
    //         let dataofmasjid = masjidDoc.data()
    // console.log(dataofmasjid.detils)
    //         // Update the document with new details

    //         let ids = {
    //             "details":updates
    //         }
    //         // dataofmasjid.detils = updates
    //         await ba.updateDoc(masjidRef, {details:updates});

    let ids = {
      details: updates,
    };
    const flattenObject = (obj, parent = "", res = {}) => {
      for (let key in obj) {
        console.log(parent, obj);
        const propName = parent ? `${parent}.${key}` : key;
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          flattenObject(obj[key], propName, res);
        } else {
          res[propName] = obj[key];
        }
      }
      return res;
    };

    const flattenedUpdates = flattenObject(ids);

    // Reference to the masjid document
    const masjidRef = ba.doc(db, "allmasjids", masjidId);

    console.log(flattenedUpdates);

    // Perform a partial update to merge only the present fields
    await ba.updateDoc(masjidRef, flattenedUpdates);

    res.status(200).send({ message: "Masjid details updated successfully" });
  } catch (error) {
    console.error("Error updating masjid:", error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});

app2.get("/searchMasjidByName", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // try {

  //     console.log("step 1 ")
  //     let { masjidname } = req.query;

  //     console.log("starting 1", masjidname);
  //     if (!masjidname) {
  //         return res.status(400).send({ message: "Missing latitude or longitude" });
  //     }

  //     const masjidQuery = query(
  //         ba.collection(db, "allmasjids"),
  //         ba.where("details.masjid_name", "==", masjidname)
  //       );
  //       const querySnapshot = await getDocs(masjidQuery);

  //       if (querySnapshot.empty) {
  //         return res.status(404).send({ message: "No masjid found with the given name" });
  //       }

  //       // Extract the masjid data
  //       const masjids = [];
  //       querySnapshot.forEach((doc) => {
  //         masjids.push({ id: doc.id, ...doc.data() });
  //       });
  // conaole.log(masjids)
  //       // Return the masjid details
  //       return res.status(200).send({ message: "Masjid fetched successfully", masjids });

  // } catch (error) {
  //     console.error("Error getting nearest masjid:", error);
  //     res.status(500).send({ message: "Internal server error", error: error.message });
  // }

  const masjidName = req.query.name; // Retrieve masjid name from query params
  if (!masjidName) {
    return res.status(400).send({ message: "Masjid name is required" });
  }

  console.log(masjidName);
  try {
    const masjidQuery = query(
      ba.collection(db, "allmasjids"),
      ba.orderBy("masjid_name"),
      ba.startAt("\uf8ff"),
      ba.endAt(masjidName + "\uf8ff")
    );
    const querySnapshot = await getDocs(masjidQuery);

    // Perform a query to find masjids with a name containing the input
    // const masjidQuery = ba.query(
    //     collection(db, "allmasjids"),
    //     orderBy("masjid_name"),
    //     startAt(masjidName),
    //     endAt(masjidName + "\uf8ff") // Ensures partial match
    // );

    // const querySnapshot = await ba.getDocs(masjidQuery);
    const results = [];

    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    console.log(results);

    return res.status(200).send({ masjids: results });
  } catch (error) {
    console.error("Error searching for masjid:", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});

// code for sign up

app2.post("/login", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    console.log(req.body);

    let auth = bc.getAuth();

    const userCredential = await bc.signInWithEmailAndPassword(
      auth,
      req.body.email,
      req.body.password
    );
    const user = userCredential.user;

    let uidtogetdataforlogin = user.uid;

    const docRef = ba.doc(db, "userdetails", uidtogetdataforlogin);
    const detailsofuser = await ba.getDoc(docRef);

    // const cityRef = await ba.getDocs(ba.collection(db,'scheduledTasks'))

    // const cityRef = db.collection('rechargeapp').doc(uidtogetdataforlogin);
    // const detailsofuser = await cityRef.get();
    console.log(detailsofuser.data());

    res.status(200).send(JSON.stringify(detailsofuser.data()));
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "Invalid Credentials" });
  }
});

app2.post("/signup", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    console.log(req.body);
    let auth = bc.getAuth();

    const userCredential = await bc.createUserWithEmailAndPassword(
      auth,
      req.body.email,
      req.body.password
    );
    //   const userCredential = await createUserWithEmailAndPassword(auth, );
    const user = userCredential.user;

    // Store the username and email in Firestore
    // await this.db.collection('users').doc(username).set({ email });

    //   await setDoc(doc(this.db, "users", req.body.mobileNumber), {

    //     email: this.email,
    //   });

    const userdetailsref = ba.collection(db, "userdetails");

    await ba.setDoc(ba.doc(userdetailsref, user.uid), {
      name: req.body.orderId.name,
      mobileNumber: req.body.orderId.mobileNumber,
      userid: user.uid,
    });

    res.status(200).send({ uid: user.uid });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "Invalid Credentials" });
  }
});

app2.get("/getStates", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const statesQuery = query(collection(db, "states"));
    const querySnapshot = await getDocs(statesQuery);
    console.log("get all states");
    const states = [];
    querySnapshot.forEach((doc) => {
      states.push({ id: doc.id, ...doc.data() });
    });
    console.log(states);
    res.status(200).send({ states });
  } catch (error) {
    console.error("Error fetching states:", error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});

app2.get("/getCities", async (req, res) => {
  console.log("here to get cities");
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  const { stateID } = req.query;
  console.log(stateID);
  if (!stateID) {
    return res.status(400).send({ message: "State ID is required" });
  }
  try {
    const citiesQuery = query(
      collection(db, "city"),
      where("stateId", "==", stateID)
    );
    const querySnapshot = await getDocs(citiesQuery);
    const cities = [];
    querySnapshot.forEach((doc) => {
      cities.push({ id: doc.id, ...doc.data() });
    });
    console.log(cities);
    res.status(200).send({ cities });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});

app2.get("/getMasjids", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  const { cityID } = req.query;
  console.log(cityID);
  if (!cityID) {
    return res.status(400).send({ message: "City ID is required" });
  }

  try {
    const masjidsQuery = query(
      collection(db, "allmasjids"),
      where("cityID", "==", cityID)
    );
    const querySnapshot = await getDocs(masjidsQuery);
    const masjids = [];
    querySnapshot.forEach((doc) => {
      masjids.push({ id: doc.id, ...doc.data() });
    });
    console.log(masjids);
    res.status(200).send({ masjids });
  } catch (error) {
    console.error("Error fetching masjids:", error);
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

// Firebase Function to fetch favorite masjids based on a list of IDs
app2.post("/getFavoriteMasjids", async (req, res) => {
  // Ensure CORS headers are set

  try {
    // Expecting an array of masjid IDs in the request body
    const { userId } = req.body;

    console.log(userId);
    const userdetailsRef = ba.collection(db, "userdetails");
    const userDocRef = ba.doc(userdetailsRef, userId);

    // Check if the user document already exists
    const userDocSnap = await ba.getDoc(userDocRef);
    let favoriteIds = [];

    if (userDocSnap.exists()) {
      // If the user exists, return the UID without creating a new document
      console.log("User already exists:", userDocSnap.data());
      const user = userDocSnap.data();
      favoriteIds = user.favorites;
    } else {
      console.log("there is no user");

      return res.status(404).send({ message: "User does not exist" });
    }

    if (
      !favoriteIds ||
      !Array.isArray(favoriteIds) ||
      favoriteIds.length === 0
    ) {
      return res
        .status(400)
        .send({ message: "favoriteIds must be a non-empty array." });
    }
    console.log(favoriteIds);
    // Split the favoriteIds array into chunks of 10 (max allowed for an "in" query)
    const chunks = chunkArray(favoriteIds, 10);
    const masjidResults = [];

    // For each chunk, run an "in" query on the document IDs
    const promises = chunks.map(async (chunk) => {
      const q = query(
        collection(db, "allmasjids"),
        where(ba.documentId(), "in", chunk)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        masjidResults.push({ id: doc.id, ...doc.data() });
      });
    });

    // Wait for all queries to complete
    await Promise.all(promises);

    // Return the results
    return res.status(200).send({ masjids: masjidResults });
  } catch (error) {
    console.error("Error fetching favorite masjids:", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});

app2.post("/signupwithmobile", async (req, res) => {
  try {
    console.log("Request body:", req.body);

    // Extract details from the request
    const { orderId } = req.body;
    if (!orderId || !orderId.uid || !orderId.name) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const uid = orderId.uid;

    // Reference to the "userdetails" collection
    const userdetailsRef = ba.collection(db, "userdetails");
    const userDocRef = ba.doc(userdetailsRef, uid);

    // Check if the user document already exists
    const userDocSnap = await ba.getDoc(userDocRef);

    if (userDocSnap.exists()) {
      let userdata = userDocSnap.data();
      // If the user exists, return the UID without creating a new document
      console.log("User already exists:", userDocSnap.data());
      return res.status(200).send({ message: "User already exists", userdata });
    } else {
      // If the user does not exist, create a new document with additional fields
      await ba.setDoc(userDocRef, {
        name: orderId.name,
        // mobileNumber: orderId.mobileNumber,
        email: orderId.email,
        userid: uid,
        // role: "user",          // Default role value; modify as needed
        // favorites: [],         // Default to an empty array
        // yourMasjid: []         // Default to an empty array
      });
      console.log("New user created with UID:", uid);
      return res
        .status(200)
        .send({ message: "User created successfully", uid });
    }
  } catch (e) {
    console.error("Error during signup:", e);
    return res
      .status(400)
      .send({ message: "Invalid Credentials", error: e.message });
  }
});

// app2.post('/addFavorite ', async (req, res) => {

//   try {
//     const { uid, masjidId } = req.body;
//     if (!uid || !masjidId) {
//       return res.status(400).json({ message: "uid and masjidId are required" });
//     }

//     const userdetailsRef = ba.collection(db, "userdetails");
//     const userDocRef = ba.doc(userdetailsRef, uid);

//     // Check if the user document already exists
//     const userDocSnap = await ba.getDoc(userDocRef);

//     if (!userDocSnap.exists()) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update the document by adding the masjidId to the favorites array (using arrayUnion)
//     await userDocRef.update({
//       favorites: admin.firestore.FieldValue.arrayUnion(masjidId)
//     });

//     console.log(`Masjid ${masjidId} added to favorites for user ${uid}`);
//     return res.status(200).json({ message: "Masjid added to favorites successfully" });
//   } catch (error) {
//     console.error("Error adding favorite:", error);
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// });

app2.put("/updateUser", async (req, res) => {
  try {
    const { userId, updates } = req.body;

    if (!userId || !updates) {
      return res
        .status(400)
        .send({ message: "Missing or invalid userId or updates" });
    }

    const userdetailsRef = ba.collection(db, "userdetails");
    const userDocRef = ba.doc(userdetailsRef, userId);

    // Check if the user document already exists
    // const userDocSnap = await ba.getDoc(userDocRef);

    //   const userRef = ba.collection("userdetails").doc(userId);

    // Build the update object. For known array fields, use arrayUnion.
    // For example, assume 'favorites' and 'yourMasjid' are array fields.
    let updateObj = { ...updates };

    if (updates.favorites && Array.isArray(updates.favorites)) {
      updateObj.favorites = ba.arrayUnion(...updates.favorites);
    }
    if (updates.yourMasjid && Array.isArray(updates.yourMasjid)) {
      updateObj.yourMasjid = ba.arrayUnion(...updates.yourMasjid);
    }

    // Other fields will be merged normally (overwritten if provided)
    //   await userDocRef.update(updateObj);
    ba.updateDoc(userDocRef, updateObj);

    return res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});

// Export the express app as a Firebase function
