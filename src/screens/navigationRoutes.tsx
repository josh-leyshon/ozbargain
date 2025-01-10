import Icon from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { StaticParamList, StaticScreenProps } from '@react-navigation/native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from '../base/components/text/text';
import { colours } from '../base/constants/colours';
import type { Deal } from '../feed-parser/parser';
import { DealInfoScreen } from './dealInfo/screen';
import { FeedScreen } from './dealsFeed/screen';

export type FeedScreenProps = StaticScreenProps<{
  feedType: 'top' | 'new';
}>;
export type DealInfoScreenProps = StaticScreenProps<{
  dealId: Deal['id'];
}>;

const BottomTabsDealFeeds = createBottomTabNavigator({
  initialRouteName: 'Top',
  screens: {
    Top: {
      screen: FeedScreen,
      initialParams: {
        feedType: 'top',
      },
      options: {
        headerTitle: 'Top deals',
        tabBarIcon: ({ color, size }) => <Icon name='trending-up' color={color} size={size} />,
        tabBarLabel: ({ focused }) => <Text colour={focused ? 'primaryDark' : 'veryLight'} size='small'>Top</Text>,
      },
    },
    New: {
      screen: FeedScreen,
      initialParams: {
        feedType: 'new',
      },
      options: {
        headerTitle: 'New deals',
        tabBarIcon: ({ color, size }) => <Icon name='new-releases' color={color} size={size} />,
        tabBarLabel: ({ focused }) => <Text colour={focused ? 'primaryDark' : 'veryLight'} size='small'>New</Text>,
      },
    },
  },
  screenOptions: {
    tabBarActiveTintColor: colours.primaryDark,
    tabBarInactiveTintColor: colours.copyLighter,
    tabBarActiveBackgroundColor: colours.background,
    tabBarInactiveBackgroundColor: colours.background,
    animation: 'shift',
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Feed',
  screens: {
    Feed: {
      screen: BottomTabsDealFeeds,
      options: {
        headerShown: false,
      },
    },
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
