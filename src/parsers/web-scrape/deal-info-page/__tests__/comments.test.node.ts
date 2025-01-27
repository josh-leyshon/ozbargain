import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getDealCommentsFromDocument } from '../comments';

const dealInfoHtml = readFileSync(join(__dirname, 'fixtures', 'deal-info.html'), 'utf-8');

test('Extracts comments from deal info page', () => {
  expect(getDealCommentsFromDocument(dealInfoHtml)).toMatchSnapshot();
});
