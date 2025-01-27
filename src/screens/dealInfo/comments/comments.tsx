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
  comment: CommentType;
};

export function CommentThread({ comment }: CommentThreadProps): React.JSX.Element {
  const flattenedFirstCommentThread = flattenCommentThread(comment);

  return (
    <Column gap='large'>
      {flattenedFirstCommentThread.map(comment => <Comment key={comment.id} {...comment} />)}
    </Column>
  );
}
