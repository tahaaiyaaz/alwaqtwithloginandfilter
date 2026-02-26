import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES, SHADOWS } from "./Theme";
import { updateUserDetails } from "./userupdate";

GoogleSignin.configure({
  webClientId:
    "317063348459-mqt0tt10giu9mlftrptdvkhs8ohlupds.apps.googleusercontent.com",
  scopes: ["profile", "email"],
});

export default function AccountsPage({ navigation }) {
  const [user, setUser] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const userData = await AsyncStorage.getItem("@user");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          // Listen to Firebase auth state if no local user
          const subscriber = auth().onAuthStateChanged((u) => {
            if(u) {
               // Logic to handle auto-login if needed, mostly handled by button
            }
          });
          return subscriber;
        }
      } catch (error) {
        console.error("Error retrieving user from storage", error);
      }
    };
    getUserFromStorage();
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const googleSignInResult = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        googleSignInResult.data?.idToken
      );
      return await auth().signInWithCredential(googleCredential);
    } catch (error) {
       console.error(error);
       throw error;
    }
  };

  const mapGoogleUserToAppUser = (firebaseUser) => ({
      id: firebaseUser.uid,
      name: firebaseUser.displayName,
      email: firebaseUser.email,
  });

  const signupWithMobile = async (userinfo) => {
    const apiUrl = "https://helloworld-ftfo4ql2pa-el.a.run.app/signupWithMobile";
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: {
            uid: userinfo.id,
            name: userinfo.name,
            email: userinfo.email,
          },
        }),
      });
      const data = await res.json();
      // Logic from original file: update local user with response?
      // Original code: setUser(data.uid); await AsyncStorage...
      // We'll trust the API response contains relevant user data
      if(data.userdata){
         await AsyncStorage.setItem("@user", JSON.stringify(data.userdata));
         setUser(data.userdata);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const val = await onGoogleButtonPress();
      if(val && val.user){
          const appUser = mapGoogleUserToAppUser(val.user);
          await AsyncStorage.setItem("@user", JSON.stringify(appUser));
          setUser(appUser);
          await signupWithMobile(appUser);
          navigation.navigate("Welcome Page");
      }
    } catch (error) {
      Alert.alert("Sign In Error", "Could not sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem("@user");
      setUser(null);
      navigation.navigate("Welcome Page");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateDetails = async () => {
    if (!user) return;
    const updatedUser = { ...user, mobileNumber, userType };
    try {
      await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      const userId = user.userid || user.id; // Correctly map to available ID field
      const updates = { mobileNumber, userType };
      
      await updateUserDetails(userId, updates);
      Alert.alert("Success", "User details updated!");
    } catch (error) {
      Alert.alert("Error", "Failed to update user details.");
    }
  };

  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.notLoggedText}>No user is logged in.</Text>
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
                <FontAwesome name="google" size={24} color={COLORS.white} style={{ marginRight: 10 }} /> 
                <Text style={styles.googleBtnText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Account Details</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.name || "N/A"}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
        </View>

        {user.mobileNumber && (
            <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
                <Text style={styles.label}>Mobile</Text>
                <Text style={styles.value}>{user.mobileNumber}</Text>
            </View>
            </>
        )}
      </View>

      {(!user.mobileNumber || !user.userType) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Complete Profile</Text>
          
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            placeholderTextColor={COLORS.textLight}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />

          <Text style={styles.inputLabel}>Account Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={userType}
              onValueChange={(itemValue) => setUserType(itemValue)}
            >
              <Picker.Item label="Select User Type" value="" color={COLORS.textSecondary} />
              <Picker.Item label="Muazzin" value="Muazzin" color={COLORS.textPrimary} />
              <Picker.Item label="Not Muazzin" value="Not Muazzin" color={COLORS.textPrimary} />
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.updateBtn}
            onPress={handleUpdateDetails}
          >
            <Text style={styles.updateBtnText}>Update Details</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.signOutBtn}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  notLoggedText: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: SIZES.padding,
  },
  googleBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  googleBtnText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 20,
    ...SHADOWS.light,
  },
  heading: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    marginVertical: 8,
  },
  label: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  inputLabel: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 12,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.background,
    ...FONTS.body3,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.background,
    marginTop: 5,
    marginBottom: 20,
    overflow: 'hidden', // for border radius
  },
  updateBtn: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  updateBtnText: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  signOutBtn: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
    marginTop: 10,
  },
  signOutText: {
    ...FONTS.h3,
    color: COLORS.error,
    fontWeight: 'bold',
  }
});
