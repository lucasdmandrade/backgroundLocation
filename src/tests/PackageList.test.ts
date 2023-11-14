jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

import MockAdapter from "axios-mock-adapter";
import { act, render, waitFor } from "@testing-library/react-native";
import axios from "../services/axios";
import PackagesList from "../app/PackagesList";
import { mockPoints, pointsKeys } from "../api/models/mocks";

const component = PackagesList;

describe("PackagesList render tests", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("PackagesList should be render", async () => {
    act(() => {
      const getall = mock
        .onGet("/points")
        .reply(200, { keys: [mockPoints[0].points.id] });

      const get = mock
        .onGet(`/points/${mockPoints[0].points.id}`)
        .reply(200, mockPoints[0]);
    });

    const root = await waitFor(() => render(component()));

    expect(root).toMatchSnapshot();
  });
});
