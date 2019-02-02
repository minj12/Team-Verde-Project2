var db = require("../models");

module.exports = function(app) {
  app.get("/", function(req, res) {
    db.Example.findAll({
      order: sequelize.literal('vote DESC')
    }).then(function(dbPost) {
      res.render("index", {
        posts: dbPost
      });
    });
  });
app.get('/create',(req, res) => {
  res.render('Views/create');
})

  app.get("*", function(req, res) {
    res.render("404");
  });
};
