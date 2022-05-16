const express = require('express');
const fs = require('fs')
var util = require('util')
const app = express()
const port = 3000
const config = require('/home/tms/MagicMirror/config/config.js')

const modules = config['modules'];
console.log(modules[5]['config']['location'])

app.get('/', (req, res) => {
  res.send('MMM-API welcomes you! \n Please, check the readme at www.github.com/tmsBodnar/MMM-API#readme')
})

app.get('/modules', (req, res) => {
    res.send(modules);
  })

app.post('/modules/:moduleIndx/:position', (req, res) => {
    config['modules'][req.params['moduleIndx']]['position'] = req.params['position'];
    fs.writeFileSync('/home/tms/MagicMirror/config/config.js', 'let config = ' + util.inspect(config) , 'utf-8')

  //  fs.writeFile("/home/tms/MagicMirror/config/config.js", configJSON, 'utf8', function (err) {
    //  if (err) {
      //    console.log("An error occured while writing JSON Object to File.");
        //  return console.log(err);
     // }
   
      console.log("JSON file has been saved.");
//  });
  res.send(config['modules'][req.params['moduleIndx']]);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})