const originalConsoleError = console.error.bind(console);

console.error = (...args: unknown[]) => {
	const firstArg = String(args[0] ?? '');
	if (firstArg.includes('react-test-renderer is deprecated')) {
		return;
	}

	originalConsoleError(...args);
};

jest.mock('react-native-worklets', () => ({
	__esModule: true,
	default: {},
	runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
	runOnUI: (fn: (...args: unknown[]) => unknown) => fn,
	makeShareable: <T>(value: T) => value,
	makeShareableCloneRecursive: <T>(value: T) => value,
	isWorkletFunction: () => false,
}));

jest.mock('react-native-reanimated', () => {
	const React = require('react');

	return {
		__esModule: true,
		default: {
			View: React.Fragment,
			createAnimatedComponent: (Component: unknown) => Component,
		},
		createAnimatedComponent: (Component: unknown) => Component,
		useSharedValue: (value: unknown) => ({ value }),
		useAnimatedStyle: () => ({}),
		useDerivedValue: (fn: () => unknown) => ({ value: fn() }),
		withTiming: (toValue: unknown) => toValue,
		withSpring: (toValue: unknown) => toValue,
		Easing: {},
	};
});

try {
	jest.mock('react-native/src/private/animated/NativeAnimatedHelper');
} catch {
	jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
}
