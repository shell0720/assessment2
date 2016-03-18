var express = require("express");
var router = express.Router();
var pg = require('pg');
var random = require("./random");

var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/zoo';
}

router.post('/', function (req, res) {
  console.log('body: ', req.body);
  var animal_name = req.body.animal_name;
  var animal_count = req.body.animal_count;

  // connect to DB
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('INSERT INTO animal (animal_name, animal_count) VALUES ($1, $2) ' +
      'RETURNING id, animal_name, animal_count', [animal_name, animal_count]);

      query.on('row', function (row) {
        result.push(row);
      });

      query.on('end', function () {
        done();
        res.send(result);
      });

      query.on('error', function (error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});


router.get('/', function (req, res) {
  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];
      var query = client.query('SELECT * FROM animal;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  })
});

router.get("/count", function(req,res){
  res.send(random(1,100).toString());

});

module.exports = router;
