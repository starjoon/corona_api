const request = require('request');
const cheerio = require('cheerio');
var AllStatus = require('./models/AllStatus.js');
var Patient = require('./models/Patient.js');

module.exports.Total = function updateTotal() {
  request('http://ncov.mohw.go.kr/', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      try {
        let res = [];
        const $ = cheerio.load(html);
        const table = $('div.liveNumOuter');
        const increment = parseInt(
          table
            .find('ul.liveNum_today')
            .find('li')
            .eq(0)
            .find('span.data1')
            .text()
        );
        const confirm = parseInt(
          table
            .find('div.liveNum')
            .find('ul.liveNum')
            .find('li')
            .eq(0)
            .find('span.num')
            .contents()[1]
            .nodeValue.replace(',', '')
        );
        const cured = parseInt(
          table
            .find('div.liveNum')
            .find('ul.liveNum')
            .find('li')
            .eq(1)
            .find('span.num')
            .text()
            .replace(',', '')
        );
        const death = parseInt(
          table
            .find('div.liveNum')
            .find('ul.liveNum')
            .find('li')
            .eq(2)
            .find('span.num')
            .text()
            .replace(',', '')
        );
        const monitor = parseInt(
          table
            .find('div.liveNum')
            .find('ul.liveNum')
            .find('li')
            .eq(3)
            .find('span.num')
            .text()
            .replace(',', '')
        );
        const formatDate = table
          .find('span.livedate')
          .text()
          .split(',')[0]
          .slice(1)
          .split('.');
        const fullDate = `질병관리본부 ${parseInt(formatDate[0])}월 ${parseInt(
          formatDate[1]
        )}일 ${formatDate[2].trim()}`;
        AllStatus.updateOne(
          { _id: '5e569d3c02d7831dfc09019d' },
          {
            confirm: confirm,
            cured: cured,
            death: death,
            monitor: monitor,
            increment: increment,
            updatedDate: fullDate,
          },
          (err, docs) => {
            if (err) {
              console.error(err);
            } else {
              console.log(docs.n + ' allStatus updated');
            }
          }
        );
        AllStatus.updateMany({}, { updatedDate: fullDate }, (err, docs) => {
          if (err) {
            console.error(err);
          } else {
            console.log(docs.n + ' allStatus updated');
          }
        });
        Patient.updateMany({}, { updatedDate: fullDate }, (err, docs) => {
          if (err) {
            console.error(err);
          } else {
            console.log(docs.n + ' patients updated');
          }
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(`can't connect`);
    }
  });
};

module.exports.Countries = function updateTotal() {
  request(
    'http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=14',
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        try {
          const $ = cheerio.load(html);
          const table = $('table.num').eq(0).find('tbody');
          table.find('tr').each(function (i, elem) {
            let country = $(this).find('td.w_bold').text();
            if (country == '한국') {
              return false;
            }
            confirmed = parseInt(
              $(this)
                .find('td')
                .eq(1)
                .text()
                .split(' ')[0]
                .replace(/[,명]/g, '')
            );
            if (!country || !confirmed) {
              return false;
            }
            try {
              death = parseInt(
                $(this)
                  .find('td')
                  .eq(1)
                  .text()
                  .split(' ')[1]
                  .replace(/[(,사망)]/g, '')
              );
            } catch (err) {
              death = 0;
            }
            // console.log(country, confirmed, death);
            AllStatus.updateOne(
              { region: country },
              {
                total: confirmed,
                death: death,
                deathRate: ((death / confirmed) * 100).toFixed(1),
              },
              (err, docs) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(docs.n + ` ${country} allStatus updated`);
                }
              }
            );
          });
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error(error);
      }
    }
  );
};

module.exports.Seoul = function updateTotal() {
  request(
    'http://www.seoul.go.kr/coronaV/coronaStatus.do',
    { timeout: 5000 },
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        try {
          const $ = cheerio.load(html);
          const status = $('div .status');
          const num = status.find('div .num1').find('.counter').text().trim();
          AllStatus.updateOne(
            { region: '서울' },
            { total: num },
            (err, docs) => {
              if (err) {
                console.error(err);
              } else {
                console.log(docs.n + ' Seoul updated');
              }
            }
          );
        } catch (err) {
          console.error(err);
        }
      }
    }
  );
};

module.exports.Busan = function updateTotal() {
  request('http://www.busan.go.kr/corona19/index', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      try {
        const $ = cheerio.load(html);
        const banner = $('div .banner');
        const num = banner.find('span[class=item2]').text().replace('명', '');
        AllStatus.updateOne({ region: '부산' }, { total: num }, (err, docs) => {
          if (err) {
            console.error(err);
          } else {
            console.log(docs.n + ' Busan updated');
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  });
};

module.exports.Daegu = function updateTotal() {
  request('http://ncov.mohw.go.kr/', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      try {
        const $ = cheerio.load(html);
        const dashboard = $('div#main_maplayout');
        const num = parseInt(
          dashboard.find('span.num').eq(2).text().replace(/,/g, '')
        );
        AllStatus.updateOne({ region: '대구' }, { total: num }, (err, docs) => {
          if (err) {
            console.error(err);
          } else {
            console.log(docs.n + ' Daegu updated');
          }
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(error);
    }
  });
};

module.exports.Incheon = function updateTotal() {
  request(
    'https://www.incheon.go.kr/corona19/IC010001',
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        try {
          const $ = cheerio.load(html);
          const dashboard = $('table').find('tbody');
          const num = parseInt(
            dashboard.find('td').eq(0).find('em.num-red').text()
          );
          AllStatus.updateOne(
            { region: '인천' },
            { total: num },
            (err, docs) => {
              if (err) {
                console.error(err);
              } else {
                console.log(docs.n + ' Incheon updated');
              }
            }
          );
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error(error);
      }
    }
  );
};

module.exports.Gwangju = function updateTotal() {
  request('http://ncov.mohw.go.kr/', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      try {
        const $ = cheerio.load(html);
        const dashboard = $('div#main_maplayout');
        const num = parseInt(
          dashboard.find('span.num').eq(4).text().replace(/,/g, '')
        );
        AllStatus.updateOne({ region: '광주' }, { total: num }, (err, docs) => {
          if (err) {
            console.error(err);
          } else {
            console.log(docs.n + ' Gwangju updated');
          }
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(error);
    }
  });
};

module.exports.Daejeon = function updateTotal() {
  request(
    'https://www.daejeon.go.kr/corona19/index.do',
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        try {
          const $ = cheerio.load(html);
          const dashboard = $('div.txt2');
          const num = parseInt(
            dashboard.find('span.s-txt').eq(0).find('strong').text()
          );
          AllStatus.updateOne(
            { region: '대전' },
            { total: num },
            (err, docs) => {
              if (err) {
                console.error(err);
              } else {
                console.log(docs.n + ' Daejeon updated');
              }
            }
          );
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error(error);
      }
    }
  );
};

module.exports.Ulsan = function updateTotal() {
  request('http://www.ulsan.go.kr/corona.jsp', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      try {
        const $ = cheerio.load(html);
        const dashboard = $('div.situation1_1').find('ul');
        const num =
          parseInt(dashboard.find('span.num_people.counter').eq(0).text()) +
          parseInt(dashboard.find('span.num_people.counter').eq(1).text()) +
          parseInt(dashboard.find('span.num_people.counter').eq(2).text());
        AllStatus.updateOne({ region: '울산' }, { total: num }, (err, docs) => {
          if (err) {
            console.error(err);
          } else {
            console.log(docs.n + ' Ulsan updated');
          }
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(error);
    }
  });
};

module.exports.Sejong = function updateTotal() {
  request('http://ncov.mohw.go.kr/', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      try {
        const $ = cheerio.load(html);
        const dashboard = $('div#main_maplayout');
        const num = parseInt(
          dashboard.find('span.num').eq(7).text().replace(/,/g, '')
        );
        AllStatus.updateOne({ region: '세종' }, { total: num }, (err, docs) => {
          if (err) {
            console.error(err);
          } else {
            console.log(docs.n + ' Sejong updated');
          }
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(error);
    }
  });
};

module.exports.Gyeonggi = function updateTotal() {
  request(
    'https://www.gg.go.kr/bbs/boardView.do?bsIdx=464&bIdx=2296956&menuId=1535',
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        try {
          const $ = cheerio.load(html);
          const dashboard = $('div.gg');
          const num = parseInt(dashboard.find('strong#c-total').text());
          AllStatus.updateOne(
            { region: '경기도' },
            { total: num },
            (err, docs) => {
              if (err) {
                console.error(err);
              } else {
                console.log(docs.n + ' Gyeongi updated');
              }
            }
          );
        } catch (err) {
          console.error(err);
        }
      }
    }
  );
};

module.exports.GyeonggiCity = function updateTotal() {
  request(
    'https://www.gg.go.kr/contents/contents.do?ciIdx=1150&menuId=2909',
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        try {
          const $ = cheerio.load(html);
          const box = $('div.covid19_box');
          data = box.find('p').each(function (i, elem) {
            let query = $(this).attr('title');
            let num = parseInt($(this).text());
            if (query == '광주') {
              AllStatus.updateOne(
                { region: '경기도 광주' },
                { total: num },
                (err, docs) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log(docs.n + ` ${query} updated`);
                  }
                }
              );
            } else {
              AllStatus.updateOne(
                { region: query },
                { total: num },
                (err, docs) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log(docs.n + ` ${query} updated`);
                  }
                }
              );
            }
          });
        } catch (err) {
          console.error(err);
        }
      }
    }
  );
};

module.exports.Gangwon = function updateTotal() {
  request(
    'http://www.provin.gangwon.kr/covid-19.html',
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        try {
          const $ = cheerio.load(html);
          const dashboard = $('div.condition');
          const num = parseInt(
            dashboard
              .find('ul')
              .find('li')
              .eq(0)
              .find('span')
              .text()
              .replace('명', '')
          );
          AllStatus.updateOne(
            { region: '강원도' },
            { total: num },
            (err, docs) => {
              if (err) {
                console.error(err);
              } else {
                console.log(docs.n + ' Gangwon updated');
              }
            }
          );
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error(error);
      }
    }
  );
};

module.exports.Chungbuk = function updateTotal() {
  request('http://ncov.mohw.go.kr/', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      try {
        const $ = cheerio.load(html);
        const dashboard = $('div#main_maplayout');
        const num = parseInt(
          dashboard.find('span.num').eq(10).text().replace(/,/g, '')
        );
        AllStatus.updateOne({ region: '충북' }, { total: num }, (err, docs) => {
          if (err) {
            console.error(err);
          } else {
            console.log(docs.n + ' Chungbuk updated');
          }
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(error);
    }
  });
};

module.exports.Chungnam = function updateTotal() {
  ChungnamCities = [
    '충남',
    '천안',
    '공주',
    '보령',
    '아산',
    '서산',
    '논산',
    '계룡',
    '당진',
    '금산',
    '부여',
    '서천',
    '청양',
    '홍성',
    '예산',
    '태안',
  ];
  request(
    'http://www.chungnam.go.kr/coronaStatus.do?tab=1',
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        try {
          const $ = cheerio.load(html);
          const dashboard = $('table.new_tbl_board.mb20')
            .eq(1)
            .find('tbody')
            .find('tr')
            .eq(0);
          data = dashboard.find('td').each(function (i, elem) {
            if (i == 0) {
              return;
            }
            num = $(this).text();
            AllStatus.updateOne(
              { region: ChungnamCities[i - 1] },
              { total: num },
              (err, docs) => {
                if (err) {
                  console.error(`${ChungnamCities[i - 1]} not infected`);
                } else {
                  console.log(docs.n + ` ${ChungnamCities[i - 1]} updated`);
                }
              }
            );
          });
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error(error);
      }
    }
  );
};

module.exports.Gyeongbuk = function updateTotal() {
  request('http://www.gb.go.kr/Main/index.html', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      try {
        const $ = cheerio.load(html);
        const dashboard = $('div.list1');
        const num = parseInt(
          dashboard.find('dd.red').text().replace(/,|명/g, '')
        );
        AllStatus.updateOne({ region: '경북' }, { total: num }, (err, docs) => {
          if (err) {
            console.error(err);
          } else {
            console.log(docs.n + ' Gyeongbuk updated');
          }
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(error);
    }
  });
};

module.exports.GyeongbukCity = function updateTotal() {
  GyeongbukCities = {
    pohang: '포항',
    gyeongju: '경주',
    gimcheon: '김천',
    andong: '안동',
    gumi: '구미',
    yeongju: '영주',
    yeongcheon: '영천',
    sangju: '상주',
    gbmg: '문경',
    gyeongsan: '경산',
    gunwi: '군위',
    usc: '의성',
    cheongsong: '청송',
    yyg: '영양',
    yd: '영덕',
    cheongdo: '청도',
    goryeong: '고령',
    seongju: '성주',
    chilgok: '칠곡',
    yecheon: '예천',
    bonghwa: '봉화',
    uljin: '울진',
  };
  request('http://gb.go.kr/corona_main.htm', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      try {
        const $ = cheerio.load(html);
        const box = $('div.corona_result');
        data = box.find('span').each(function (i, elem) {
          let query = GyeongbukCities[$(this).attr('class').split(' ')[1]];
          let num = parseInt($(this).text());
          AllStatus.updateOne(
            { region: query },
            { total: num },
            (err, docs) => {
              if (err) {
                console.error(err);
              } else {
                console.log(docs.n + ` ${query} updated`);
              }
            }
          );
        });
      } catch (err) {
        console.error(err);
      }
    }
  });
};

module.exports.Gyeongnam = function updateTotal() {
  request(
    'http://xn--19-q81ii1knc140d892b.kr/main/main.do',
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        try {
          const $ = cheerio.load(html);
          const dashboard = $('div.situation1_1');
          const num = parseInt(
            dashboard.find('span.num_people.counter.all').text()
          );
          AllStatus.updateOne(
            { region: '경남' },
            { total: num },
            (err, docs) => {
              if (err) {
                console.error(err);
              } else {
                console.log(docs.n + ' Gyeongnam updated');
              }
            }
          );
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error(error);
      }
    }
  );
};

module.exports.GyeongnamCity = function updateTotal() {
  request(
    'http://xn--19-q81ii1knc140d892b.kr/main/main.do',
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        try {
          const $ = cheerio.load(html);
          const box = $('div.table.type1.pt10');
          data = box.find('th').each(function (i, elem) {
            let query = $(this).text();
            let num = parseInt(box.find('td').eq(i).text());
            AllStatus.updateOne(
              { region: query },
              { total: num },
              (err, docs) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(docs.n + ` ${query} updated`);
                }
              }
            );
          });
        } catch (err) {
          console.error(err);
        }
      }
    }
  );
};

// module.exports.Gyeongsan = function updateTotal() {
//   request(
//     'http://gbgs.go.kr/programs/corona/corona.do',
//     (error, response, html) => {
//       if (!error && response.statusCode == 200) {
//         try {
//           const $ = cheerio.load(html);
//           const dashboard = $('li.col.col4');
//           const num = parseInt(dashboard.find('li').eq(0).find('span').text());
//           AllStatus.updateOne(
//             { region: '경산' },
//             { total: num },
//             (err, docs) => {
//               if (err) {
//                 console.error(err);
//               } else {
//                 console.log(docs.n + ' Gyeongsan updated');
//               }
//             }
//           );
//         } catch (err) {
//           console.error(err);
//         }
//       }
//     }
//   );
// };
