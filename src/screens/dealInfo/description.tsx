import type React from 'react';
import { CommonTextFromParts } from '../../base/components/text/textParts/commonTextFromParts';
import type { Deal } from '../../parsers/xml-feed/parser';

type DescriptionProps = Pick<Deal, 'description'>;

export function Description({ description }: DescriptionProps): React.JSX.Element {
  return <CommonTextFromParts textParts={description.parts} />;
}
