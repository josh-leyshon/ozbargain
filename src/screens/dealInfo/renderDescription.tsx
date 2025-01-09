import type React from 'react';
import { Link } from '../../base/components/text/link';
import { Text } from '../../base/components/text/text';
import { openLink } from '../../base/links/openLink';
import type { PartedText } from '../../feed-parser/textParts';

export function renderDealDescription(text: PartedText): React.JSX.Element {
  return (
    <Text>
      {text.parts.map(part => {
        return part.type === 'link'
          ? <Link key={part.startIndex} onPress={() => openLink(part.url)}>{part.text}</Link>
          : <Text key={part.startIndex}>{part.text}</Text>;
      })}
    </Text>
  );
}
