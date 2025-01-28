import type React from 'react';
import { Column } from '../../../base/layout/flex';
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
    <Column gap='large'>
      {flattenedCommentThread.map(comment => <Comment key={comment.id} {...comment} />)}
    </Column>
  );
}
