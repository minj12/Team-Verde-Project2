$(document).ready(function() {
  let thisUserId = $("#user_id").val();
  $.ajax("/api/likedby/" + thisUserId, {
    type: "GET"
  }).then(result => {
    console.log(result);
    for (var i = 0; i < result.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (result[i].postId == parseInt($(`#${i + 1}-up`).data("post_id"))) {
        if (result[i].isLiked) {
          $(`#${i + 1}-up`).css("color", "red");
          $(`#${i + 1}-down`).css("color", "black");
        } else {
          $(`#${i + 1}-up`).css("color", "black");
          $(`#${i + 1}-down`).css("color", "red");
        }
      } else {
        $(`#${i + 1}-up`).css("color", "black");
        $(`#${i + 1}-down`).css("color", "black");
      }
    }
  });
  $(".create-form").on("submit", function(e) {
    e.preventDefault();
    let newPost = {
      author: $("#author")
        .val()
        .trim(),
      body: $("#caption")
        .val()
        .trim(),
      image: $("#image_url")
        .val()
        .trim(),
      vote: 0,
      userId: thisUserId
    };
    $.ajax("/api/posts/" + thisUserId, {
      type: "POST",
      data: newPost
    }).then(() => {
      location.reload();
    });
  });
  $(".like").on("click", function() {
    let postId = $(this).data("post_id");
    let newLike = {
      userId: thisUserId,
      postId: postId,
      isLiked: true
    };
    $.ajax("/api/like/", {
      type: "POST",
      data: newLike
    }).then(() => {
      location.reload();
    });
  });
  $(".dislike").on("click", function() {
    let postId = $(this).data("post_id");
    let newLike = {
      userId: thisUserId,
      postId: postId,
      isLiked: false
    };
    $.ajax("/api/dislike/", {
      type: "POST",
      data: newLike
    }).then(() => {
      location.reload();
    });
  });
});
