import type React from 'react';
import type { TextPart } from '../../../../parsers/text/textParts';
import { Column } from '../../../layout/flex';
import { openLink } from '../../../links/openLink';
import { share } from '../../../links/share';
import type { OmitStrict } from '../../../types/omitStrict';
import { Blockquote } from '../blockquote';
import { Link } from '../link';
import type { TextProps } from '../text';
import { Text } from '../text';
import { groupTextPartsIntoRenderableGroups, trimTextParts } from './utils';

type CommonTextFromPartsProps = {
  textParts: TextPart[];
} & Pick<TextProps, 'size' | 'weight' | 'colour'>;

/**
 * Most commonly displayed text can be rendered in the same way,
 * ie. we care to display the same kinds of text parts.
 * This component handles that.
 */
export function CommonTextFromParts({ textParts, ...props }: CommonTextFromPartsProps): React.JSX.Element {
  const trimmedTextParts = trimTextParts(textParts);
  const groups = groupTextPartsIntoRenderableGroups(trimmedTextParts);

  return (
    <Column>
      {groups.map(group => {
        const firstPart = group.at(0);
        if (!firstPart) {
          return undefined;
        }

        if (group.length === 1) {
          return (
            <Column key={firstPart.startIndex}>
              <SingleTextPart textPart={firstPart} {...props} />
            </Column>
          );
        }

        return (
          <Text key={firstPart.startIndex}>
            {group.map(part => <SingleTextPart key={part.startIndex} textPart={part} {...props} />)}
          </Text>
        );
      }).filter(jsx => jsx != null)}
    </Column>
  );
}

type RenderTextPartProps = OmitStrict<CommonTextFromPartsProps, 'textParts'> & {
  textPart: TextPart;
};

function SingleTextPart({ textPart, size, weight, colour }: RenderTextPartProps): React.JSX.Element {
  return textPart.type === 'link'
    ? (
      <Link
        onPress={() => openLink(textPart.url)}
        onLongPress={() => share({ message: textPart.url })}
        size={size}
        weight={weight}
      >
        {textPart.text}
      </Link>
    )
    : textPart.type === 'blockquote'
    ? (
      <Blockquote>
        {textPart.text}
      </Blockquote>
    )
    : (
      <Text
        size={size}
        weight={weight}
        colour={colour}
      >
        {textPart.text}
      </Text>
    );
}
