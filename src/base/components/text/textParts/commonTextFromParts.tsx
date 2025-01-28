import type React from 'react';
import type { TextPart } from '../../../../parsers/text/textParts';
import { openLink } from '../../../links/openLink';
import { share } from '../../../links/share';
import { Link } from '../link';
import { Text } from '../text';

type CommonTextFromPartsProps = {
  textParts: TextPart[];
};

/**
 * Most commonly displayed text can be rendered in the same way,
 * ie. we care to display the same kinds of text parts.
 * This component handles that.
 */
export function CommonTextFromParts({ textParts }: CommonTextFromPartsProps): React.JSX.Element {
  return (
    <Text>
      {textParts.map(part => {
        return part.type === 'link'
          ? (
            <Link
              key={part.startIndex}
              onPress={() => openLink(part.url)}
              onLongPress={() => share({ message: part.url })}
            >
              {part.text}
            </Link>
          )
          : <Text key={part.startIndex}>{part.text}</Text>;
      })}
    </Text>
  );
}
