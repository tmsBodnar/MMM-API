const express = require('express');
const fs = require('fs')
const cors = require('cors')
const app = express()
const port = 3000
const configPath = '/home/tms/MagicMirror/config/config.js'
app.use(express.json())
app.use(cors())


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

app.get('/api', (req, res) => {
  res.send('MMM-API welcomes you! \n Please, check the readme at www.github.com/tmsBodnar/MMM-API#readme')
})

app.get('/api/config', (req, res) => {
  configJSON = fs.readFileSync(configPath, 'utf8'); 
  const r = configJSON.slice(configJSON.indexOf('{'), configJSON.length);
  console.log(r);
  res.send(r);
})

app.put('/api/config', (req, res) => {
  let conf = req.body;
  fs.writeFileSync(configPath, 'let config = ' + JSON.stringify(conf) , 'utf-8')
  fs.readFile(configPath, (err, data) => {
    res.send(data);
  })
  
});