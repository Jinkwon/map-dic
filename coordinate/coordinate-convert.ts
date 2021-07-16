export function convertLonLat3857To4326(lonLat: LonLat): LonLat {
  const [lon, lat]: [number, number] = proj4(proj4.Proj('EPSG:3857'), proj4.WGS84, [
    lonLat.lon,
    lonLat.lat,
  ]);

  return {
    lon,
    lat,
  };
}

export function convertLonLat4326To3857(lonLat: LonLat): LonLat {
  const [lon, lat]: [number, number] = proj4(proj4.WGS84, proj4.Proj('EPSG:3857'), [
    lonLat.lon,
    lonLat.lat,
  ]);
  return {
    lon,
    lat,
  };
}

export function convertLonLat3857To4326List(lonLat: LonLat): number[] {
  const c: [number, number] = proj4(proj4.Proj('EPSG:3857'), proj4.WGS84, [
    lonLat.lon,
    lonLat.lat,
  ]);

  return [c[0], c[1]];
}

export function convertLonLat4326To3857List(lonLat: LonLat): number[] {
  const c: [number, number] = proj4(proj4.WGS84, proj4.Proj('EPSG:3857'), [
    lonLat.lon,
    lonLat.lat,
  ]);
  return [c[0], c[1]];
}

export function convertGeoJson4326To3857(geoJson: any): any {
  return reproject(geoJson, proj4.WGS84, proj4.Proj('EPSG:3857'));
}

export function convertGeoJson3857To4326(geoJson: any): any {
  return reproject(geoJson, proj4.Proj('EPSG:3857'), proj4.WGS84);
}
