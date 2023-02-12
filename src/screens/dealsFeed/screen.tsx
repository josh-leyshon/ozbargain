import { DealsFeed } from "./dealsFeed";
import { FullscreenArea } from "../../base/components/screen/fullscreenArea";
import type { FeedScreenProps } from "../navigationTypes";
import { useFeed } from "../../global-state/dealsFeed";

export function FeedScreen({ navigation }: FeedScreenProps): JSX.Element {
  const deals = useFeed().getDeals();

  return (
    <FullscreenArea>
      <DealsFeed
        items={deals.map((deal) => ({
          id: deal.id,
          title: deal.title,
          description: deal.description,
          imageUrl: deal.thumbnailUrl,
        }))}
        onPressItem={(item) =>
          navigation.navigate("DealInfo", { dealId: item.id })
        }
      />
    </FullscreenArea>
  );
}
