import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import api from '../../services/axios';
import {AllPackagesKeys, LocationPoint} from '../models';

export const getAllPackages = async () => {
  try {
    const response = await api.get<AllPackagesKeys>('/points');

    console.log(response);

    return response.data;
  } catch (error) {
    //console.error("getAllPackages error: ", error);
  }
};

export const getPackage = async (id: string) => {
  try {
    const response = await api.get(`/points/${id}`);

    return response.data;
  } catch (error) {
    //console.error("getPackage error: ", error);
  }
};

export const newPoint = async (locationPoint: LocationPoint) => {
  console.log('newPoint', locationPoint);
  try {
    await api.post(`/points/${locationPoint.id}`, {
      id: locationPoint.id,
      latitude: locationPoint.latitude,
      longitude: locationPoint.longitude,
      speed: locationPoint.speed,
      time: locationPoint.time,
    });
  } catch (error) {
    console.error('newPoint error: ', error);
  }
};
