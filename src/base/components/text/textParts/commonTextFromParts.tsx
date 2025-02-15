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

type CommonTextFromPartsProps = {
  textParts: TextPart[];
} & Pick<TextProps, 'size' | 'weight' | 'colour'>;

/**
 * Most commonly displayed text can be rendered in the same way,
 * ie. we care to display the same kinds of text parts.
 * This component handles that.
 */
export function CommonTextFromParts({ textParts, ...props }: CommonTextFromPartsProps): React.JSX.Element {
  const groups = groupTextPartsIntoRenderableGroups(textParts);

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

/**
 * For different types of TextParts to be rendered visibly "together",
 * they need to be grouped into appropriate groups that can be rendered together in one view.
 *
 * For example, a `blockquote` type needs to be rendered in its own group, because
 * it won't render correctly as inline Text like simpler types (it will overflow oddly).
 *
 * Other types may be fine, and in fact are required, to be rendered within the same Text view,
 * for text wrapping to occur correctly.
 */
function groupTextPartsIntoRenderableGroups(textParts: TextPart[]): TextPart[][] {
  const groups: TextPart[][] = [];

  let currentGroup: TextPart[] = [];

  for (const part of textParts) {
    if (part.type === 'blockquote') {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      groups.push([part]);
      currentGroup = [];
      continue;
    }

    currentGroup.push(part);
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}
