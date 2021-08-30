insert
  into
  map_source.fragment
(
  geometry,
  fragment_id,
  id,
  "name"
)
values(
  ST_Transform (ST_GeomFromText('POINT(129.1911187 36.20630204)', 4326), 3857),
  6,
  '',
  'hello world'
);
