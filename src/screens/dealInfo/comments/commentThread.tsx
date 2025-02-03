import type React from 'react';
import { colours } from '../../../base/constants/colours';
import { sizes } from '../../../base/constants/sizes';
import { Column, Row } from '../../../base/layout/flex';
import type { OmitStrict } from '../../../base/types/omitStrict';
import type { Comment as CommentType } from '../../../parsers/web-scrape/deal-info-page/comments';
import { Comment } from './comment';

function flattenCommentThread(comment: CommentType): OmitStrict<CommentType, 'children'>[] {
  const comments: OmitStrict<CommentType, 'children'>[] = [
    comment,
    ...(comment.children?.flatMap(c => flattenCommentThread(c)) ?? []),
  ];

  return comments;
}

export type CommentThreadProps = {
  firstComment: CommentType;
};

export function CommentThread({ firstComment }: CommentThreadProps): React.JSX.Element {
  const flattenedCommentThread = flattenCommentThread(firstComment);

  return (
    <Column gap='small'>
      {flattenedCommentThread.map(comment => (
        <Row key={comment.id} justifyContent='flex-start' gap='medium'>
          {comment.level > 0 && <ThreadIndent level={comment.level} />}
          <Column
            // Comments will expand horizontally to the max size of the container (screen).
            grow={1}
            // Comments will not overflow the container horizontally.
            shrink={1}
            paddingBlock='small'
          >
            <Comment {...comment} />
          </Column>
        </Row>
      ))}
    </Column>
  );
}

type ThreadIndentProps = {
  level: CommentType['level'];
};

function ThreadIndent({ level }: ThreadIndentProps): React.JSX.Element {
  const width = sizes.small / 2;
  return (
    <Column
      style={{
        width,
        borderRadius: width,
        backgroundColor: level % 2 === 1
          ? colours.primary
          : colours.secondaryLight,
        marginLeft: level * sizes.medium,
      }}
    />
  );
}
