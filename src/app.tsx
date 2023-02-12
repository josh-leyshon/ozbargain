import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./screens/navigationTypes";
import { FeedScreen } from "./screens/dealsFeed/screen";
import { DealInfoScreen } from "./screens/dealInfo/screen";

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="DealInfo" component={DealInfoScreen} />
      </Stack.Navigator>
      <StatusBar />
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
