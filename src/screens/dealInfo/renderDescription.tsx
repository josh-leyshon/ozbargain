import type React from 'react';
import { Link } from '../../base/components/text/link';
import { Text } from '../../base/components/text/text';
import { openLink } from '../../base/links/openLink';
import type { Deal } from '../../feed-parser/parser';
import type { TextPart } from '../../feed-parser/textParts';

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

  return (
    <Text>
      {parts.map(part => {
        return part.type === 'link'
          ? <Link key={part.startIndex} onPress={() => openLink(part.url)}>{part.text}</Link>
          : <Text key={part.startIndex}>{part.text}</Text>;
      })}
    </Text>
  );
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
