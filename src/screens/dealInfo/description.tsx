import type React from 'react';
import { CommonTextFromParts } from '../../base/components/text/textParts/commonTextFromParts';
import type { TextPart } from '../../parsers/text/textParts';
import type { Deal } from '../../parsers/xml-feed/parser';

const maxNumTextParts = 80;

type DescriptionProps = Pick<Deal, 'description'>;

export function Description({ description }: DescriptionProps): React.JSX.Element {
  // Limiting the number of text parts to render is a performance optimization.
  // Most deal descriptions have around 10 parts. Outliers have 100s.
  // Rendering a large description can visibly lag the app.
  const parts = description.parts.length > maxNumTextParts
    ? [
      ...description.parts.slice(0, maxNumTextParts),
      makeTrimmedDescriptionTextPart(description.parts.at(maxNumTextParts)?.endIndex ?? -1),
    ]
    : description.parts;

  return <CommonTextFromParts textParts={parts} />;
}

function makeTrimmedDescriptionTextPart(startIndex: number): TextPart {
  const text = '\n\n...(description trimmed)';
  return {
    type: 'normal',
    rawText: text,
    text,
    startIndex,
    endIndex: startIndex + text.length,
  };
}
