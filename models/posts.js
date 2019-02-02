module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    author: DataTypes.STRING,
    body: DataTypes.STRING,
    image:DataTypes.STRING,
    vote: DataTypes.INTEGER,
  },{
    freezeTableName: true
  });
  return Post;
};
