import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocationPoint} from '../../api/models';
import {newPoint} from '../../api/packages';

export const setPoint = async (point: LocationPoint) => {
  try {
    const value = JSON.stringify(point);

    console.log('setPoint: ', value);

    await AsyncStorage.setItem(point.id, value);
  } catch (e) {
    console.log('setPoint error: ', e);
  }
};

export const getAllPoints = async (): Promise<LocationPoint[]> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();

    if (!allKeys.length) {
      return [];
    }

    const allPoints = await AsyncStorage.multiGet(allKeys);

    return allPoints.map(point => (point[1] ? JSON.parse(point[1]) : ''));
  } catch (e) {
    console.log('getAllPoints error: ', e);

    return [];
  }
};

export const sendStoragedPoints = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();

    if (!allKeys.length) {
      return;
    }

    const allPoints = await AsyncStorage.multiGet(allKeys);

    allPoints.forEach(async point => {
      if (!point[1]) {
        return;
      }

      await newPoint(JSON.parse(point[1]));
    });

    await AsyncStorage.multiRemove(allKeys);
  } catch (e) {
    console.log('getAllPoints error: ', e);
  }
};
