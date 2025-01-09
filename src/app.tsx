import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { DealsFeedProvider, localFetchFeed } from './global-state/dealsFeed';
import { Navigation } from './screens/navigationRoutes';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar />
      <DealsFeedProvider fetchFeed={localFetchFeed}>
        <Navigation />
      </DealsFeedProvider>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
export default registerRootComponent(App);
