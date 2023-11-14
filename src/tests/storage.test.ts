jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

import AsyncStorage from "@react-native-async-storage/async-storage";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
  setPoint,
  getAllPoints,
  sendStoragedPoints,
} from "../services/storage";
import { LocationPoint } from "../api/models";

interface StorageMockLocationPoint {
  id: string;
  latitude: number;
  longitude: number;
  speed: number;
  time: string;
}

describe("Storage tests", () => {
  const mockLocationPoint: LocationPoint = {
    id: "1",
    latitude: 123.456,
    longitude: 789.012,
    speed: 50,
    time: new Date("2023-11-07T01:33:11.438Z"),
  };

  const storageMockLocationPoint: StorageMockLocationPoint = {
    id: "1",
    latitude: 123.456,
    longitude: 789.012,
    speed: 50,
    time: "2023-11-07T01:33:11.438Z",
  };

  let mock: MockAdapter;

  beforeAll(async () => {
    await AsyncStorage.clear();
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("setPoint should store data point correctly", async () => {
    await setPoint(mockLocationPoint);
    const storedValue = await AsyncStorage.getItem(mockLocationPoint.id);

    expect(JSON.parse(storedValue || "")).toEqual(storageMockLocationPoint);
  });

  it("getAllPoints should return the stored points", async () => {
    await setPoint(mockLocationPoint);
    const points = await getAllPoints();

    expect(points).toHaveLength(1);
    expect(points[0]).toEqual(storageMockLocationPoint);
  });

  it("sendStoragedPoints should send data and remove them", async () => {
    await setPoint(mockLocationPoint);
    const spyMultiRemove = jest.spyOn(AsyncStorage, "multiRemove");

    mock
      .onPost(`/points/${mockLocationPoint.id}`, mockLocationPoint)
      .reply(200);

    await sendStoragedPoints();

    const storedValue = await AsyncStorage.getItem(mockLocationPoint.id);

    expect(spyMultiRemove).toHaveBeenCalledWith([mockLocationPoint.id]);
    expect(storedValue).toBeNull();

    spyMultiRemove.mockRestore();
  });
});
