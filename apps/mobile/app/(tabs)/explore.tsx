import { StyleSheet } from 'react-native';
import { FOUNDATION_CAPABILITIES } from 'shared-kernel';

import { Collapsible } from '@/components/ui/collapsible';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Explore
        </ThemedText>
      </ThemedView>
      <ThemedText>Foundation runtime surface for delivery MVP validation.</ThemedText>
      <Collapsible title="Runtime ownership">
        {FOUNDATION_CAPABILITIES.map((capability) => (
          <ThemedView key={capability.key} style={styles.capabilityRow}>
            <IconSymbol size={18} color="#808080" name="person.crop.circle.badge.checkmark" />
            <ThemedText>
              {capability.label} - <ThemedText type="defaultSemiBold">{capability.owner}</ThemedText>
            </ThemedText>
          </ThemedView>
        ))}
      </Collapsible>
      <Collapsible title="Mobile targets">
        <ThemedText>
          Mobile keeps the Expo Router shell focused on MVP-1 delivery flows while Android, iOS, and
          web exports remain separately testable.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Quality gates">
        <ThemedText>
          Unit, integration, and web export smoke checks are explicit scripts in this app package.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  capabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
});
