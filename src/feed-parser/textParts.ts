// TODO: Add 'url' type for clickable links in descriptions.
type TextPartType = 'price' | 'normal';

type TextPart = {
  type: TextPartType;
  text: string;
  /** Index of the entire string that this Part starts on, inclusive. */
  startIndex: number;
  /** Index of the entire string that this Part ends on, exclusive. */
  endIndex: number;
};

/**
 * Text that has been parsed into interesting parts, in the order they appeared.
 */
export type PartedText = {
  text: string;
  parts: TextPart[];
};

const costRegex = /(\$(?:\d+(?:\.\d+)?))/;
const costRegexBeginningChar = '$';

// In the future, can expand this like:
// https://stackoverflow.com/a/9213478
const allRegexes = new RegExp(costRegex.source, 'g');

export function partText(input: string): PartedText {
  const parts: TextPart[] = [];
  let endIndexOfLastMatch = 0;

  for (const match of input.matchAll(allRegexes)) {
    const type: TextPartType | undefined = match[0].at(0) === costRegexBeginningChar ? 'price' : undefined;
    if (!type) {
      console.error(`Found unknown match type when parsing text.`, {
        inputText: input,
        match,
      });
      continue;
    }

    const matchStartIndex = match.index;
    const matchEndIndex = match.index + match[0].length;

    const textPartBeforeThisMatch: TextPart = {
      type: 'normal',
      text: input.slice(endIndexOfLastMatch, matchStartIndex),
      startIndex: endIndexOfLastMatch,
      endIndex: matchStartIndex,
    };

    const matchTextPart: TextPart = {
      type,
      text: match[0],
      startIndex: matchStartIndex,
      endIndex: matchEndIndex,
    };

    endIndexOfLastMatch = matchEndIndex;
    parts.push(textPartBeforeThisMatch, matchTextPart);
  }

  const remainingTextPart: TextPart = {
    type: 'normal',
    text: input.slice(endIndexOfLastMatch),
    startIndex: endIndexOfLastMatch,
    endIndex: input.length,
  };

  parts.push(remainingTextPart);

  return {
    text: input,
    parts,
  };
}
