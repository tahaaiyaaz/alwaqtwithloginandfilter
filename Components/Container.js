import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";

import WelcomePage from "./WelcomePage";
import HomePage from "./HomePage";
import AboutMasjidPage from "./AboutMasjidPage";
import MasjidDetail from "./MasjidDetail";
import UpdateTimingsPage from "./UpdateTimingsPage";
import MainTabs from "./maintabs";
import Signup from "./Signup";
import AccountsPage from "./AccountsPage";
import PrayerTimeComponent from "./arragemasjidsaccordingtotime";
import AddMasjid from "./addmasjid";
import MasjidListScreen from "./moremasjidscomponent";

import { COLORS, FONTS } from "./Theme";

const Container = () => {
  const Stack = createStackNavigator();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: COLORS.background,
      card: COLORS.surface,
      text: COLORS.textPrimary,
    },
  };

  const commonHeaderOptions = {
    headerStyle: { 
      backgroundColor: COLORS.surface,
      elevation: 0, 
      shadowOpacity: 0, 
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    headerTintColor: COLORS.primary,
    headerTitleStyle: { ...FONTS.h3 },
    headerBackTitleVisible: false,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            ...commonHeaderOptions, 
          }}
        >
          <Stack.Screen
            name="Welcome Page"
            component={WelcomePage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Add Masjid"
            component={AddMasjid}
            options={{ headerShown: true, title: "Add New Masjid" }}
          />

          <Stack.Screen
            name="filterprayercomp"
            component={PrayerTimeComponent}
            options={{ headerShown: false }}
          />
          {/* Note: MainTabs usually handles the Home Page via tabs, but if standalone page exists: */}
          <Stack.Screen
            name="Home Page"
            component={HomePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="About Page"
            component={AboutMasjidPage}
            options={{ headerShown: true, title: "About Masjid" }}
          />

          <Stack.Screen
            name="SignUp"
            component={Signup}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="AccountsPage"
            component={AccountsPage}
            options={{ headerShown: true, title: "My Account" }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="UpdateTimingsPage"
            component={UpdateTimingsPage}
            options={{
              title: "Update Timings",
            }}
          />

          <Stack.Screen 
            name="MasjidList" 
            component={MasjidListScreen} 
            options={{ headerShown: true, title: "All Masjids" }}
          />
          <Stack.Screen
            name="MasjidDetail"
            component={MasjidDetail}
            options={{
              title: "Masjid Details",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default Container;
