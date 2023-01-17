import axios from "axios";
import $ from "jquery";
import { serverAddress } from "../constants";
import { updateZone } from "../utils";

const getSettings = async (city) => {
  const getMySettings = axios({
    method: "GET",
    url: serverAddress + "/user/getNotificationSettings",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
  })
    .then((res) => {
      // console.log(res.data);
      return res;
    })
    .catch((error) => {
      console.log(error);
    });
  return await getMySettings;
};

const updateCity = (city) => {
  const updateLocation = axios({
    method: "PATCH",
    url: serverAddress + "/user/updateCity",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    params: {
      newCity: city,
    },
  })
    .then((res) => {
      const city = res.data.data.city;
      sessionStorage.setItem("city", city);
      $("header .city").text(city);

      $("#modalResponse .modal-title").text("City update");
      $("#modalResponse .modal-body").text("City was updated successfull!");
      updateZone(city);
      // $("#modalResponse").modal("show");
    })
    .catch((error) => {
      $(".modal-title").text("City update");
      $(".modal-body").text("City update failed!");
    });
  // updateLocation();
};

const updateNotificationsSettings = (settings) => {
  console.log("updateNotificationsSettings");
  const updateNotifications = axios({
    method: "PUT",
    url: serverAddress + "/user/update",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    params: {
      notifications: "",
    },
    data: settings,
  })
    .then((res) => {
      $("#modalResponse .modal-title").text("Notification Settings update");
      $("#modalResponse .modal-body").text("Notification Settings were update");
      // $("#modalResponse").modal("show");
    })
    .catch((error) => {
      $(".modal-title").text("Notification Settings update");
      $(".modal-body").text("Notification Settings update failed!!!");
    });
  // updateNotifications();
};

export { getSettings, updateCity, updateNotificationsSettings };
