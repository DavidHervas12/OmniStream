import React from 'react';
import { Image, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import ConfigScreen from './ConfigScreen';
import NotifsScreen from './NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="HomeScreen"  
        component={HomeScreen}
        options={{
          title: 'Buscar',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const ConfigStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Config">
        {(props) => <ConfigScreen {...props} mainNavigation={navigation} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};



const NotifsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Notifs" component={NotifsScreen} />
    </Stack.Navigator>
  );
};

const LoginStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
<Stack.Screen name="Login">
  {(props) => <LoginScreen {...props} mainNavigation={navigation} />}
</Stack.Screen>
    </Stack.Navigator>
  );
};

const getTabBarIcon = (route, focused) => {
  let iconName;

  if (route.name === 'Profile') {
    iconName = focused ? require('../assets/user_icon.png') : require('../assets/user_icon.png');
  } else if (route.name === 'Home') {
    iconName = focused ? require('../assets/homeIcon.png') : require('../assets/homeIcon.png');
  } else if (route.name === 'Config') {
    iconName = focused ? require('../assets/settingsIcon.png') : require('../assets/settingsIcon.png');
  } else if (route.name === 'Notifications') {
    iconName = focused ? require('../assets/inbox.png') : require('../assets/inbox.png');
  }

  return (
    <Image
      source={iconName}
      style={{
        width: 24,
        height: 24,
        // Apply additional styling for the selected icon
        transform: focused ? [{ translateY: -5 }] : [], // Adjust translateY value as needed
        elevation: focused ? 5 : 0, // Add elevation for the selected icon
      }}
    />
  );
};


const MainNavigator = () => {
  const [fontsLoaded] = useFonts({
    RobotoMono: RobotoMono_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          inactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: '#607FF8', alignItems: 'center', bottom: -10, height: 60},
          tabBarLabelStyle: { fontFamily: 'RobotoMono' },
          tabBarIcon: ({ focused, color, size }) => {
            return getTabBarIcon(route, focused);
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarLabel: '',
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarLabel: '',
          }}
        />
        <Tab.Screen
          name="Config"
          component={ConfigStack}
          options={{
            tabBarLabel: '',
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotifsStack}
          options={{
            tabBarLabel: '',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;