import { find, filter } from 'lodash';
import { pubsub } from './subscriptions';

var spawn = require("child_process").spawnSync;
var fs = require('fs');

const cars = [
  { id: 1, title: 'My car!', url: 'http://sandiego.craigslist.org/csd/cto/5967906011.html', percent_above_kbb: 10, thumbnail: 'https://images.craigslist.org/00303_1ZpjUWNJmMe_600x450.jpg', year: 2002, odometer: 120500 },
  { id: 2, title: 'My Second car!', url: 'http://sandiego.craigslist.org/csd/cto/5967906011.html', percent_above_kbb: 5, thumbnail: 'https://images.craigslist.org/00303_1ZpjUWNJmMe_600x450.jpg', year: 1998, odometer: 200700 }
];

const resolveFunctions = {
  Query: {
    cars(_, { make, model }) {
      console.log(make);
      console.log(model);
      // var res = spawn('/usr/bin/python',["/home/joshg111/Projects/craigslist_kbb/driver.py", "toyota+camry"], {timeout: 300000});
      // console.log(res)
      var out = fs.readFileSync("/home/joshg111/Projects/craigslist_kbb/items.jl", "utf8")
      console.log(out)
      var re = /(.*)\n/g;
      var m;
      var res = [];
      do {
          m = re.exec(out);
          if (m) {
              var myobj = JSON.parse(m[1])
              console.log(m[1]);
              res.push(myobj);
              console.log(myobj.year)
          }
      } while (m);

      var arrayLength = res.length;
      for (var i = 0; i < arrayLength; i++) {
          console.log(i);
          console.log(res[i]);
      }

      return res;
    },
  },
};

export default resolveFunctions;
