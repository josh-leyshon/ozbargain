import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import type { RootStackParamList } from './screens/navigationTypes';
import { FeedScreen } from './screens/dealsFeed/screen';
import { DealInfoScreen } from './screens/dealInfo/screen';
import {
  FeedGetter,
  localFetchFeed,
  useMakeFeedGetter,
  FeedContext,
} from './global-state/dealsFeed';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const feedGetter = useMakeFeedGetter(() =>
    FeedGetter.makeFeedGetter(localFetchFeed),
  );

  return feedGetter == null ? (
    <Text>Loading feed...</Text>
  ) : (
    <NavigationContainer>
      <StatusBar />
      <FeedContext.Provider value={feedGetter}>
        <Stack.Navigator>
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="DealInfo" component={DealInfoScreen} />
        </Stack.Navigator>
      </FeedContext.Provider>
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
