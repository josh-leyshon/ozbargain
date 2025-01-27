import type React from 'react';
import { Text } from '../../../base/components/text/text';
import { Column, Row } from '../../../base/layout/flex';
import type { OmitStrict } from '../../../base/types/omitStrict';
import type { Comment as CommentType } from '../../../parsers/web-scrape/deal-info-page/comments';

const formatCommentTimestamp: Intl.DateTimeFormat['format'] = date =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);

type CommentProps = OmitStrict<CommentType, 'children'>;

export function Comment({ id, timestamp, content, user, level, votes }: CommentProps): React.JSX.Element {
  return (
    <Column gap='small'>
      <Row gap='medium' justifyContent='flex-start'>
        <Text weight='bold'>{user.name}</Text>
        <Text weight='thin'>{formatCommentTimestamp(timestamp)}</Text>
      </Row>
      <Row>
        <Text>
          {content.parts.map(part => <Text key={part.startIndex}>{part.text}</Text>)}
        </Text>
      </Row>
    </Column>
  );
}
