export interface SquareColors {
  background?: string;
  border?: string;
}

export interface OwnProps {
  children: JSX.Element;
  colors?: SquareColors;
}
