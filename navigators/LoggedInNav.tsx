import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import ViewNote from '../src/screens/ViewNote';
import Note from '../src/screens/Note';
import ViewNote0617 from '../src/screens/ViewNote0617';
import CreateNoteNav from './CreateNoteNav';

const stack = createNativeStackNavigator();

export default function LoggedInNav() {
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      
        <stack.Screen
        options={{ headerShown: false }}
        name='Note'
        component={Note}
        />
        <stack.Screen
        options={{ headerShown: false }}
        name='ViewNote0617'
        component={ViewNote0617}
        />
        <stack.Screen
        options={{ headerShown: false }}
        name='CreateNote'
        >
          {()=><CreateNoteNav/>}
        </stack.Screen>
    </stack.Navigator>
  );
}
