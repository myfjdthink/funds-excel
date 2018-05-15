import { Injectable } from '@nestjs/common';
import * as request from 'superagent';
import * as moment from 'moment';
import * as Excel from 'exceljs';

const DateTypes = {
  year3: '3nzf',
};

@Injectable()
export class AppService {
  async downExcel() {
    const workbook = new Excel.Workbook();
    workbook.creator = 'Nick';
    workbook.lastModifiedBy = 'Nick';
    workbook.created = new Date();
    workbook.modified = new Date();

    const sheet3year = workbook.addWorksheet('近3年');
    // sheet3year.columns = [
    //   {header: 'Id', key: 'id', width: 10},
    //   {header: 'Name', key: 'name', width: 32},
    //   {header: 'D.O.B.', key: 'DOB', width: 10, outlineLevel: 1}
    // ]
    // sheet3year.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7)})
    await this.buildSheet(sheet3year);
    const filePath = `./download/基金列表${moment().format('YYYY-MM-DD')}.xlsx`;
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  }

  async buildSheet(sheet3year) {
    // 比较	序号	基金
    // 代码	基金简称	日期	单位净值	累计净值	日增长率	近1周	近1月	近3月	近6月	近1年	近2年	近3年
    const headers = [
      { header: '基金代码', key: 'code', width: 10 },
      { header: '基金简称', key: 'name', width: 10 },
      { header: '日期', key: 'date', width: 10 },
      { header: '累计净值', key: 'count', width: 10 },
      { header: '日增长率', key: 'day', width: 10 },
      { header: '近1周', key: 'week', width: 10 },
      { header: '近1月', key: 'month1', width: 10 },
      { header: '近3月', key: 'month3', width: 10 },
      { header: '近6月', key: 'month6', width: 10 },
      { header: '近1年', key: 'year1', width: 10 },
      { header: '近2年', key: 'year2', width: 10 },
      { header: '近3年', key: 'year3', width: 10 },
    ];
    sheet3year.columns = headers;
    const data1 = await this.downData(1);
    const data2 = await this.downData(2);
    for (let strs of data1.concat(data2)) {
      let row = {
        code: strs[0],
        name: strs[1],
        date: strs[3],
        count: strs[4],
        day: strs[6],
        week: strs[7],
        month1: strs[8],
        month3: strs[9],
        month6: strs[10],
        year1: strs[11],
        year2: strs[12],
        year3: strs[13],
      };
      sheet3year.addRow(row);
    }
  }

  async downData(page): Promise<Array<Array<string>>> {
    const query = {
      op: 'ph',
      dt: 'kf',
      ft: 'hh',
      rs: '',
      gs: 0,
      sc: DateTypes.year3,
      st: 'desc',
      sd: moment()
        .add(-1, 'year')
        .format('YYYY-MM-DD'),
      ed: moment().format('YYYY-MM-DD'),
      qdii: '',
      tabSubtype: ',,,,,',
      pi: page || 1,
      pn: 50,
      dx: 1,
      v: 0.5359978653815238,
    };

    console.log('query', query);

    const headers = {
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6',
      Connection: 'keep-alive',
      Cookie:
        'st_pvi=03467434526022; st_si=84587009112246; ASP.NET_SessionId=cahimgbsy4wgj41lh2nl1xqy',
      Host: 'fund.eastmoney.com',
      Referer: 'http://fund.eastmoney.com/data/fundranking.html',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
    };

    const res = await request
      .get('http://fund.eastmoney.com/data/rankhandler.aspx')
      .set(headers)
      .query(query);

    const data = JSON.parse(res.text.match(/\[.*\]/)[0]) as Array<string>;
    const funds = data.map(str => {
      return str.split(',');
    });
    return funds;
  }
}
