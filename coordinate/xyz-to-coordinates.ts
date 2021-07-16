import SphericalMercator from '@mapbox/sphericalmercator';


class XyzToCoordinates {
  private merc: SphericalMercator;

  constructor(tileSize: number) {
    this.merc = new SphericalMercator({
      size: tileSize,
    });
  }
  xyzToBbox(x, y, z): [number, number, number, number] {
    return merc.bbox(x, y, z); 
  }
}
