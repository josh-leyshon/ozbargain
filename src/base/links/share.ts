import type { ShareContent } from 'react-native';
import { Platform, Share } from 'react-native';

function shareWeb(args: ShareContent): void {
  console.warn('Sharing is not available on web');
}

async function shareMobile(args: ShareContent) {
  await Share.share(args);
}

/**
 * A common wrapper for sharing on different platforms.
 */
export const share = Platform.OS === 'web' ? shareWeb : shareMobile;
