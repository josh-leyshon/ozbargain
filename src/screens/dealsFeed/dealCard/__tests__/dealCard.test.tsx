import { fireEvent, render, screen } from '@testing-library/react-native';
import { DEAL_CARD_TEST_ID, DealCard } from '../dealCard';

test('Pressing anywhere on the card fires onPress', () => {
  const onPress = jest.fn();
  const titleText = 'my title';

  render(
    <DealCard title={titleText} onPress={onPress} dealMeta={null} />,
  );

  // TODO: Figure out how to get the image to click on as well.
  // `getBy` with all accessibility functions doesn't pick up the <Image> component.
  // testID works but then seems to show up even when no image is given to the card.
  const title = screen.getByText(titleText);
  const card = screen.getByTestId(DEAL_CARD_TEST_ID);

  fireEvent.press(title);
  fireEvent.press(card);

  expect(onPress).toHaveBeenCalledTimes(2);
});
