import { render, screen, fireEvent } from '@testing-library/react-native';
import { DealCard, DEAL_CARD_TEST_ID } from '../dealCard';

test('Pressing anywhere on the card fires onPress', () => {
  const onPress = jest.fn();
  const descriptionText = 'desc';

  render(
    <DealCard title="title" description={descriptionText} onPress={onPress} />,
  );

  // TODO: Figure out how to get the image to click on as well.
  // `getBy` with all accessibility functions doesn't pick up the <Image> component.
  // testID works but then seems to show up even when no image is given to the card.
  const description = screen.getByText(descriptionText);
  const card = screen.getByTestId(DEAL_CARD_TEST_ID);

  fireEvent.press(description);
  fireEvent.press(card);

  expect(onPress).toHaveBeenCalledTimes(2);
});
