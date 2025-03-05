// // Signup.js
// import React from 'react';
// import { auth } from '../firebase'; // Import the initialized auth instance
// import firebase from 'firebase/compat/app';

// const Signup = () => {


//   const [user, setUser] = useState(null);




//   useEffect(() => {
//     // Get the currently logged-in user
//     const currentUser = auth.currentUser;
//     setUser(currentUser);
//   }, []);



//   // Function to handle Google Sign-In
//   const signInWithGoogle = async () => {




//     const provider = new firebase.auth.GoogleAuthProvider();
//     try {
//       // Use signInWithPopup to open the Google sign-in window
//       const result = await auth.signInWithPopup(provider);
//       // The signed-in user info is in result.user
//       console.log('User signed in: ', result);
//       console.log(result.user.uid)
//       // You can also redirect the user or update your state here
//     } catch (error) {
//       console.error('Error during Google sign-in', error);
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '2rem' }}>
//       <h2>Sign Up</h2>
//       <button onClick={signInWithGoogle}>
//         Sign Up with Google
//       </button>
//     </div>
//   );
// };

// export default Signup;







































// // pages/AccountsPage.js
// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { auth } from "../firebase";
// import { signOut,GoogleAuthProvider, signInWithCredential  } from "firebase/auth";

// import firebase from 'firebase/compat/app';

// export default function Signup({ navigation }) {


//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Get the currently logged-in user
//     const currentUser = auth.currentUser;
//     console.log(currentUser)
//     setUser(currentUser);
//   }, []);








  
//   const signInWithGoogle = async () => {



// console.log("logging in")
//     const provider = new firebase.auth.GoogleAuthProvider();
//     try {
//       // Use signInWithPopup to open the Google sign-in window


//       const credential = GoogleAuthProvider.credential(idToken, accessToken);
//      let result = await signInWithCredential(auth, credential);


//       // const result = await auth.signInWithPopup(provider);
//       console.log('User signed in: ', result);
//       console.log(result.user.uid)
//       navigation.navigate("MainTabs");
      
//       // You can also redirect the user or update your state here
//     } catch (error) {
//       alert("sorry unable to sugnup")
//       console.error('Error during Google sign-in', error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       // After logging out, navigate to the Login screen.
//       navigation.navigate("Login");
//     } catch (error) {
//       alert("Error signing out.");
//     }
//   };

//   if (!user) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>No user is logged in.</Text>
//         <TouchableOpacity
//           style={styles.button}
//           // onPress={() => navigation.navigate("Login")}
//         >
//           <Text onPress={signInWithGoogle} style={styles.buttonText}>login with google</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Account Details</Text>
//       <Text style={styles.text}>Email: {user.email}</Text>
//       <Text style={styles.text}>User ID: {user.uid}</Text>
//       {user.displayName && <Text style={styles.text}>Name: {user.displayName}</Text>}
//       <TouchableOpacity style={styles.button} onPress={handleLogout}>
//         <Text style={styles.buttonText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E2F1E7",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   heading: {
//     fontSize: 24,
//     marginBottom: 20,
//     color: "#387478",
//   },
//   text: {
//     fontSize: 18,
//     marginBottom: 10,
//     color: "#387478",
//   },
//   button: {
//     backgroundColor: "#387478",
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//     width: "80%",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//   },
// });



















































// // SignIn.js
// import React, { useEffect } from 'react';
// import { Button, View, Text } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import { initializeApp } from 'firebase/app';
// import { 
//   getAuth, 
//   signInWithCredential, 
//   GoogleAuthProvider 
// } from 'firebase/auth';
// import { auth } from '../firebase';




// // Your Firebase configuration (safe to be public)
// // const firebaseConfig = {
// //   apiKey: "YOUR_API_KEY",
// //   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
// //   projectId: "YOUR_PROJECT_ID",
// //   // ...other configuration keys
// // };

// // // Initialize Firebase if not already initialized
// // const app = initializeApp(firebaseConfig);
// // const auth = getAuth(app);

// // Complete any pending auth sessions
// WebBrowser.maybeCompleteAuthSession();

// export default function SignIn() {
//   // Set up the Google auth request with your client IDs
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId: 'YOUR_EXPO_CLIENT_ID',
//     iosClientId: 'YOUR_IOS_CLIENT_ID',
//     androidClientId: 'YOUR_ANDROID_CLIENT_ID',
//     webClientId: 'YOUR_WEB_CLIENT_ID',
//   });

//   useEffect(() => {
//     if (response?.type === 'success') {
//       // Extract the tokens from the response
//       const { id_token, access_token } = response.authentication;
      
//       // Create a Firebase credential with the tokens
//       const credential = GoogleAuthProvider.credential(id_token, access_token);
      
//       // Sign in with Firebase using the credential
//       signInWithCredential(auth, credential)
//         .then((userCredential) => {
//           // Successful sign in; userCredential.user contains user info
//           console.log('User signed in:', userCredential.user);
//           // You can navigate to your app’s main screen here
//         })
//         .catch((error) => {
//           console.error('Firebase sign in error:', error);
//         });
//     }
//   }, [response]);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ marginBottom: 20, fontSize: 18 }}>Sign in with Google</Text>
//       <Button
//         disabled={!request}
//         title="Sign In with Google"
//         onPress={() => promptAsync()}
//       />
//     </View>
//   );
// }


















// import { useEffect, useState } from "react";
// import { StyleSheet, Text, View, Button, Image } from "react-native";
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// WebBrowser.maybeCompleteAuthSession();

// export default function App() {
//   const [token, setToken] = useState("");
//   const [userInfo, setUserInfo] = useState(null);

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId: "775725503280-j9qek6lbckhpcp95ol1o9ncmf52q73dc.apps.googleusercontent.com",
//     // iosClientId: "",
//     webClientId: "775725503280-2rh9fqhvkl3odc7iveu14mu3s90sf4r7.apps.googleusercontent.com",
//   });

//   useEffect(() => {
//     handleEffect();
//   }, [response, token]);



















//   const signupWithMobile = async (userinfo) => {
//     const apiUrl = "https://helloworld-ftfo4ql2pa-el.a.run.app/signupWithMobile";
//     try {



//       let uid = userinfo.id
//       let name=userinfo.name
//       let email = userinfo.email
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           orderId: { 
//             uid : uid, 
//             name : name, 
//             email : email,
//             mobileNumber:"1234567890"
//           } 
//         })
//       });
//       const data = await response.json();
//       console.log("Signup response:", data);
//       setResponseMsg(JSON.stringify(data));
//     } catch (error) {
//       console.error("Error during signup:", error);
//       setResponseMsg("Error during signup");
//     }
//   };























//   async function handleEffect() {
//     const user = await getLocalUser();
//     console.log("user", user);
//     if (!user) {
//       if (response?.type === "success") {
//         // setToken(response.authentication.accessToken);

//         // console.log(response)
//         getUserInfo(response.authentication.accessToken);




//       }
//     } else {
//       setUserInfo(user);
//       console.log("loaded locally");
//     }
//   }

//   const getLocalUser = async () => {
//     const data = await AsyncStorage.getItem("@user");
//     if (!data) return null;
//     return JSON.parse(data);
//   };

//   const getUserInfo = async (token) => {
//     if (!token) return;
//     try {
//       const response = await fetch(
//         "https://www.googleapis.com/userinfo/v2/me",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const user = await response.json();
//       console.log(user)
//       signupWithMobile(user)




//       await AsyncStorage.setItem("@user", JSON.stringify(user));

//       setUserInfo(user);

      
//     } catch (error) {
//       // Add your own error handler here
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {!userInfo ? (
//         <Button
//           title="Sign in with Google"
//           disabled={!request}
//           onPress={() => {
//             promptAsync();
//           }}
//         />
//       ) : (
//         <View style={styles.card}>
//           {userInfo?.picture && (
//             <Image source={{ uri: userInfo?.picture }} style={styles.image} />
//           )}
//           <Text style={styles.text}>Email: {userInfo.email}</Text>
//           <Text style={styles.text}>
//             Verified: {userInfo.verified_email ? "yes" : "no"}
//           </Text>
//           <Text style={styles.text}>Name: {userInfo.name}</Text>
//           {/* <Text style={styles.text}>{JSON.stringify(userInfo, null, 2)}</Text> */}
//         </View>
//       )}
//       <Button
//         title="remove local store"
//         onPress={async () => {
//           await AsyncStorage.removeItem("@user")
      
//           navigation.navigate("MainTabs");  
//         }
//       }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   card: {
//     borderWidth: 1,
//     borderRadius: 15,
//     padding: 15,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
// });
























// // pages/SignUpPage.js
// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";

// import AsyncStorage from "@react-native-async-storage/async-storage";

// WebBrowser.maybeCompleteAuthSession();

// export default function SignUpPage({ navigation }) {
//   const [token, setToken] = useState("");
//   const [userInfo, setUserInfo] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [responseMsg, setResponseMsg] = useState("");

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId:
//       "775725503280-j9qek6lbckhpcp95ol1o9ncmf52q73dc.apps.googleusercontent.com",
//     webClientId:
//       "775725503280-2rh9fqhvkl3odc7iveu14mu3s90sf4r7.apps.googleusercontent.com",
//   });

//   useEffect(() => {
//     handleEffect();
//   }, [response, token]);

//   async function handleEffect() {
//     const user = await getLocalUser();
//     if (!user) {
//       if (response?.type === "success") {
//         getUserInfo(response.authentication.accessToken);
//       }
//     } else {
//       setUserInfo(user);
//     }
//   }

//   const getLocalUser = async () => {
//     const data = await AsyncStorage.getItem("@user");
//     if (!data) return null;
//     return JSON.parse(data);
//   };

//   const getUserInfo = async (token) => {
//     if (!token) return;
//     try {
//       setLoading(true);
//       const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const user = await response.json();
//       // Call your API to sign up the user with mobile details
//       signupWithMobile(user);
//       await AsyncStorage.setItem("@user", JSON.stringify(user));
//       setUserInfo(user);



//       navigation.navigate("MainTabs");
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signupWithMobile = async (userinfo) => {
//     const apiUrl =
//       "https://helloworld-ftfo4ql2pa-el.a.run.app/signupWithMobile";
//     try {
//       const uid = userinfo.id;
//       const name = userinfo.name;
//       const email = userinfo.email;
//       const res = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           orderId: {
//             uid: uid,
//             name: name,
//             email: email,
//             mobileNumber: "1234567890",
//           },
//         }),
//       });
//       const data = await res.json();
//       console.log("Signup response:", data);
//       setResponseMsg(JSON.stringify(data));
//     } catch (error) {
//       console.error("Error during signup:", error);
//       setResponseMsg("Error during signup");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {!userInfo ? (
//         <>
//           <Text style={styles.heading}>Sign in with Google</Text>
//           {loading ? (
//             <ActivityIndicator size="large" color="#387478" />
//           ) : (
//             <TouchableOpacity
//               style={styles.button}
//               onPress={() => promptAsync()}
//               disabled={!request}
//             >
//               <Text style={styles.buttonText}>Sign in with Google</Text>
//             </TouchableOpacity>
//           )}
//         </>
//       ) : (
//         <View style={styles.card}>
//           {userInfo?.picture && (
//             <Image source={{ uri: userInfo?.picture }} style={styles.image} />
//           )}
//           <Text style={styles.text}>Email: {userInfo.email}</Text>
//           <Text style={styles.text}>
//             Verified: {userInfo.verified_email ? "Yes" : "No"}
//           </Text>
//           <Text style={styles.text}>Name: {userInfo.name}</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E2F1E7",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#387478",
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#387478",
//     paddingVertical: 15,
//     paddingHorizontal: 25,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: "#E2F1E7",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 20,
//     alignItems: "center",
//     elevation: 3,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 15,
//   },
//   text: {
//     fontSize: 18,
//     color: "#387478",
//     marginBottom: 5,
//   },
// });
























































import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
// import auth from "@react-native-firebase/auth";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";


// GoogleSignin.configure({
//   webClientId:"317063348459-mqt0tt10giu9mlftrptdvkhs8ohlupds.apps.googleusercontent.com",
//   scopes: ["profile", "email"]
// });





  // const signupWithMobile = async (userinfo) => {
  //   const apiUrl = "https://helloworld-ftfo4ql2pa-el.a.run.app/signupWithMobile";
  //   try {



  //     let uid = userinfo.id
  //     let name=userinfo.name
  //     let email = userinfo.email
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ 
  //         orderId: { 
  //           uid : uid, 
  //           name : name, 
  //           email : email,
  //           mobileNumber:"1234567890"
  //         } 
  //       })
  //     });
  //     const data = await response.json();
  //     console.log("Signup response:", data);
  //     setResponseMsg(JSON.stringify(data));
  //   } catch (error) {
  //     console.error("Error during signup:", error);
  //     setResponseMsg("Error during signup");
  //   }
  // };





const Signup = () => {
  // State for login status and form type
  // const [loggedIn, setLoggedIn] = useState(false);
  // const [isSignUp, setIsSignUp] = useState(false); // true for signup, false for signin
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState();

  // // Handles sign-in/sign-up form submission
  // const handleFormSubmit = () => {
  //   if (isSignUp) {
  //     auth()
  //       .createUserWithEmailAndPassword(email, password)
  //       .then((val) => console.log(val))
  //       .catch((err) => console.log(err));

  //     console.log("Signing Up with:", { email, password });
  //   } else {
  //     auth()
  //       .signInWithEmailAndPassword(email, password)
  //       .then((val) => console.log(val))
  //       .catch((err) => console.log(err));
  //     console.log("Signing In with:", { email, password });
  //   }
  //   // Simulate login
  //   setLoggedIn(true);
  // };

  // function onAuthStateChanged(user) {
  //   setUser(user);
  //   if (user) setLoggedIn(true);
  //   else setLoggedIn(false);
  //   if (initializing) setInitializing(false);
  // }

  // async function onGoogleButtonPress() {
  //   // Check if your device supports Google Play
  //   await GoogleSignin.signOut();
  //   await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  //   // Get the users ID token
  //   const googleSignInResult = await GoogleSignin.signIn();

  //   // Create a Google credential with the token
  //   const googleCredential = auth.GoogleAuthProvider.credential(
  //     googleSignInResult.data?.idToken
  //   );

  //   // Sign-in the user with the credential
  //   return await auth().signInWithCredential(googleCredential);
  // }

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  // // Handles sign-out
  // const handleSignOut = () => {
  //   auth()
  //     .signOut()
  //     .then(() => console.log("User signed out!"));
  //   setLoggedIn(false);
  //   setEmail("");
  //   setPassword("");
  // };

  // // console.log("User:", user);

  // if (loggedIn) {
  //   return (
  //     <View style={styles.center}>
  //       <Button title="Sign Out" onPress={handleSignOut} />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>sign up</Text>
{/* 
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <Button
        title={isSignUp ? "Sign Up" : "Sign In"}
        onPress={handleFormSubmit}
      />

      <Button
        title={
          isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"
        }
        onPress={() => setIsSignUp(!isSignUp)}
      />
      <Button
        title="Sign In with Google"
        color="#4285F4"
        onPress={() =>
          onGoogleButtonPress().then((val) =>{
            console.log(val, "Signed in with Google!")


            
            let userdetails = {
              "id" :val.user._auth._user.uid,
              "name":val.user._auth._user.displayName,
              "email":val.user._auth._user.email


            }
            console.log(userdetails)
            signupWithMobile(userdetails)

          }


          )
        }
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Signup;