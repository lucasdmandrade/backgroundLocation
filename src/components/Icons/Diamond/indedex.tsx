import * as React from "react";
import Svg, { Circle, Path, G } from "react-native-svg";
import { View } from "react-native";
import { colors } from "../../../styles/colors";

const Diamond = () => (
  <Svg width={50} height={50} viewBox="0 0 60 60">
    <G transform="rotate(45, 30, 30)">
      <Circle
        cx={30}
        cy={30}
        r={27}
        fill="none"
        stroke={colors.darkBlue}
        strokeWidth={3}
      />

      <Path
        d="M30 10 L20 30 L30 50 L40 30 Z"
        fill="none"
        stroke={colors.darkBlue}
        strokeWidth={3}
      />
    </G>
  </Svg>
);

export default Diamond;
