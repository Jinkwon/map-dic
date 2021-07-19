const shapefile = require('shapefile');
const mapshaper = require('mapshaper');
const { Client } = require('pg');

const client = new Client({
  user: '',
  host: '',
  database: '',
  password: '',
  port: 5432,
});

async function runMapShaper(cmd) {
  await mapshaper.runCommands(cmd, null);
}

(async () => {
  await client.connect();
  const res = await client.query(
    'select * from service.tbl_administrative_district LIMIT 1;',
    []
  );

  const originFile = 'origin/HangJeongDong_ver20200701.geojson';

  const simplifyPercent = 10;
  // 자치구
  await runMapShaper(
    `${originFile} -simplify ${simplifyPercent}% -each \'sgg_cd=adm_cd.substr(0,5)\' -each \'sgg_nm=adm_nm.substr(0,adm_nm.lastIndexOf(" "))\' -dissolve sgg_cd copy-fields=sgg_nm -o out/gu.shp`
  );

  // 자치시
  await runMapShaper(
    `${originFile} -simplify ${simplifyPercent}% -each \'sgg_cd=adm_cd.substr(0,4)+0\' -each \'sgg_nm=adm_nm.substr(0,adm_nm.lastIndexOf(" "))\' -dissolve sgg_cd copy-fields=sgg_nm -o out/si.shp`
  );

  // 광역시
  await runMapShaper(
    `${originFile} -simplify ${simplifyPercent}% -each \'sgg_cd=adm_cd.substr(0,2)\' -each \'sgg_nm=adm_nm.substr(0,adm_nm.lastIndexOf(" "))\' -dissolve sgg_cd copy-fields=sgg_nm -o out/metro.shp`
  );

  async function updateTable(filePath) {
    shapefile
      .open(`${filePath}.shp`, `${filePath}.dbf`, {
        encoding: 'utf8',
      })
      .then((source) =>
        source.read().then(async function log(result) {
          if (result.done) {
            return;
          }
          const { properties, geometry } = result.value;
          let sgg_cd = properties.sgg_cd;

          const sido_code = sgg_cd.substr(0, 2);
          const sigungu_code = sgg_cd.length === 2 ? '' : sgg_cd;

          try {
            await client.query({
              text: `update service.tbl_administrative_district set geometry = ST_AsText(ST_GeomFromGeoJSON($1)) where sido_code=$2 and sigungu_code=$3`,
              values: [JSON.stringify(geometry), sido_code, sigungu_code],
            });
            console.log(
              `success : ${properties.sgg_nm} ${sido_code} ${sigungu_code}`
            );
          } catch (e) {
            console.log(e);
            process.exit(1);
          }
          return source.read().then(log);
        })
      )
      .catch((error) => console.error(error.stack));
  }

  await updateTable('./out/gu');
  await updateTable('./out/si');
  await updateTable('./out/metro');
})();
