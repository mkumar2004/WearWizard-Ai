import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, loading } = useSelector((state: any) => state.auth);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF7E5F" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/Home" />;
  }

  return <Redirect href="/OnBoarding/Bording" />;
}
