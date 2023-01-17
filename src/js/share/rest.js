import axios from "axios";
import $ from "jquery";
import { serverAddress } from "../constants";
import { updateZone } from "../utils";
import { clientAddres } from "../constants";

// share with user
const shareWithUser = async (email) => {
  const share = axios({
    method: "post",
    url: serverAddress + "/user/share",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    params: {
      email: email,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return share;
};

// get users who shared with me
const getUsersSharedWithMe = async (email) => {
  const getShared = axios({
    method: "GET",
    url: serverAddress + "/user/getUsersWhoSharedWithMe",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
  })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return getShared;
};

// get users who shared with me
const getEventsSharedWithMe = async (emails) => {
  console.log(emails);
  console.log(JSON.stringify(emails));

  const getShared = axios({
    method: "POST",
    url: serverAddress + "/event/GetAllShared",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: JSON.stringify(emails),
  })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return getShared;
};

export { shareWithUser, getUsersSharedWithMe, getEventsSharedWithMe };
