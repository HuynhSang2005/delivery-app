import { render } from '@testing-library/react-native';
import RootLayout from '../../app/_layout';

jest.mock('expo-router', () => {
  const React = require('react');

  const StackComponent = ({ children }: { children?: unknown }) => React.createElement(React.Fragment, null, children);
  StackComponent.Screen = () => null;

  return {
    Stack: StackComponent,
  };
});

jest.mock('expo-status-bar', () => {
  const React = require('react');
  return {
    StatusBar: () => React.createElement(React.Fragment, null),
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    DarkTheme: {},
    DefaultTheme: {},
    ThemeProvider: ({ children }: { children?: unknown }) => children,
  };
});

jest.mock('../../hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

const mockReportMobileInfo = jest.fn();
const mockAttachMobileGlobalErrorHandler = jest.fn(() => jest.fn());

jest.mock('../../utils/observability', () => ({
  reportMobileInfo: (...args: unknown[]) => mockReportMobileInfo(...args),
  attachMobileGlobalErrorHandler: () => mockAttachMobileGlobalErrorHandler(),
}));

describe('mobile runtime integration', () => {
  it('mounts root layout and wires boot observability hooks', () => {
    render(require('react').createElement(RootLayout));

    expect(mockReportMobileInfo).toHaveBeenCalledWith('mobile_app_boot', {
      colorScheme: 'light',
    });
    expect(mockAttachMobileGlobalErrorHandler).toHaveBeenCalledTimes(1);
  });
});
