import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import SelectNote from '../src/screens/SelectNote';
import WebviewContainer from '../src/components/WebviewContainer';

const Tabs = createBottomTabNavigator();

export default function LoggedInNav() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopColor: 'rgba(255,255,255,0.3)',
        },
        tabBarActiveTintColor: 'white',
      }}
    >
        <Tabs.Screen
        options={{ headerShown: false }}
        name='SelectNote'
        component={SelectNote}
        />
        <Tabs.Screen
        options={{ headerShown: false }}
        name='WebViewContainer'
        component={WebviewContainer}
        />
    </Tabs.Navigator>
  );
}
