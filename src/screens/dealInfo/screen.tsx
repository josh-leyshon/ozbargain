import type { DealInfoScreenProps } from "../navigationTypes";
import { DealHeader } from "./dealHeader";
import { LinkButtons } from "./linkButtons";
import { Description } from "./description";
import { FullscreenArea } from "../../base/components/screen/fullscreenArea";
import { Column } from "../../base/layout/flex";

export function DealInfoScreen({ route }: DealInfoScreenProps): JSX.Element {
  const { deal } = route.params;
  return (
    <FullscreenArea>
      <Column gap={16}>
        <DealHeader
          title={deal.title}
          description={deal.description}
          imageUrl={deal.imageUrl}
          author="some author"
          postedAt={new Date()}
          expiresAt={new Date()}
          votes={{ positive: 24, negative: 3 }}
        />
        <LinkButtons deal="url.com" productPage="url.com" />
        <Description description={deal.description} />
      </Column>
    </FullscreenArea>
  );
}
