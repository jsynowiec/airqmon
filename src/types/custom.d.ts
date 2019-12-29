declare module '*.less' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

type HTMLButtonElementMouseEventHandler = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
) => void;

type HTMLAnchorElementMouseEventHandler = (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
) => void;
