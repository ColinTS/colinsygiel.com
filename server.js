let express = require("express");
let app = express();
var path = require("path");

app.use(express.static(__dirname));

// set up the template engine
app.set("views", "./views");
app.set("view engine", "pug");

// GET response for '/'
app.get("/", function(req, res) {
  // render the 'index' template, and pass in a few variables
  res.sendFile(path.join(__dirname + "/index.html"));
});

// start up the server
app.listen(3000, function() {
  console.log("Listening on http://localhost:3000");
});
