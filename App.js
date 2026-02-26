import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context"; // Better handling than simple View/SafeAreaView
import Container from "./Components/Container";
import { COLORS } from "./Components/Theme";

export default function App() {
  //sha1  AD:AE:50:D1:5F:F4:D6:3D:A9:50:E1:97:03:82:10:00:04:19:F3:32
  //client id android 775725503280-j9qek6lbckhpcp95ol1o9ncmf52q73dc.apps.googleusercontent.com
  // clientid web 775725503280-2rh9fqhvkl3odc7iveu14mu3s90sf4r7.apps.googleusercontent.com
  // web client secret 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

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar 
        backgroundColor={COLORS.background} 
        barStyle="dark-content" 
        translucent={false}
      />
      <Container />
    </SafeAreaProvider>
  );
}
