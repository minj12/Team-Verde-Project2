$(document).ready(function() {
  let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dh7ooikgx/image/upload";
  let CLOUDINARY_UPLOAD_PERSET = "clixcvin";
  let IMAGE_URL = "";
  let mediaType = "";
  let thisUserId = $("#this_user").val();

  $("#file-upload").on("change", function(event) {
    let file = event.target.files[0];
    console.log(file);
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PERSET);

    axios({
      url: CLOUDINARY_URL,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: formData
    })
      .then(function(res) {
        console.log(res);
        IMAGE_URL = res.data.secure_url;
      })
      .catch(function(err) {
        console.error(err);
      });
  });
  $(".create-form").on("submit", function(e) {
    e.preventDefault();
    if (IMAGE_URL === "") {
      return;
    }
    console.log(IMAGE_URL);
    console.log(thisUserId);
    let newPost = {
      author: $("#author").val(),
      body: $("#caption")
        .val()
        .trim(),
      image: IMAGE_URL,
      vote: 0,
      userId: thisUserId
    };
    console.log(newPost);
    $.ajax("/api/posts/" + thisUserId + "/" + newPost.author, {
      type: "POST",
      data: newPost
    }).then(() => {
      location.reload();
    });
  });
});
