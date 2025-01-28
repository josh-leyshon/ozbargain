import type React from 'react';
import { Text } from '../../../base/components/text/text';
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

export function Comment({ id, timestamp, content, user, level, votes }: CommentProps): React.JSX.Element {
  return (
    <Column gap='small'>
      <Row gap='medium' justifyContent='flex-start' alignItems='center'>
        <Text weight='bold'>{user.name}</Text>
        <Text size='small' colour='light'>{timestampFormatter.format(timestamp)}</Text>
      </Row>
      <Row>
        <Text>
          {content.parts.map(part => <Text key={part.startIndex}>{part.text}</Text>)}
        </Text>
      </Row>
    </Column>
  );
}
