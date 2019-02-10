
module.exports = function(app) {
  app.get("/submit/:id/:author", (req, res) => {
    let userId = req.params.id;
    let name = req.params.author;
    res.render("submit", { userId: userId, thisUserName: name });
  });
  app.post("/api/posts/:id/:name", function(req, res) {
    db.Post.create(req.body).then(function(dbPost) {
      res.render("home", {
        posts: dbPost,
        thisUserId: req.params.id,
        thisUserName: req.params.name
      });
    });
  });
  app.get("/contact/:id/:author", (req, res) => {
    let userId = req.params.id;
    let name = req.params.author;
    res.render("contact", { userId: userId, thisUserName: name });
  });
};
