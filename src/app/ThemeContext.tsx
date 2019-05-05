import { remote } from 'electron';
import * as React from 'react';

type Theme = 'light' | 'dark';

interface IThemeContextState {
  theme: Theme;
}

export const ThemeContext = React.createContext<Theme>('light');

class ThemeStore extends React.Component<{}, IThemeContextState> {
  constructor(props) {
    super(props);

    this.state = {
      theme: this.systemTheme,
    };
  }

  componentDidMount() {
    remote.systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
      this.setState({
        theme: this.systemTheme,
      });
    });
  }

  private get systemTheme() {
    return remote.systemPreferences.isDarkMode() ? 'dark' : 'light';
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>{this.props.children}</ThemeContext.Provider>
    );
  }
}

export default ThemeStore;
