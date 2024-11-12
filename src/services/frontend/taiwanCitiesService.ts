import taiwanCities, { Area, City } from '@/data/taiwanCities';

export const getAreaListByCityName = (cityName: string): Area[] => {
  const city = taiwanCities.find((c) => c.cityName === cityName);
  return city ? city.areaList : [];
};

export const getAllCityNames = (): string[] => {
  return taiwanCities.map((city) => city.cityName);
};

export const getZipCodeByCityAndAreaName = (
  cityName: string,
  areaName: string
): string => {
  const city = taiwanCities.find((c) => c.cityName === cityName);
  if (city) {
    const area = city.areaList.find((a) => a.areaName === areaName);
    if (area) {
      return area.zipCode;
    }
  }
  return '';
};
