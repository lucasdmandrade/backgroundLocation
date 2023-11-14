import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

const Divider: FC = () => <View style={styles.divider} />;

export default Divider;

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: 0,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
});
