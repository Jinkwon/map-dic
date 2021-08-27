const map: maplibregl.Map = mapRef.current.getMap();

map.showTileBoundaries = true;

const features: Feature<LineString>[] = map
  .queryRenderedFeatures(
    [
      [0, 0],
      [window.innerWidth, window.innerHeight],
    ],
    { layers: ['L15_16_RD'] }
  )
  .map(
    (r) =>
      ({
        type: 'Feature',
        geometry: r.geometry,
        properties: { ...r.properties },
      } as Feature<LineString>)
  );

features.forEach(f => {
  const exist = roadNetwork.find(n => {
    return n.properties['UID'] === f.properties['UID'];
  });

  roadNetwork.push(f);
});

store.setStyledGeoJson({
  id: 'roadN',
  style: MapStyle.MapSourceLayerFragment,
  zIndex: 1,
  clickable: true,
  geoJson: {
    type: 'FeatureCollection',
    features: roadNetwork,
  },
});
console.log(roadNetwork, features);
