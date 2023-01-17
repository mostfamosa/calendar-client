import axios from "axios";
import $ from "jquery";
import { serverAddress } from "../constants";
import { updateZone } from "../utils";
import { clientAddres } from "../constants";

const createUser = async (user) => {
  const createUserFetchPromise = axios({
    method: "post",
    url: serverAddress + "/auth/signup",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      email: user.email,
      name: user.name,
      password: user.password,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return createUserFetchPromise;
};

const login = async (user) => {
  const loginFetchPromise = axios({
    method: "post",
    url: serverAddress + "/auth/login",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      email: user.email,
      password: user.password,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  return loginFetchPromise;
};

const loginGithub = async (code) => {
  const loginGithubFetchPromise = axios({
    method: "post",
    url: serverAddress + "/auth/loginGithub",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      code: code,
    },
  })
    .then((res) => {
      sessionStorage.setItem("userId", res.data.data.userId);
      sessionStorage.setItem("token", res.data.data.token);
      sessionStorage.setItem("currentUser", res.data.data.name);
      $("header .me .name").text("Hi, " + res.data.data.name);
      console.log("booom");
      return res;
    })
    .catch((error) => {
      console.log(error);
      return res;
    });
  return loginGithubFetchPromise;
};

export { createUser, login, loginGithub };
