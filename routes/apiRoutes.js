var db = require("../models");

module.exports = function(app) {

  // Create a new example
  app.post("/api/posts", function(req, res) {
    db.Post.create(req.body).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  app.put("/api/increment/:id", function(req, res) {
    let data = req.body.data;
    db.Post.increment(
      ['field', `1`],
       { 
         where: { id: req.params.id } 
        }
       );
});
app.put("/api/decrement/:id", function(req, res) {
  let data = req.body.data;
  db.Post.decrement(
    ['field', `1`],
     { 
       where: { id: req.params.id } 
      }
     );
});
}