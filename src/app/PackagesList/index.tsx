import React, {useCallback} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import PackageList from './components/PackageList';

const PackagesList = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PackageList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PackagesList;
