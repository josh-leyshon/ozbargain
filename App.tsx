import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { DealsFeed } from "./src/screens/dealsFeed/dealsFeed";
import type { OzbargainFeed } from "./src/feed-parser/parser";

const parsedFeed: OzbargainFeed = require("./src/feed-parser/tests/fixtures/parsed-ozbargain-rss.json");

export default function App() {
  return (
    <View style={styles.container}>
      <DealsFeed
        items={parsedFeed.deals.map((deal) => ({
          title: deal.title,
          description: deal.description,
          imageUrl: deal.thumbnailUrl,
          id: deal.id,
        }))}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
