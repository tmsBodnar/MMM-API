const express = require('express');
const fs = require('fs')
const app = express()
const port = 3000
const configPath = '/home/tms/MagicMirror/config/config.js'
app.use(express.json())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

app.get('/', (req, res) => {
  res.send('MMM-API welcomes you! \n Please, check the readme at www.github.com/tmsBodnar/MMM-API#readme')
})

app.get('/config', (req, res) => {
  fs.readFile(configPath, (err, data) => {
    res.send(data);
  })
})

app.put('/config', (req, res) => {
  let conf = req.body;
  fs.writeFileSync(configPath, 'let config = ' + JSON.stringify(conf) , 'utf-8')
  fs.readFile(configPath, (err, data) => {
    res.send(data);
  })
  
});