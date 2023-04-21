import { ActivityIndicator, View } from 'react-native';

export default function ScreenLayout({ loading, children }: any) {
  return (
    <View
      style={{
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {loading ? <ActivityIndicator color='white' /> : children}
    </View>
  );
}
