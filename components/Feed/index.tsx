import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import Tweet from "../Tweet";

import { API, graphqlOperation } from "aws-amplify";
import { listTweets } from "../../src/graphql/queries";
import { TweetType } from "../../types";
// import UserFleetsList from "../UserFleetsList";

const Feed = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTweets = async () => {
    setLoading(true);
    try {
      const tweetsData = await API.graphql(graphqlOperation(listTweets, {}));

      const Tweets = tweetsData.data.listTweets.items;

      Tweets.sort(function (a: TweetType, b: TweetType) {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      });

      setTweets(tweetsData.data.listTweets.items);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <View style={{ width: "100%" }}>
      <FlatList
        data={tweets}
        style={{ height: "100%" }}
        renderItem={({ item }) => <Tweet tweet={item as TweetType} />}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={fetchTweets}
        // ListHeaderComponent={UserFleetsList}
      />
    </View>
  );
};

export default Feed;
