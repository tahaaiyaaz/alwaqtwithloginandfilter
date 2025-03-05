
// import React from 'react';
// import { View, Button, Alert, StyleSheet } from 'react-native';
// import { auth } from './firebaseConfig'; // Path to your firebaseConfig.js file
// import * as Google from 'expo-auth-session/providers/google'; // Expo Google Auth
// import {
//   GoogleAuthProvider,
//   signInWithCredential,
// } from 'firebase/auth';
// import * as WebBrowser from 'expo-web-browser'; // To handle web browser interaction

// WebBrowser.maybeCompleteAuthSession(); // Required for Expo Google Auth to work in some cases


// const LoginWithGoogle = () => {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId: 'YOUR_ANDROID_CLIENT_ID_FROM_FIREBASE', // Replace with your Android Client ID
//     iosClientId: 'YOUR_IOS_CLIENT_ID_FROM_FIREBASE',         // Replace with your iOS Client ID (if you have iOS app)
//     webClientId: 'YOUR_WEB_CLIENT_ID_FROM_FIREBASE',         // Replace with your Web Client ID
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

// export default LoginWithGoogle;