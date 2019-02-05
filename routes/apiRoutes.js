var db = require("../models"),
  Sequelize = require("sequelize"),
  authKey = require("../auth/auth_info"),
  passport = require("passport"),
  auth = require("../auth/auth"),
  cookieParser = require("cookie-parser"),
  cookieSession = require("cookie-session");
auth(passport);
module.exports = function(app) {
  app.use(passport.initialize());

  app.use(
    cookieSession({
      name: "session",
      keys: [authKey.encKey],
      maxAge: 24 * 60 * 60 * 1000
    })
  );
  app.use(cookieParser());
  app.get("/", (req, res) => {
    if (req.session.token) {
      res.cookie("token", req.session.token);
      res.render("home");
    } else {
      res.cookie("token", "");
      res.render("signin");
    }
  });

  app.get("/logout", (req, res) => {
    req.logout();
    req.session = null;
    res.redirect("/");
  });

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["https://www.googleapis.com/auth/userinfo.profile"]
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/"
    }),
    (req, res) => {
      req.session.token = req.user.token;
      res.redirect("/home/" + req.user.profile.id);
    }
  );
  app.get("/home/:id", (req, res) => {
    let userId = req.params.id;
    db.Post.findAll({
      order: [["vote", "DESC"]]
    }).then(result => {
      res.render("home", { posts: result, thisUserId: userId });
    });
  });
  app.get("/submit/:id", (req, res) => {
    let userId = req.params.id;
    res.render("submit", { userId: userId });
  });
  app.post("/api/posts/:id", function(req, res) {
    db.Post.create(req.body).then(function(dbPost) {
      res.render("home", { posts: dbPost, thisUserId: req.params.id });
    });
  });
  app.get("/contact/:id", (req, res) => {
    let userId = req.params.id;
    res.render("contact", { userId: userId });
  });
  app.get("/api/increment/:id", function(req, res) {
    db.Post.update(
      { vote: Sequelize.literal("vote + 1") },
      { where: { id: req.params.id } }
    ).then(() => {
      res.status(200).end();
    });
  });
  app.get("/api/decrement/:id", function(req, res) {
    db.Post.update(
      { vote: Sequelize.literal("vote - 1") },
      { where: { id: req.params.id } }
    ).then(() => {
      res.status(200).end();
    });
  });
  app.post("/api/like/", (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;
    db.Likes.findOne({
      where: {
        userId: userId,
        postId: postId
      }
    })
      .then(result => {
        if (!result.isLiked) {
          res.redirect("/api/like/" + result.id);
        } else {
          res.status(200).end();
        }
      })
      .catch(() => {
        db.Likes.create(req.body).then(() => {
          res.redirect("/api/increment/" + postId);
        });
      });
  });
  app.post("/api/dislike/", (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;
    db.Likes.findOne({
      where: {
        userId: userId,
        postId: postId
      }
    })
      .then(result => {
        if (result.isLiked) {
          res.redirect("/api/dislikes/" + result.id);
        } else {
          res.status(200).end();
        }
      })
      .catch(() => {
        db.Likes.create(req.body).then(() => {
          res.redirect("/api/decrement/" + postId);
        });
      });
  });
  app.get("/api/like/:id", (req, res) => {
    let id = req.params.id;
    db.Likes.update(
      { isLiked: true },
      {
        where: {
          id: id
        }
      }
    ).then(() => {
      db.Likes.findById(id).then(data => {
        console.log("like " + data.postId);
        res.redirect("/api/increment/" + data.postId);
      });
    });
  });
  app.get("/api/dislikes/:id", (req, res) => {
    let id = req.params.id;
    db.Likes.update(
      { isLiked: false },
      {
        where: {
          id: id
        }
      }
    ).then(() => {
      db.Likes.findById(id).then(data => {
        console.log("dislike " + data.postId);
        res.redirect("/api/decrement/" + data.postId);
      });
    });
  });
  app.get("/api/likedby/:id", (req, res) => {
    db.Likes.findAll({
      where: {
        userId: req.params.id
      }
    }).then(result => {
      res.json(result);
    });
  });
};
