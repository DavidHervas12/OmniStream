// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./screens/MainNavigator";
import LoginScreen from "./screens/LoginScreen"; 
import { ScreensProvider } from "./screens/ScreenContext";
import ConfigScreen from "./screens/ConfigScreen";


const Stack = createStackNavigator();

const App = () => {
  return (
    <ScreensProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode='none'>
          <Stack.Screen name="Login" component={LoginScreen} /> 
          <Stack.Screen name="MainNavigator" component={MainNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </ScreensProvider>
  );
};

export default App;
