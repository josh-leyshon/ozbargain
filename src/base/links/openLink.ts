import { openURL } from 'expo-linking';

/**
 * Open a link, likely in another app.
 */
export async function openLink(url: string): Promise<void> {
  await openURL(url).catch(() => console.log('User cancelled dialog'));
}
