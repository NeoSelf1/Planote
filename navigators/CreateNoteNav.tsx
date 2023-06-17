import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateNote_2 from '../src/screens/CreateNote_2';
import CreateNote_1 from '../src/screens/CreateNote_1';

const stack = createNativeStackNavigator();

export default function CreateNoteNav() {
  return (
    <stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
        <stack.Screen
        options={{ headerShown: false }}
        name='CreateNote_1'
        component={CreateNote_1}
        />
        <stack.Screen
        options={{ headerShown: false }}
        name='CreateNote_2'
        component={CreateNote_2}
        />
    </stack.Navigator>
  );
}
