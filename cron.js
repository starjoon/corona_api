var cron = require('node-cron');
var lib = require('./schedFunc.js');

cron.schedule('*/2 9,10,16,17 * * *', () => {
  console.log('Cron Running!');
  lib.Total();
  lib.Countries();
  lib.Seoul();
  lib.Busan();
  lib.Daegu();
  lib.Incheon();
  lib.Gwangju();
  lib.Daejeon();
  lib.Ulsan();
  lib.Sejong();
  lib.Gyeonggi();
  lib.GyeonggiCity();
  lib.Gangwon();
  lib.Chungbuk();
  lib.Chungnam();
  lib.Gyeongbuk();
  lib.GyeongbukCity();
  lib.Gyeongnam();
  lib.GyeongnamCity();
  // lib.Gyeongsan();
});

cron.schedule('*/15 11-16 * * *', () => {
  console.log('Cron Running!');
  lib.Total();
  lib.Seoul();
  lib.Busan();
  lib.Daegu();
  lib.Incheon();
  lib.Gwangju();
  lib.Daejeon();
  lib.Ulsan();
  lib.Sejong();
  lib.Gyeonggi();
  lib.GyeonggiCity();
  lib.Gangwon();
  lib.Chungbuk();
  lib.Chungnam();
  lib.Gyeongbuk();
  lib.GyeongbukCity();
  lib.Gyeongnam();
  lib.GyeongnamCity();
  // lib.Gyeongsan();
});
