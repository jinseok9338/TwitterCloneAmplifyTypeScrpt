export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  NewTweet: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  Search: undefined;
  Notifications: undefined;
  Home: undefined;
  Messages: undefined;
};

export type HomeNavigatorParamList = {
  TabOneScreen: undefined;
  HomeScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type TweetType = {
  id: string;
  createdAt: string;
  user: UserType;
  content: string;
  image?: string;
  numberOfComments?: number;
  numberOfRetweets?: number;
  numberOfLikes?: number;
};

export type UserType = {
  id: string;
  name: string;
  username: string;
  image?: string;
};
