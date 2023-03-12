import type { DealInfoScreenProps } from "../navigationTypes";
import { DealHeader } from "./dealHeader";
import { LinkButtons } from "./linkButtons";
import { Description } from "./description";
import { FullscreenArea } from "../../base/components/screen/fullscreenArea";
import { Column } from "../../base/layout/flex";
import { useFeed } from "../../global-state/dealsFeed";
import { openURL } from "expo-linking";
import { ScrollView, Share } from "react-native";

export function DealInfoScreen({ route }: DealInfoScreenProps): JSX.Element {
  const { dealId } = route.params;
  const deal = useFeed().getDealById(dealId);

  return (
    <FullscreenArea>
      <ScrollView>
        <Column gap={16}>
          <DealHeader
            title={deal.title}
            description={deal.description}
            imageUrl={deal.thumbnailUrl}
            author="some author"
            postedAt={deal.postedAt}
            expiresAt={deal.expiresAt}
            votes={deal.votes}
          />
          <LinkButtons
            onPressGoToDeal={() => openLink(deal.links.productPage)}
            onPressOpenOnOzbargain={() => openLink(deal.links.deal)}
            onPressShare={async () => {
              await Share.share({ message: deal.links.deal });
            }}
          />
          <Description description={deal.description} />
        </Column>
      </ScrollView>
    </FullscreenArea>
  );
}

async function openLink(url: string): Promise<void> {
  openURL(url).catch(() => console.log("User cancelled dialog"));
}
