$(document).ready(function() {
  let thisUserId = $("#user_id").val();
  $.ajax("/api/likedby/" + thisUserId, {
    type: "GET"
  }).then(result => {
    console.log(result);
    for (var i = 0; i < result.length; i++) {
      // eslint-disable-next-line eqeqeq

      if (result[i].isLiked) {
        console.log(result[i].isLiked);
        $(`#${result[i].postId}-up`).css("color", "red");
        $(`#${result[i].postId}-down`).css("color", "black");
      } else if (result[i].disLiked) {
        $(`#${result[i].postId}-up`).css("color", "black");
        $(`#${result[i].postId}-down`).css("color", "red");
      } else {
        $(`#${result[i].postId}-up`).css("color", "black");
        $(`#${result[i].postId}-down`).css("color", "black");
      }
    }
  });
  $(".like").on("click", function() {
    let postId = $(this).data("post_id");
    let newLike = {
      userId: thisUserId,
      postId: postId,
      isLiked: true,
      disLiked: false
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
      isLiked: false,
      disLiked: true
    };
    $.ajax("/api/dislike/", {
      type: "POST",
      data: newLike
    }).then(() => {
      location.reload();
    });
  });
});
