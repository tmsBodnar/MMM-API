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
  const readedConfig = fs.readFileSync(configPath, 'utf8'); 
  const jsonConfig = readedConfig.slice(readedConfig.indexOf('{'), readedConfig.length);
  console.log(jsonConfig);
  res.send(jsonConfig);
})

app.put('/api/config', (req, res) => {
  let config = req.body;
  fs.writeFileSync(configPath, 'let config = ' + JSON.stringify(config) , 'utf-8')
  fs.readFile(configPath, (err, data) => {
    res.send(data);
  })

});