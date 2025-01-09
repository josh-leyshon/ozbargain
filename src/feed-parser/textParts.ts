import { UnreachableError } from '../base/unreachableError';

type TextPartType = 'price' | 'link' | 'blockquote' | 'normal';
type InternalTextPartType = TextPartType | 'metaDiv';

type LinkTextPart = {
  type: 'link';
  url: string;
  /** The text that should be displayed as the link. */
  text: string;
  /** Whether this link is for another Ozbargain deal, or just a link to an external site. */
  linkType: 'deal' | 'external';
};

type TextPart =
  & {
    /** Raw text of this Part. */
    rawText: string;
    /** Index of the entire string that this Part starts on, inclusive. */
    startIndex: number;
    /** Index of the entire string that this Part ends on, exclusive. */
    endIndex: number;
  }
  & ({
    type: Exclude<TextPartType, 'link'>;
    /** Text with HTML tags stripped out. */
    text: string;
  } | LinkTextPart);

/**
 * Text that has been parsed into interesting parts, in the order they appeared.
 */
export type PartedText = {
  rawText: string;
  parts: TextPart[];
};

const costRegex = /(\$(?:\d+(?:\.\d+)?))/;
const costRegexBeginsWith = '$';

const descriptionMetaDivRegex = /(?:<div .+?<\/div>)/;
const descriptionMetaDivBeginsWith = '<div ';

const linkRegex = /(<a .+?>.+?<\/a>)/;
const linkRegexBeginsWith = '<a ';

const blockQuoteRegex = /(<blockquote>.+?<\/blockquote>)/;
const blockQuoteRegexBeginsWith = '<blockquote>';

const allRegexes = new RegExp(
  `${costRegex.source}|${descriptionMetaDivRegex.source}|${linkRegex.source}|${blockQuoteRegex.source}`,
  'gs',
);

export function partText(input: string): PartedText {
  const parts: TextPart[] = [];
  let endIndexOfLastMatch = 0;

  for (const match of input.matchAll(allRegexes)) {
    const matchedText = match[0];
    const type = (
      matchedText.startsWith(costRegexBeginsWith)
        ? 'price'
        : matchedText.startsWith(descriptionMetaDivBeginsWith)
        ? 'metaDiv'
        : matchedText.startsWith(linkRegexBeginsWith)
        ? 'link'
        : matchedText.startsWith(blockQuoteRegexBeginsWith)
        ? 'blockquote'
        : undefined
    ) satisfies InternalTextPartType | undefined;

    if (!type) {
      console.error(`Found unknown match type when parsing text.`, {
        inputText: input,
        match,
      });
      continue;
    }

    const matchStartIndex = match.index;
    const matchEndIndex = match.index + matchedText.length;

    if (type === 'metaDiv') {
      // We want to ignore the initial meta div in a deal description.
      endIndexOfLastMatch = matchEndIndex;
      continue;
    }

    const textPartBeforeThisMatch = {
      type: 'normal',
      rawText: input.slice(endIndexOfLastMatch, matchStartIndex),
      text: stripAndUnescapeHtml(input.slice(endIndexOfLastMatch, matchStartIndex)),
      startIndex: endIndexOfLastMatch,
      endIndex: matchStartIndex,
    } satisfies TextPart;

    const matchedPart = parsePart(match, type, { start: matchStartIndex, end: matchEndIndex });
    if (!matchedPart) {
      console.error('Unable to create TextPart for match:', {
        inputText: input,
        type,
        match,
      });

      endIndexOfLastMatch = matchEndIndex;
      continue;
    }

    endIndexOfLastMatch = matchEndIndex;
    parts.push(textPartBeforeThisMatch, matchedPart);
  }

  const remainingTextPart = {
    type: 'normal',
    rawText: input.slice(endIndexOfLastMatch),
    text: stripAndUnescapeHtml(input.slice(endIndexOfLastMatch)),
    startIndex: endIndexOfLastMatch,
    endIndex: input.length,
  } satisfies TextPart;

  parts.push(remainingTextPart);

  return {
    rawText: input,
    parts,
  };
}

function parsePart(
  match: RegExpExecArray,
  type: Exclude<TextPartType, 'normal'>,
  indexes: { start: number; end: number },
): TextPart | undefined {
  switch (type) {
    case 'link': {
      const linkParts = parseLink(match[0]);
      return linkParts
        ? {
          type,
          rawText: match[0],
          startIndex: indexes.start,
          endIndex: indexes.end,
          ...linkParts,
        }
        : undefined;
    }
    case 'price':
    case 'blockquote':
      return {
        type,
        rawText: match[0],
        text: stripAndUnescapeHtml(match[0]),
        startIndex: indexes.start,
        endIndex: indexes.end,
      };
    default:
      throw new UnreachableError(type);
  }
}

/**
 * Parse an `<a>` tag into parts.
 */
function parseLink(text: string): Omit<LinkTextPart, 'type'> | undefined {
  const urlStr = text.match(/href="(.+?)"/)?.[1];
  const internalExternal = text.match(/class="(internal|external).*?"/)?.[1];
  const linkText = text.match(/<a .+?>(.+?)<\/a>/)?.[1];

  if (!urlStr || !internalExternal || !linkText) {
    return;
  }

  const linkType = internalExternal === 'internal' ? 'deal' : 'external';
  const url = linkType === 'deal' ? `https://ozbargain.com.au${urlStr}` : urlStr;

  return {
    url,
    text: linkText,
    linkType,
  };
}

function stripAndUnescapeHtml(text: string): string {
  return text
    // Remove HTML tags from given text, returning just the content text.
    .replaceAll(/(<([^>]+)>)/g, '')
    // Return escaped chars like `&amp;` to their normal forms (like `&`).
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'");
}
