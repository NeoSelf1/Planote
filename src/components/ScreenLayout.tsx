import { ActivityIndicator, SafeAreaView } from 'react-native';
import { colors } from '../../colors';

export default function ScreenLayout({ loading, children }: any) {
  return (
    <SafeAreaView
      style={{
        flexDirection:'column',
        backgroundColor: 'white',
        flex: 1,
        padding:'4%',
        height:'50%',
        justifyContent:'flex-start',
      }}
    >
      {loading ? <ActivityIndicator size="large" color={colors.green} style={{marginTop:'80%'}} />: children}
    </SafeAreaView>
  );
}
