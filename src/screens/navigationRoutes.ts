import type { StaticParamList, StaticScreenProps } from '@react-navigation/native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Deal } from '../feed-parser/parser';
import { DealInfoScreen } from './dealInfo/screen';
import { FeedScreen } from './dealsFeed/screen';

export type FeedScreenProps = StaticScreenProps<never>;
export type DealInfoScreenProps = StaticScreenProps<{
  dealId: Deal['id'];
}>;

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Feed',
  screens: {
    Feed: FeedScreen,
    DealInfo: DealInfoScreen,
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
