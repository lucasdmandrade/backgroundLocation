import Geolocation from 'react-native-geolocation-service';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import NetInfo from '@react-native-community/netinfo';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import BackgroundService from 'react-native-background-actions';
import {sendStoragedPoints, setPoint} from '../storage';
import {newPoint} from '../../api/packages';

const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async taskDataArguments => {
  try {
    const {delay} = taskDataArguments;

    let i = 0;

    while (BackgroundService.isRunning()) {
      console.log(i);
      await sleep(delay);
      i++;

      startLocationTracking();
    }
  } catch (error) {
    console.error('Erro em veryIntensiveTask:', error);
  }
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  parameters: {
    delay: 1000,
  },
};

export const backgroundServiceStart = async () => {
  try {
    await BackgroundService.start(veryIntensiveTask, options);
  } catch (e) {
    console.log('backgroundServiceStart', e);
  }
};

export const backgroundServiceUpdateNotification = async () => {
  await BackgroundService.updateNotification({
    taskDesc: 'New ExampleTask description',
  });
};

export const backgroundServiceStop = async () => await BackgroundService.stop();

interface Coords {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
}

export interface UpdateLocation {
  coords: Coords;
  timestamp: number;
}

const checkInternetConnection = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected;
  } catch (error) {
    console.error('Erro ao verificar a conexão com a Internet:', error);
    return false;
  }
};

export const handleLocationUpdate = async (data: Geolocation.GeoPosition) => {
  const {coords, timestamp} = data;

  const point = {
    id: uuidv4(),
    latitude: coords.latitude,
    longitude: coords.longitude,
    speed: coords.speed,
    time: new Date(timestamp),
  };

  console.log(point);

  const isConnected = await checkInternetConnection();

  if (isConnected) {
    console.log(isConnected);
    await sendStoragedPoints();

    return await newPoint(point);
  }

  return await setPoint(point);
};

export const checkPermissions = async () => {
  try {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    const backgroundLocationPermission = await request(
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    );

    if (
      result === RESULTS.GRANTED &&
      backgroundLocationPermission === 'granted'
    ) {
      console.log('Permissões concedidas');
      await backgroundServiceStart();
    } else {
      console.log('Permissões de localização não concedidas.');
      await checkPermissions();
    }
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
  }
};

const startLocationTracking = () => {
  console.log('startLocationTracking');
  try {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        handleLocationUpdate(position);
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
      },
    );
  } catch (error) {
    console.error('Erro ao iniciar o rastreamento de localização:', error);
  }
};
