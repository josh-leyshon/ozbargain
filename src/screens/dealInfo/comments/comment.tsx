import type React from 'react';
import { Tag } from '../../../base/components/tag/tag';
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
    : state === 'hidden'
    ? <Text colour='veryLight'>Comment hidden due to negative votes.</Text>
    : <Text colour='veryLight'>Comment removed.</Text>;

  return (
    <Column gap='small'>
      <Row justifyContent='space-between' alignItems='center'>
        <Row gap='medium' justifyContent='flex-start' alignItems='center'>
          {user.isOp && <Tag colour='primary' type='thin'>OP</Tag>}
          <Text
            weight='bold'
            colour={state === 'shown' ? 'normal' : 'veryLight'}
          >
            {user.name}
          </Text>
          {state !== 'removed' && (
            <Text
              size='small'
              colour={state === 'shown' ? 'light' : 'veryLight'}
            >
              {timestampFormatter.format(timestamp)}
            </Text>
          )}
        </Row>
        {votes && (
          <Text
            size='small'
            colour={votes > 0 ? 'light' : 'veryLight'}
          >
            {`${votes > 0 ? '+' : '-'}${votes}`}
          </Text>
        )}
      </Row>
      <Row>
        {commentText}
      </Row>
    </Column>
  );
}
