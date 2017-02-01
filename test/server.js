// this express server serves static files, which can make certain demos easier to test

var express = require('express')
var app = express()

app.use(express.static('/'))
app.use(express.static('../'))

var server = app.listen(5000 || process.env.PORT, () => {
  console.log('Server running on port: ' + server.address().port)
})
