// pages/AccountsPage.js


// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet } from "react-native";
// import auth, { firebase } from "@react-native-firebase/auth";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";


// GoogleSignin.configure({
//   webClientId:"317063348459-mqt0tt10giu9mlftrptdvkhs8ohlupds.apps.googleusercontent.com",
//   scopes: ["profile", "email"]
// }); 

// const AccountsPage = () => {
//   // State for login status and form type
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false); // true for signup, false for signin
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState();

//   // Handles sign-in/sign-up form submission
//   const handleFormSubmit = () => {
//     if (isSignUp) {
//       auth()
//         .createUserWithEmailAndPassword(email, password)
//         .then((val) => console.log(val))
//         .catch((err) => console.log(err));

//       console.log("Signing Up with:", { email, password });
//     } else {
//       auth()
//         .signInWithEmailAndPassword(email, password)
//         .then((val) => console.log(val))
//         .catch((err) => console.log(err));
//       console.log("Signing In with:", { email, password });
//     }
//     // Simulate login
//     setLoggedIn(true);
//   };

//   function onAuthStateChanged(user) {
//     setUser(user);
//     if (user) setLoggedIn(true);
//     else setLoggedIn(false);
//     if (initializing) setInitializing(false);
//   }

//   async function onGoogleButtonPress() {
//     // Check if your device supports Google Play
//     await GoogleSignin.signOut();
//     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//     // Get the users ID token
//     const googleSignInResult = await GoogleSignin.signIn();

//     // Create a Google credential with the token
//     const googleCredential = auth.GoogleAuthProvider.credential(
//       googleSignInResult.data?.idToken
//     );

//     // Sign-in the user with the credential
//     return await auth().signInWithCredential(googleCredential);
//   }

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   // Handles sign-out
//   const handleSignOut = () => {
//     auth()
//       .signOut()
//       .then(() => console.log("User signed out!"));
//     setLoggedIn(false);
//     setEmail("");
//     setPassword("");
//   };

//   // console.log("User:", user);

//   if (loggedIn) {
//     return (
//       <View style={styles.center}>
//         <Button title="Sign Out" onPress={handleSignOut} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Button
//         title="Sign In with Google"
//         color="#4285F4"
//         onPress={() =>
//           onGoogleButtonPress().then((val) =>{
//             // console.log(val, "Signed in with Google!")
//             let userdetails = {
//               "id" :val.user._auth._user.uid,
//               "name":val.user._auth._user.displayName,
//               "email":val.user._auth._user.email


//             }
//             console.log(userdetails)
//             // console.log(val.user._auth._user.uid)
//           }
//           )
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
// });

// export default AccountsPage;










// pages/AccountsPage.js final but what i am doing now is just for testing

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet,Button ,TextInput ,Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import auth, { firebase } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import RNPickerSelect from 'react-native-picker-select';


// import {Picker} from '@react-native-picker/picker';
import { Picker } from "@react-native-picker/picker";
import { updateUserDetails } from "./userupdate";

GoogleSignin.configure({
  webClientId:"317063348459-mqt0tt10giu9mlftrptdvkhs8ohlupds.apps.googleusercontent.com",
  scopes: ["profile", "email"]
}); 

export default function AccountsPage({ navigation }) {

  const [loggedIn, setLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // true for signup, false for signin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [userType, setUserType] = useState(""); // "Muazzin" or "Not Muazzin"
  const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState();

  const [user, setUser] = useState(null);




  const handleUpdateDetails = async () => {
    const updatedUser = { ...user, mobileNumber, userType };
    try {
      await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      const userId = updatedUser.id;
      const updates = { 'mobileNumber': mobileNumber, 'userType': userType };
  
      try {
        const result = await updateUserDetails(userId, updates);
        if (result) {
          Alert.alert("Success", "User details updated!");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to update user details.");
      }

      alert("Details updated successfully!");
    } catch (error) {
      console.error("Error updating user details", error);
      alert("Error updating details.");
    }
  };











  
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

  function onAuthStateChanged(user) {
    setUser(user);
    if (user) setLoggedIn(true);
    else setLoggedIn(false);
    if (initializing) setInitializing(false);
  }

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.signOut();
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const googleSignInResult = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      googleSignInResult.data?.idToken
    );

    // Sign-in the user with the credential
    return await auth().signInWithCredential(googleCredential);
  }






  const signupWithMobile = async (userinfo) => {
    const apiUrl =
      "https://helloworld-ftfo4ql2pa-el.a.run.app/signupWithMobile";
    try {
      const uid = userinfo.id;
      const name = userinfo.name;
      const email = userinfo.email;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: {
            uid: uid,
            name: name,
            email: email,
          },
        }),
      });
      const data = await res.json();
      console.log("Signup response:", data.userdata);
      setUser( data.uid);
      await AsyncStorage.setItem("@user", JSON.stringify( data.userdata))
      
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };












  useEffect(() => {
    // Retrieve the user data from AsyncStorage
    const getUserFromStorage = async () => {
      try {
        const userData = await AsyncStorage.getItem("@user");
        console.log(userData)
        if (userData) {
          setUser(JSON.parse(userData));
          console.log(userData)
        }
        else{
          console.log("there is no useer")
          
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
        }
      } catch (error) {
        console.error("Error retrieving user from storage", error);
      }
    };

    getUserFromStorage();

  }, [])




  

  // Handles sign-out
  const handleSignOut = async () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setUser(null);
    await AsyncStorage.removeItem("@user")
    
          navigation.navigate("Welcome Page");  



  };

  // console.log("User:", user);

  // if (loggedIn) {
  //   return (
  //     <View style={styles.center}>
  //       <Button title="Sign Out" onPress={handleSignOut} />
  //     </View>
  //   );
  // }




  const handleLogout = async () => {
    try {
      // Remove the user data from AsyncStorage
      await AsyncStorage.removeItem("@user");
      setUser(null);
      navigation.navigate("MainTabs");
    } catch (error) {
      alert("Error signing out.");
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No user is logged in.</Text>
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity> */}



    <Button
        title="Sign In with Google"
        color="#4285F4"
        onPress={() =>
          onGoogleButtonPress().then(async (val) =>{
            // console.log(val, "Signed in with Google!")
            let userdetails = {
              "id" :val.user._auth._user.uid,
              "name":val.user._auth._user.displayName,
              "email":val.user._auth._user.email


            }
            console.log(userdetails)



            

      await AsyncStorage.setItem("@user", JSON.stringify(userdetails));
            setUser(userdetails)
            signupWithMobile(userdetails)
            navigation.navigate("Welcome Page"); 

            // console.log(val.user._auth._user.uid)
          }
          )
        }
      />


      </View>
    );
  }

  console.log(user)
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account Details</Text>
      <Text style={styles.text}>Email: {user.email}</Text>
      <Text style={styles.text}>User ID: {user.id}</Text>
      {user.name && (
        <Text style={styles.text}>Name: {user.name}</Text>
      )}

      {user.mobileNumber &&(
        <Text style={styles.text}>mobile Number: {user.mobileNumber}</Text>
      )}
      { user.userType&&(
        <Text style={styles.text}>user Type: {user.userType}</Text>
      )}


{(!user.mobileNumber || !user.userType) && (
        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Additional Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />
          <Picker
            selectedValue={userType}
            style={styles.picker}
            onValueChange={(itemValue) => setUserType(itemValue)}
          >
            <Picker.Item label="Select User Type" value="" />
            <Picker.Item label="Muazzin" value="Muazzin" />
            <Picker.Item label="Not Muazzin" value="Not Muazzin" />
          </Picker>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateDetails}>
            <Text style={styles.updateButtonText}>Update Details</Text>
          </TouchableOpacity>
        </View>
      )}


       <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({

  formContainer: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  formHeading: {
    fontSize: 20,
    marginBottom: 10,
    color: "#387478",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: "#387478",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
  },

  container: {
    flex: 1,
    backgroundColor: "#E2F1E7",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    color: "#387478",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: "#387478",
  },
  button: {
    backgroundColor: "#387478",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: "#387478",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});










// pages/AccountsPage.js

















































// import React from 'react';
// import { View, Button, Alert, StyleSheet } from 'react-native';
// // import { auth } from './firebaseConfig'; // Path to your firebaseConfig.js file
// import { auth } from '../firebase'; 
// import * as Google from 'expo-auth-session/providers/google'; // Expo Google Auth
// import {
//   GoogleAuthProvider,
//   signInWithCredential,
// } from 'firebase/auth';
// import * as WebBrowser from 'expo-web-browser'; // To handle web browser interaction

// WebBrowser.maybeCompleteAuthSession(); // Required for Expo Google Auth to work in some cases


// const AccountsPage = () => {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId: '775725503280-j9qek6lbckhpcp95ol1o9ncmf52q73dc.apps.googleusercontent.com', // Replace with your Android Client ID
//     // iosClientId: 'YOUR_IOS_CLIENT_ID_FROM_FIREBASE',         // Replace with your iOS Client ID (if you have iOS app)
//     webClientId: '775725503280-2rh9fqhvkl3odc7iveu14mu3s90sf4r7.apps.googleusercontent.com',         // Replace with your Web Client ID
//   });

//   const handleGoogleSignIn = async () => {
//     try {
//       const authResult = await promptAsync();
//       if (authResult?.type === 'success') {
//         const { id_token } = authResult.params;
//         const googleCredential = GoogleAuthProvider.credential(id_token);
//         await signInWithCredential(auth, googleCredential);
//         Alert.alert("Google Sign-in Successful!", "You are signed in with Google.");
//         // Optionally navigate to home screen or user profile
//       } else {
//         return Alert.alert("Google Sign-in Error", "Google Sign-in was not successful.");
//       }
//     } catch (error) {
//       console.error("Google Sign-in error:", error);
//       Alert.alert("Google Sign-in Error", error.message || "An error occurred during Google Sign-in.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button
//         title="Login with Google"
//         disabled={!request}
//         onPress={handleGoogleSignIn}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
// });

// export default AccountsPage;











// import React from 'react';
// import { View, Button, Alert, StyleSheet } from 'react-native';
// import { auth } from '../firebase'; 
// import * as Google from 'expo-auth-session/providers/google'; // Expo Google Auth
// import {
//   GoogleAuthProvider,
//   signInWithCredential,
// } from 'firebase/auth';
// import * as WebBrowser from 'expo-web-browser'; // To handle web browser interaction

// WebBrowser.maybeCompleteAuthSession(); // Required for Expo Google Auth

// const AccountsPage = () => {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId: '775725503280-j9qek6lbckhpcp95ol1o9ncmf52q73dc.apps.googleusercontent.com',
//     // iosClientId: 'YOUR_IOS_CLIENT_ID_FROM_FIREBASE', // Uncomment and set if using iOS
//     webClientId: '775725503280-2rh9fqhvkl3odc7iveu14mu3s90sf4r7.apps.googleusercontent.com',
//   });

//   const handleGoogleSignIn = async () => {
    
//     console.log("logging in ")
//     try {
//       console.log("logging in ")
//       const authResult = await promptAsync();
//       if (authResult?.type === 'success') {
//         // Extract tokens from the authentication property instead of params
//         const { idToken, accessToken } = authResult.authentication;
//         if (!idToken) {
//           return Alert.alert("Google Sign-in Error", "No idToken returned");
//         }
//         const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);
//         await signInWithCredential(auth, googleCredential);
//         console.log(googleCredential)

//         Alert.alert("Google Sign-in Successful!", "You are signed in with Google.");
//         // Optionally navigate to home screen or user profile
//       } else {
//         Alert.alert("Google Sign-in Error", "Google Sign-in was not successful.");
//       }
//     } catch (error) {
//       console.error("Google Sign-in error:", error);
//       Alert.alert("Google Sign-in Error", error.message || "An error occurred during Google Sign-in.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button
//         title="Login with Google"
//         disabled={!request}
//         onPress={handleGoogleSignIn}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
// });

// export default AccountsPage;
