import { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../styles/colors";

const options: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

const Package: FC<OwnProps> = ({ packageId, time, isSynchronized }) => (
  <View style={styles.container}>
    <View style={{ flex: 1 }}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
        Pacote ID: {packageId}
      </Text>

      <Text style={styles.subtitle}>
        {isSynchronized ? "Sincronizado" : "Pendente sincronizar"}
      </Text>
    </View>

    <View>
      <Text style={styles.subtitle}>
        {time ? new Date(time).toLocaleString("pt-BR", options) : ""}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between",
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    marginRight: 15,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default Package;
