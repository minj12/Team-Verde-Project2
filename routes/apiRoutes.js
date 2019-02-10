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
      res.redirect(
        "/home/" +
          req.user.profile.id +
          "/" +
          req.user.profile.name.givenName +
          req.user.profile.name.familyName
      );
    }
  );
  app.get("/home/:id/:name", (req, res) => {
    let userId = req.params.id;
    let name = req.params.name;
    db.Post.findAll({
      order: [["vote", "DESC"]]
    }).then(result => {
      res.render("home", {
        posts: result,
        userId: userId,
        thisUserName: name
      });
    });
  });

  app.get("/home/:id", (req, res) => {
    let userId = req.params.id;
    db.Post.findAll({
      order: [["vote", "DESC"]]
    }).then(result => {
      res.render("home", {
        posts: result,
        thisUserId: userId
      });
    });
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
    //search the Likes table if this post and user are exist
    db.Likes.findOne({
      where: {
        userId: userId,
        postId: postId
      }
    })
      .then(result => {
        //if the user and post are exist and there is no like or dislike for the post
        if (!result.isLiked && !result.disLiked) {
          //then make isLike as true
          res.redirect("/api/like/" + result.id);
          //else if the user already liked the post 
        } else if (result.isLiked) {
          //just reset the isLiked and disLiked to false
          db.Likes.update(
            {
              isLiked: false,
              disLiked: false
            },
            {
              where: {
                userId: userId,
                postId: postId
              }
            }
          ).then(() => {
            //then decrement the vote
            res.redirect("/api/decrement/" + postId);
          });
          //if the post is already disliked by the user
        } else if (result.disLiked) {
          //then just reset liked and disliked to false
          db.Likes.update(
            {
              isLiked: false,
              disLiked: false
            },
            {
              where: {
                userId: userId,
                postId: postId
              }
            }
          ).then(() => {
            //and then increment the post votes
            res.redirect("/api/increment/" + postId);
          });
        }
      })
      .catch(() => {
        //if the post is not found in the Likes table then create it
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
        if (!result.isLiked && !result.disLiked) {
          res.redirect("/api/dislikes/" + result.id);
        } else if (result.isLiked) {
          db.Likes.update(
            {
              isLiked: false,
              disLiked: false
            },
            {
              where: {
                userId: userId,
                postId: postId
              }
            }
          ).then(() => {
            res.redirect("/api/decrement/" + postId);
          });
        } else if (result.disLiked) {
          db.Likes.update(
            {
              isLiked: false,
              disLiked: false
            },
            {
              where: {
                userId: userId,
                postId: postId
              }
            }
          ).then(() => {
            res.redirect("/api/increment/" + postId);
          });
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
      { isLiked: true, disLiked: false },
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
      { isLiked: false, disLiked: true },
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
