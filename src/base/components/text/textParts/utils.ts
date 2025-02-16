import type { TextPart } from '../../../../parsers/text/textParts';

const maxNumTextParts = 80;

/**
 * Limiting the number of text parts to render is a performance optimization.
 * Most deal descriptions have around 10 parts. Outliers have 100s.
 * Rendering a large text section can visibly lag the app.
 */
export function trimTextParts(textParts: TextPart[]): TextPart[] {
  return textParts.length > maxNumTextParts
    ? [
      ...textParts.slice(0, maxNumTextParts),
      makeTrimmedTextPart(textParts.at(maxNumTextParts)?.endIndex ?? -1),
    ]
    : textParts;
}

function makeTrimmedTextPart(startIndex: number): TextPart {
  const text = '\n\n...(trimmed)';
  return {
    type: 'normal',
    rawText: text,
    text,
    startIndex,
    endIndex: startIndex + text.length,
  };
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
export function groupTextPartsIntoRenderableGroups(textParts: TextPart[]): TextPart[][] {
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
