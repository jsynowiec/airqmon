import * as React from 'react';
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

interface IThemedWindowProps {
  name: string;
}

const ThemedWindow: React.FunctionComponent<IThemedWindowProps> = (props) => {
  const themeContext = useContext(ThemeContext);

  return (
    <div className={`window ${props.name}-window ${themeContext.theme}-theme`}>
      {props.children}
    </div>
  );
};

export default ThemedWindow;
