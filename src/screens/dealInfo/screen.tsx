import type { DealInfoScreenProps } from "../navigationTypes";
import { DealHeader } from "./dealHeader";
import { LinkButtons } from "./linkButtons";
import { Description } from "./description";
import { FullscreenArea } from "../../base/components/screen/fullscreenArea";
import { Column } from "../../base/layout/flex";
import { useFeed } from "../../global-state/dealsFeed";

export function DealInfoScreen({ route }: DealInfoScreenProps): JSX.Element {
  const { dealId } = route.params;
  const deal = useFeed().getDealById(dealId);

  return (
    <FullscreenArea>
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
          deal={deal.links.deal}
          productPage={deal.links.productPage}
        />
        <Description description={deal.description} />
      </Column>
    </FullscreenArea>
  );
}
