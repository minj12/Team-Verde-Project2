module.exports = function(sequelize, DataTypes) {
  var Likes = sequelize.define(
    "Likes",
    {
      userId: DataTypes.STRING,
      postId: DataTypes.STRING,
      isLiked: DataTypes.BOOLEAN,
      disLiked: DataTypes.BOOLEAN
    },
    {
      freezeTableName: true
    }
  );
  return Likes;
};
