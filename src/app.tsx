import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { DealsFeedProvider, localFetchFeed } from './global-state/dealsFeed';
import { DealInfoScreen } from './screens/dealInfo/screen';
import { FeedScreen } from './screens/dealsFeed/screen';
import type { RootStackParamList } from './screens/navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <StatusBar />
      <DealsFeedProvider fetchFeed={localFetchFeed}>
        <Stack.Navigator>
          <Stack.Screen name='Feed' component={FeedScreen} />
          <Stack.Screen name='DealInfo' component={DealInfoScreen} />
        </Stack.Navigator>
      </DealsFeedProvider>
    </NavigationContainer>
  );
}

// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
export default registerRootComponent(App);
