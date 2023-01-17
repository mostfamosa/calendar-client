import $ from "jquery";
import { initRouter } from "./router";
import { openConnection } from "./sockets";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/_custom.scss";

$(() => {
  initRouter();

  $(document).ready(function () {
    if (sessionStorage.length > 1) {
      $("header .me .name").text("Hi, " + sessionStorage.currentUser);
      $("header .city").text(sessionStorage.city);
      $("header .time").text(calcTime(sessionStorage.zoneDiff));
      $("body").addClass("loggedin");
      openConnection();
    }
  });
});

function time() {
  $("header .time").text(calcTime(sessionStorage.zoneDiff));
}
setInterval(time, 1000);

function calcTime(offset) {
  // create Date object for current location
  var d = new Date();

  // convert to msec
  // subtract local time zone offset
  // get UTC time in msec
  var utc = d.getTime() + d.getTimezoneOffset() * 60000;

  // create new Date object for different city
  // using supplied offset
  var nd = new Date(utc + 3600000 * offset);
  //ParseDateTime( nd.toLocaleString(), "yyyy-mm-ddThh:mm:ss");
  var nd2 = new Date(nd);
  nd2.setHours(nd.getHours());
  sessionStorage.setItem("currentTime", nd2.toJSON());

  // return time as a string
  return nd.toLocaleString();
}

// --------------------------- previous ---------------------

// // insert dynamic html at different html files
// $(function () {
//   var includes = $("[data-include]");
//   $.each(includes, function () {
//     // var file = "views/" + $(this).data("include") + ".html";
//     var file = "blocks/" + $(this).data("include") + ".html";
//     console.log(file);

//     $(this).load(file);
//   });
// });

// // see password
// const pwShowHide = document.querySelectorAll(".eye-icon");
// pwShowHide.forEach((eyeIcon) => {
//   eyeIcon.addEventListener("click", () => {
//     let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll('input[type="password"]');
//     pwFields.forEach((password) => {
//       if (password.type === "password") {
//         password.type = "text";
//         eyeIcon.classList.replace("bx-hide", "bx-show");
//         return;
//       }
//       password.type = "password";
//       eyeIcon.classList.replace("bx-show", "bx-hide");
//     });
//   });
// });
