import { find, filter } from 'lodash';
import { pubsub } from './subscriptions';

var spawn = require("child_process").spawnSync;
var fs = require('fs');
var path = require('path')

const cars = [
  { id: 1, title: 'My car!', url: 'http://sandiego.craigslist.org/csd/cto/5967906011.html', percent_above_kbb: 10, thumbnail: 'https://images.craigslist.org/00303_1ZpjUWNJmMe_600x450.jpg', year: 2002, odometer: 120500 },
  { id: 2, title: 'My Second car!', url: 'http://sandiego.craigslist.org/csd/cto/5967906011.html', percent_above_kbb: 5, thumbnail: 'https://images.craigslist.org/00303_1ZpjUWNJmMe_600x450.jpg', year: 1998, odometer: 200700 }
];

const a = `{'body': '[{"cylinders": 4, "percent_above_kbb": "12%", "good_condition_price": 6958, "url": "http://sandiego.craigslist.org/csd/cto/5988409640.html", "make": "toyota", "id": 25, "price": 7800, "location": " (SDSU Area)", "kbb_url": "http://www.kbb.com/toyota/camry/2010/sedan-4d/?vehicleid=249074&intent=buy-used&category=sedan&condition=good&mileage=76000&pricetype=private-party&printable=true", "year": "2010", "model": ["camry", "le"], "odometer": 76000, "type": "sedan", "thumbnail": "https://images.craigslist.org/00M0M_8IGfqhwHeXo_600x450.jpg", "condition": "like", "desc": "2010 toyota camry le"}]', 'statusCode': 200}`;

const f = `{"body": [{"cylinders": 6, "percent_above_kbb": "-35", "good_condition_price": 3903, "url": "http://sandiego.craigslist.org/csd/cto/5945414116.html", "make": "Toyota", "id": 2, "price": 2500, "location": " (Balboa ave)", "kbb_url": "http://www.kbb.com/toyota/camry/2006/sedan-4d/?vehicleid=1578&intent=buy-used&condition=good&mileage=130000&pricetype=private-party&printable=true", "year": "2006", "model": ["Camry"], "odometer": 130000, "thumbnail": "https://images.craigslist.org/00d0d_cGwFzQEEbTc_600x450.jpg", "condition": "good", "desc": "2006 Toyota Camry"}, {"cylinders": 4, "percent_above_kbb": "12", "good_condition_price": 6958, "url": "http://sandiego.craigslist.org/csd/cto/5988409640.html", "make": "toyota", "id": 30, "price": 7800, "location": " (SDSU Area)", "kbb_url": "http://www.kbb.com/toyota/camry/2010/sedan-4d/?vehicleid=249074&intent=buy-used&category=sedan&condition=good&mileage=76000&pricetype=private-party&printable=true", "year": "2010", "model": ["camry", "le"], "odometer": 76000, "type": "sedan", "thumbnail": "https://images.craigslist.org/00M0M_8IGfqhwHeXo_600x450.jpg", "condition": "like", "desc": "2010 toyota camry le"}, {"cylinders": 4, "percent_above_kbb": "8", "good_condition_price": 9193, "url": "http://sandiego.craigslist.org/csd/cto/5974243527.html", "make": "toyota", "id": 28, "price": 10000, "location": " (El Cajon)", "kbb_url": "http://www.kbb.com/toyota/camry/2011/sedan-4d/?vehicleid=352787&intent=buy-used&category=sedan&condition=good&mileage=41000&pricetype=private-party&printable=true", "year": "2011", "model": ["camry", "le"], "odometer": 41000, "type": "sedan", "thumbnail": "https://images.craigslist.org/00G0G_1fnb5bEII1z_600x450.jpg", "condition": "excellent", "desc": "2011 toyota camry le"}, {"cylinders": 4, "percent_above_kbb": "3", "good_condition_price": 10103, "url": "http://sandiego.craigslist.org/csd/cto/5979142731.html", "make": "TOYOTA", "id": 23, "price": 10500, "location": " (San Diego)", "kbb_url": "http://www.kbb.com/toyota/camry/2012/l-sedan-4d/?vehicleid=370422&intent=buy-used&category=sedan&condition=good&mileage=50784&pricetype=private-party&printable=true", "year": "2012", "model": ["CAMRY", "LE", "2012"], "odometer": 50784, "type": "sedan", "thumbnail": "https://images.craigslist.org/00808_lbJG2IpLein_600x450.jpg", "condition": "excellent", "desc": "2012 TOYOTA CAMRY LE 2012"}, {"cylinders": 6, "percent_above_kbb": "8", "good_condition_price": 3217, "url": "http://sandiego.craigslist.org/ssd/cto/5985354099.html", "make": "Toyota", "id": 17, "price": 3499, "location": " (Rialto ca)", "kbb_url": "http://www.kbb.com/toyota/camry/2003/le-sedan-4d/?vehicleid=3160&intent=buy-used&condition=good&mileage=135000&pricetype=private-party&printable=true", "year": "2003", "model": ["Camry", "SE"], "odometer": 135000, "thumbnail": "https://images.craigslist.org/00c0c_kTQB9bE43bx_600x450.jpg", "desc": "2003 Toyota Camry SE"}, {"cylinders": 4, "percent_above_kbb": "-19", "good_condition_price": 5596, "url": "http://sandiego.craigslist.org/nsd/cto/5969096922.html", "make": "Toyota", "id": 21, "price": 4500, "location": " (Carlsbad)", "kbb_url": "http://www.kbb.com/toyota/camry/2007/ce-sedan-4d/?vehicleid=84279&intent=buy-used&condition=good&mileage=90000&pricetype=private-party&printable=true", "year": "2007", "model": ["Camry"], "odometer": 90000, "thumbnail": "https://images.craigslist.org/00k0k_f7h1TUAzrbe_600x450.jpg", "condition": "excellent", "desc": "2007 Toyota Camry"}, {"cylinders": 4, "percent_above_kbb": "0", "good_condition_price": 3195, "url": "http://sandiego.craigslist.org/ssd/cto/5989196689.html", "make": "toyota", "id": 15, "price": 3195, "location": " (San Diego)", "kbb_url": "http://www.kbb.com/toyota/camry/2003/le-sedan-4d/?vehicleid=3160&intent=buy-used&condition=good&mileage=136000&pricetype=private-party&printable=true", "year": "2003", "model": ["camry", "le"], "odometer": 136000, "thumbnail": "https://images.craigslist.org/00909_cmtko1j83y6_600x450.jpg", "condition": "good", "desc": "2003 toyota camry le"}, {"percent_above_kbb": "7", "good_condition_price": 9242, "url": "http://sandiego.craigslist.org/csd/cto/5965538325.html", "make": "toyota", "id": 19, "price": 9900, "location": " (San Diego)", "kbb_url": "http://www.kbb.com/toyota/camry/2012/l-sedan-4d/?vehicleid=370422&intent=buy-used&condition=good&mileage=71000&pricetype=private-party&printable=true", "year": "2012", "model": ["camry"], "odometer": 71000, "thumbnail": "https://images.craigslist.org/00404_j1oT1SsQlhF_600x450.jpg", "condition": "excellent", "desc": "2012 toyota camry"}], "statusCode": 200}`;

const resolveFunctions = {
  Query: {
    cars(_, { make, model }) {
      console.log(make);
      console.log(model);
      var dir = path.resolve(process.cwd(), '../craigslist_kbb');
      var res = spawn('/usr/bin/python',["handler.py", make + '+' + model], {timeout: 300000, encoding: 'utf8', cwd: dir});
      // res = res["stdout"]
      // var res = f
      res = res["stdout"];
      console.log(res);
      res = res.replace(/^'(.*)'$/, '$1');
      console.log(res);
      console.log("\n\nOUTPUT COMPLETE\n\n");
      //console.log(res["stdout"].toString('utf8'))

      var myobj = JSON.parse(res)
      myobj = myobj["body"]
      myobj.sort(function(a, b) {
          return parseFloat(a.percent_above_kbb) - parseFloat(b.percent_above_kbb);
      });
      return myobj;

      // var out = fs.readFileSync("/home/joshg111/Projects/craigslist_kbb/items.jl", "utf8")
      // // console.log(out)
      // var re = /(.*)\n/g;
      // var m;
      // var res = [];
      // do {
      //     m = re.exec(out);
      //     if (m) {
      //         var myobj = JSON.parse(m[1])
      //         console.log(m[1]);
      //         res.push(myobj);
      //         console.log(myobj.year)
      //     }
      // } while (m);
      //
      // var arrayLength = res.length;
      // for (var i = 0; i < arrayLength; i++) {
      //     // console.log(i);
      //     // console.log(res[i]);
      // }
      //
      // return res;
    },
  },
};

export default resolveFunctions;
