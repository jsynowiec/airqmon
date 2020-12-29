import { remote } from 'electron';
import * as React from 'react';

type Theme = 'light' | 'dark';

interface IThemeContextState {
  theme: Theme;
  accentColor: string;
}

const DEFAULT_STATE: IThemeContextState = {
  theme: 'light',
  accentColor: '2b7df6',
};

export const ThemeContext = React.createContext<IThemeContextState>(DEFAULT_STATE);

class ThemeStore extends React.Component<Record<string, unknown>, IThemeContextState> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      theme: this.systemTheme,
      accentColor: this.systemAccentColor,
    };
  }

  componentDidMount(): void {
    remote.nativeTheme.on('updated', () => {
      this.setState({
        theme: this.systemTheme,
      });
    });

    remote.systemPreferences.subscribeNotification('AppleAquaColorVariantChanged', () => {
      this.setState({
        accentColor: this.systemAccentColor,
      });
    });
  }

  private get systemTheme(): Theme {
    return remote.nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
  }

  private get systemAccentColor(): string {
    return remote.systemPreferences.getAccentColor();
  }

  render(): JSX.Element {
    return (
      <ThemeContext.Provider
        value={{ theme: this.state.theme, accentColor: this.state.accentColor }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeStore;
