import { StyleSheet } from 'react-native';
import { DELIVERY_MVP_SEQUENCE, FOUNDATION_CAPABILITIES, SHARED_KERNEL_VERSION } from 'shared-kernel';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D8EEE3', dark: '#17352A' }}
      headerImage={
        <IconSymbol
          size={260}
          color="#4B7F63"
          name="shippingbox.fill"
          style={styles.headerIcon}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Delivery MVP-1</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Foundation baseline</ThemedText>
        <ThemedText>{DELIVERY_MVP_SEQUENCE.join(' -> ')}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Shared kernel</ThemedText>
        <ThemedText>Version {SHARED_KERNEL_VERSION} owns shared MVP constants and foundation capability metadata.</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Runtime contracts</ThemedText>
        {FOUNDATION_CAPABILITIES.slice(0, 3).map((capability) => (
          <ThemedView key={capability.key} style={styles.capabilityRow}>
            <IconSymbol size={18} color="#4B7F63" name="checkmark.circle.fill" />
            <ThemedText>{capability.label}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  capabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    bottom: -55,
    right: -20,
    position: 'absolute',
  },
});
