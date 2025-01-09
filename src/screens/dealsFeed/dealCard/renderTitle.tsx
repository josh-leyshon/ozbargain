import type React from 'react';
import { Text } from '../../../base/components/text/text';
import type { PartedText } from '../../../feed-parser/textParts';

export function renderDealCardTitle(text: PartedText): React.JSX.Element {
  return (
    <Text numberOfLines={12}>
      {text.parts.map(part => (
        <Text
          key={part.startIndex}
          size='large'
          weight='bold'
          colour={part.type === 'price' ? 'primaryDark' : 'normal'}
        >
          {part.rawText}
        </Text>
      ))}
    </Text>
  );
}
