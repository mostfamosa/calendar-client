import $ from "jquery";
import { createUser, login, loginGithub } from "./rest";
import { clientAddres } from "../constants";
import { updateZone } from "../utils";
import { openConnection } from "../sockets";

const initRegistration = () => {
  console.log("init registration ");
  $("body").addClass("signup");

  $(document)
    .off("click")
    .on("click", "#btnSignup", function () {
      // remove previous eventHandker
    });

  $(document).on("click", "body.signup #btnSignup", async (event) => {
    console.log("registration");
    event.preventDefault();

    const user = {
      email: $(".form-floating #email").val(),
      name: $(".form-floating #name").val(),
      password: $(".form-floating #password").val(),
    };

    console.log(user);
    const res = await createUser(user);
    console.log(res);

    if (res.status == 200) {
      // $("#modalResponse").modal("show");
      $(".modal-title").text("Registration");
      $(".modal-body").text("Registration successfull!");

      $(document).on("click", "body.signup #responseModalCloseBtn", function (event) {
        window.location.replace(`${clientAddres}/login`);
      });
    } else {
      // $("#modalResponse").modal("show");
      $(".modal-title").text("Registration failed");
      $(".modal-body").text(res.response.data.message);
    }
  });
};

const initLogin = () => {
  console.log("init login");
  $("body").addClass("login");

  $(document)
    .off("click")
    .on("click", "#btnLogin", function () {
      // remove previous eventHandker
    });

  $(document).on("click", "#btnLogin", async function (event) {
    console.log("login");
    event.preventDefault();

    const user = {
      email: $(".form-floating #email").val(),
      password: $(".form-floating #password").val(),
    };
    const email = $(".form-floating #email").val();
    const password = $(".form-floating #password").val();

    const res = await login(user);
    console.log(res);

    if (res.status == 200) {
      // $("#modalResponse").modal("show");
      $(".modal-title").text("Log In success");
      $(".modal-body").text("Log In successfull!");

      sessionStorage.setItem("userId", res.data.data.userId);
      sessionStorage.setItem("token", res.data.data.token);
      sessionStorage.setItem("currentUser", res.data.data.name);
      sessionStorage.setItem("city", res.data.data.city);
      sessionStorage.setItem("email", res.data.data.email);
      $("header .me .name").text("Hi, " + sessionStorage.currentUser);
      $("header .city").text(sessionStorage.city);
      $("body").addClass("loggedin");

      updateZone(sessionStorage.city);
      openConnection();
      await new Promise((r) => setTimeout(r, 2000));
      window.location.replace(`${clientAddres}/calendar`);
    } else {
      // $("#modalResponse").modal("show");
      $(".modal-title").text("Log In failed");
      $(".modal-body").text(res.response.data.message);
    }
  });

  $(document).on("click", "body.login.loggedin #responseModalCloseBtn", function (event) {
    window.location.replace(`${clientAddres}/calendar`);
  });
};

const initGithub = async () => {
  console.log("initGithub");

  const location = window.location.href;

  if (location.includes("code")) {
    location.replace("/?", "/");
    console.log(location);
    var url = new URL(location);
    const code = url.searchParams.get("code");
    console.log(code);

    const res = await loginGithub(code);
    console.log(res);

    if (res.status == 200) {
      alert("github success");

      sessionStorage.setItem("userId", res.data.data.userId);
      sessionStorage.setItem("token", res.data.data.token);
      sessionStorage.setItem("currentUser", res.data.data.name);
      sessionStorage.setItem("city", res.data.data.city);
      sessionStorage.setItem("email", res.data.data.email);
      $("header .me .name").text("Hi, " + sessionStorage.currentUser);
      $("header .city").text(sessionStorage.city);
      $("body").addClass("loggedin");

      updateZone(sessionStorage.city);
      openConnection();
      // $("#modalResponse").modal("show");
      // $(".modal-title").text("Log In Github");
      // $(".modal-body").text("Log In with Github successfull!");
    } else {
      alert("github fail");
      // $("#modalResponse").modal("show");
      // $(".modal-title").text("Log In Github");
      // $(".modal-body").text("Log In with Github failed!");
    }
  }
};

export { initLogin, initRegistration, initGithub };
