const express = require('express');
const fs = require('fs');
const hbs = require('hbs');

let app = express();

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentDate', () => {
  return new Date().getFullYear();
});

app.set('view engine', 'hbs');

app.use((req, res, next) => {
  let now = new Date().toString();
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let log = `${now}\t${ip}\t${req.method}\t${req.url}`;
  fs.appendFile('access.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to access.log');
    }
  });
  next();
});

//Maintance
app.use((req, res, next) => {
  res.render('maintenance.hbs');
  console.log(req.query.mod);
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home.hbs', {
    title: 'Home Page',
    status: 'Welcome',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    title: 'About Page',
  });
});

let port = 80;
let host = '127.0.0.1';
app.listen(port, host, () => {
  console.log(`starting app at ${host}:${port}`);
});

