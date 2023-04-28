import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateNote_2 from '../src/screens/CreateNote_2';
import ViewNote from '../src/screens/ViewNote';
import Note from '../src/screens/Note';
import CreateNote_1 from '../src/screens/CreateNote_1';

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
        name='CreateNote_1'
        component={CreateNote_1}
        />
        <Tabs.Screen
        options={{ headerShown: false }}
        name='CreateNote_2'
        component={CreateNote_2}
        />
        <Tabs.Screen
        options={{ headerShown: false }}
        name='ViewNote'
        component={ViewNote}
        />
    </Tabs.Navigator>
  );
}
