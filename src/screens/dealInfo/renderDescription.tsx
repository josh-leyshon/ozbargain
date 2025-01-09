import type React from 'react';
import { Text } from '../../base/components/text/text';
import type { PartedText } from '../../feed-parser/textParts';

export function renderDealDescription(text: PartedText): React.JSX.Element {
  return (
    <Text>
      {text.parts.map(part => {
        return (
          <Text key={part.startIndex} colour={part.type === 'link' ? 'primaryDark' : 'normal'}>
            {part.text}
          </Text>
        );
      })}
    </Text>
  );
}
