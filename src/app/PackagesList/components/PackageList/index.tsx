import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import Package from "../Package";
import { getAllPackages, getPackage, newPoint } from "../../../../api/packages";
import { LocationPoint } from "../../../../api/models";
import { getAllPoints } from "../../../../services/storage";
import { OrderedPackages } from "./types";

const PackageList = () => {
  const [synchronizedPackages, setSynchronizedPackages] = useState<
    LocationPoint[]
  >([]);
  const [storagePackages, setStoragePackages] = useState<LocationPoint[]>([]);

  const orderedPackages: OrderedPackages[] = useMemo(() => {
    const storageWithIsSynchronized = storagePackages?.map((pkg) => ({
      ...pkg,
      isSynchronized: false,
    }));

    const synchronizedWithIsSynchronized = synchronizedPackages?.map((pkg) => ({
      ...pkg,
      isSynchronized: true,
    }));

    const combinedPackages = [
      ...storageWithIsSynchronized,
      ...synchronizedWithIsSynchronized,
    ];

    combinedPackages.sort((a, b) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);

      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;

      return 0;
    });

    return combinedPackages;
  }, [storagePackages, synchronizedPackages]);

  const fetchPackages = useCallback(async () => {
    const allPackages = await getAllPackages();

    console.log(allPackages);

    if (!allPackages?.keys.length) return;

    Promise.all(
      allPackages?.keys?.map((PackageKeys) => getPackage(PackageKeys))
    )
      .then((value: { points: LocationPoint }[]) => {
        const points = value.map((element) => element.points);

        setSynchronizedPackages(points);
      })
      .catch((e) => console.log("Promise.all getPackage error: ", e));
  }, [setSynchronizedPackages]);

  const renderItem = useCallback(
    ({ item }: { item: OrderedPackages }) => (
      <Package
        packageId={item?.id}
        time={item?.time}
        isSynchronized={item.isSynchronized}
      />
    ),
    []
  );

  const fetchStoragedPoints = useCallback(async () => {
    const allPoints = await getAllPoints();
    if (!allPoints.length) return;

    setStoragePackages(allPoints);
  }, [setStoragePackages]);

  useEffect(() => {
    fetchPackages();
    fetchStoragedPoints();
  }, []);

  return (
    <FlatList
      data={orderedPackages}
      renderItem={renderItem}
      keyExtractor={({ id }, index) => `package-${id}-${index}`}
    />
  );
};

export default PackageList;
