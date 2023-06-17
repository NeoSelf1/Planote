import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateNote_2 from '../src/screens/CreateNote_2';
import ViewNote from '../src/screens/ViewNote';
import Note from '../src/screens/Note';
import CreateNote_1 from '../src/screens/CreateNote_1';
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
        name='ViewNote'
        component={ViewNote}
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
