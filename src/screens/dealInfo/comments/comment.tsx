import type React from 'react';
import { Text } from '../../../base/components/text/text';
import { CommonTextFromParts } from '../../../base/components/text/textParts/commonTextFromParts';
import { Column, Row } from '../../../base/layout/flex';
import type { OmitStrict } from '../../../base/types/omitStrict';
import type { Comment as CommentType } from '../../../parsers/web-scrape/deal-info-page/comments';

const timestampFormatter = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  hour12: true,
  hour: 'numeric',
  minute: '2-digit',
});

type CommentProps = OmitStrict<CommentType, 'children'>;

export function Comment({ id, timestamp, state, content, user, level, votes }: CommentProps): React.JSX.Element {
  const commentText = state === 'shown' && content != null
    ? <CommonTextFromParts textParts={content.parts} />
    : <Text colour='veryLight'>Comment hidden due to negative votes.</Text>;

  return (
    <Column gap='small'>
      <Row gap='medium' justifyContent='flex-start' alignItems='center'>
        <Text
          weight='bold'
          colour={state === 'hidden' ? 'veryLight' : 'normal'}
        >
          {user.name}
        </Text>
        <Text
          size='small'
          colour={state === 'hidden' ? 'veryLight' : 'light'}
        >
          {timestampFormatter.format(timestamp)}
        </Text>
      </Row>
      <Row>
        {commentText}
      </Row>
    </Column>
  );
}
