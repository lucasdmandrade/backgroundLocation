import MockAdapter from "axios-mock-adapter";
import { getAllPackages, getPackage, newPoint } from "../api/packages"; // Importe suas funções do arquivo real
import axios from "../services/axios";

describe("Packages API expects", () => {
  let mock: MockAdapter;

  const mockedKeysData = { keys: ["package1", "package2"] };

  const locationPoint = {
    id: "1548",
    latitude: 111.111,
    longitude: 222.222,
    speed: 30,
    time: new Date(),
  };

  const locationPointResponse = {
    id: "1548",
    latitude: 111.111,
    longitude: 222.222,
    speed: 30,
    time: locationPoint.time.toISOString(),
  };

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("getAllPackages should return the correct data", async () => {
    mock.onGet("/points").reply(200, mockedKeysData);

    const result = await getAllPackages();

    expect(result).toEqual(mockedKeysData);
  });

  it("getAllPackages should handle errors correctly", async () => {
    mock.onGet("/points").reply(500, "Erro interno do servidor");

    try {
      await getAllPackages();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      //@ts-ignore
      expect(error.message).toBe(
        "getAllPackages error: Request failed with status code 500"
      );
    }
  });

  it("getPackage should return the correct data", async () => {
    mock.onGet(`/points/${locationPoint.id}`).reply(200, locationPoint);

    const result = await getPackage(locationPoint.id);

    expect(result).toEqual(locationPointResponse);
  });

  it("getPackage should handle errors correctly", async () => {
    mock
      .onGet(`/points/${locationPoint.id}`)
      .reply(404, "Pacote não encontrado");

    try {
      await getPackage(locationPoint.id);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      //@ts-ignore
      expect(error.message).toBe(
        "getPackage error: Request failed with status code 404"
      );
    }
  });

  it("newPoint should create point with correct data", async () => {
    mock.onPost(`/points/${locationPoint.id}`).reply(200);
    mock.onGet(`/points/${locationPoint.id}`).reply(200, locationPoint);

    await newPoint(locationPoint);

    const result = await getPackage(locationPoint.id);

    expect(result).toEqual(locationPointResponse);
  });

  it("newPoint should handle errors correctly", async () => {
    mock
      .onPost(`/points/${locationPoint.id}`)
      .reply(500, "Erro interno do servidor");

    try {
      await newPoint(locationPoint);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      //@ts-ignore
      expect(error.message).toBe("newPoint error: Erro interno do servidor");
    }
  });
});
