import { StyleSheet, View } from "react-native";
import { DealsFeed } from "./dealsFeed";
import { FullscreenArea } from "../../base/components/screen/fullscreenArea";
import type { FeedScreenProps } from "../navigationTypes";
import { OzbargainFeed } from "../../feed-parser/parser";

const parsedFeed: OzbargainFeed = require("../../feed-parser/tests/fixtures/parsed-ozbargain-rss.json");

export function FeedScreen({ navigation }: FeedScreenProps): JSX.Element {
  const itemsData = parsedFeed.deals.map((deal) => ({
    title: deal.title,
    description: deal.description,
    imageUrl: deal.thumbnailUrl,
    id: deal.id,
  }));

  return (
    <FullscreenArea>
      <DealsFeed
        items={itemsData}
        onPressItem={(item) =>
          navigation.navigate("DealInfo", {
            deal: {
              ...item,
            },
          })
        }
      />
    </FullscreenArea>
  );
}
