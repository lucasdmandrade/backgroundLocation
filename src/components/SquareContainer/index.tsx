import { FC, useMemo } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { OwnProps } from "./types";

const SquareContainer: FC<OwnProps> = ({
  children,
  colors = { background: "transparent", border: "gray" },
}) => {
  const squareStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      ...styles.squareContainer,
      backgroundColor: colors.background,
      borderColor: colors.border,
    }),
    [colors]
  );

  return <View style={squareStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  squareContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderRadius: 5,
    borderWidth: 1,
  },
});

export default SquareContainer;
