import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getDealCommentsFromDocument } from '../comments';

const dealInfoHtml = readFileSync(join(__dirname, 'fixtures', 'deal-info.html'), 'utf-8');
const dealInfoWithHiddenCommentsHtml = readFileSync(
  join(__dirname, 'fixtures', 'deal-info-with-hidden-comments.html'),
  'utf-8',
);

test('Extracts comments from deal info page', () => {
  expect(getDealCommentsFromDocument(dealInfoHtml)).toMatchSnapshot();
});

test('Works with hidden comments', () => {
  expect(getDealCommentsFromDocument(dealInfoWithHiddenCommentsHtml)).toMatchSnapshot();
});
