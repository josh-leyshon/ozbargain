import { Text, StyleSheet, View } from 'react-native';
import { Button } from '../../base/components/button/button';
import { SquareImage } from '../../base/components/image/squareImage';
import { Column, Row } from '../../base/layout/flex';
import type { OzbargainFeed } from '../../feed-parser/parser';

type DealHeaderProps = {
  title: string;
  imageUrl?: string;
  author: string;
  postedAt: Date;
  expiresAt?: Date;
  votes: OzbargainFeed['deals'][number]['votes'];
};

export function DealHeader({
  title,
  author,
  postedAt,
  expiresAt,
  imageUrl,
  votes,
}: DealHeaderProps): JSX.Element {
  return (
    <Row gap={16}>
      <Column gap={16} shrink={1} grow={1}>
        <Text style={textStyles.title}>{title}</Text>
        <Row gap={16} alignItems="flex-end" wrap="wrap">
          <Column>
            <Text style={textStyles.light}>Posted by @{author}</Text>
            <Text style={textStyles.light}>
              {postedAt.toLocaleDateString(undefined, {
                dateStyle: 'medium',
              })}{' '}
              {postedAt.toLocaleTimeString(undefined, {
                timeStyle: 'short',
              })}
            </Text>
          </Column>
          <Text style={textStyles.light}>
            {'Expires:\n'}
            {expiresAt?.toLocaleDateString(undefined, {
              dateStyle: 'medium',
            }) ?? 'Unknown'}
          </Text>
        </Row>
      </Column>
      <Column gap={16} justifyContent="flex-start">
        <SquareImage source={{ uri: imageUrl }} sizePx={140} />
        <Row gap={16}>
          <View style={styles.buttonContainer}>
            <Button
              title={`👍 ${votes.positive}`}
              color="green"
              onPress={() => undefined}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={`👎 ${votes.negative}`}
              color="lightred"
              onPress={() => undefined}
            />
          </View>
        </Row>
      </Column>
    </Row>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexBasis: 1,
    flexGrow: 1,
  },
});

const textStyles = StyleSheet.create({
  title: {
    fontSize: 16,
  },
  light: {
    color: 'grey',
  },
});
