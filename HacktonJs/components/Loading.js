import { View, ActivityIndicator } from 'react-native';

const Loading = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ marginTop: 50 }}>
          <ActivityIndicator size="large" color="#f2cb05" />
        </View>
      </View>
    </View>
  );
};

export default Loading;
