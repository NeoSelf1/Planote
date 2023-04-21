import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WebviewContainer from '../src/screens/WebviewContainer';
import ViewNote from '../src/screens/ViewNote';
import Note from '../src/screens/Note';

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
        name='Note'
        component={Note}
        />
        <Tabs.Screen
        options={{ headerShown: false }}
        name='WebViewContainer'
        component={WebviewContainer}
        />
        <Tabs.Screen
        options={{ headerShown: false }}
        name='ViewNote'
        component={ViewNote}
        />
    </Tabs.Navigator>
  );
}
