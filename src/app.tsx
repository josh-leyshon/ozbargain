import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DealsFeedProvider, onlineNewDealsFetchFeed, onlineTopDealsFetchFeed } from './global-state/dealsFeed';
import { Navigation } from './screens/navigationRoutes';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar style='dark' />
      <DealsFeedProvider
        topDealsFetchFeed={onlineTopDealsFetchFeed}
        newDealsFetchFeed={onlineNewDealsFetchFeed}
      >
        <Navigation />
      </DealsFeedProvider>
    </SafeAreaProvider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
export default registerRootComponent(App);
