import $ from "jquery";
import { updateCity, updateNotificationsSettings, getSettings } from "./rest";

const initSettings = async () => {
  console.log("initSettings");

  // at loading page
  const res = await getSettings();
  const settings = res.data.data;
  setSettings(settings);
  setCity();

  // remove previous click handlers
  $(document)
    .off("click")
    .on("click", "#updateCity, #updateNotSetBtn", function () {
      // remove previous eventHandler
    });

  // update city
  $(document).on("click", "#updateCity", function (event) {
    console.log("update city");
    event.preventDefault();

    const city = $("form#settingsLocation div select#city").val();
    updateCity(city);
  });

  // update notifications
  $(document).on("click", "#updateNotSetBtn", function (event) {
    console.log("updateNotSet");
    event.preventDefault();

    const settings = getSettingsObject();
    updateNotificationsSettings(settings);
  });
};

const setSettings = (settings) => {
  console.log("setSettings");
  $("form#settings div select#EVENT_CHANGED").val(settings.event_changed).trigger("change");
  $("form#settings div select#INVITE_GUEST").val(settings.invite_guest).trigger("change");
  $("form#settings div select#UNINVITE_GUEST").val(settings.uninvite_guest).trigger("change");
  $("form#settings div select#USER_STATUS_CHANGED").val(settings.user_status).trigger("change");
  $("form#settings div select#USER_ROLE_CHANGED").val(settings.user_role).trigger("change");
  $("form#settings div select#CANCEL_EVENT").val(settings.cancel_event).trigger("change");
  $("form#settings div select#UPCOMING_EVENT").val(settings.upcoming_event).trigger("change");
  $("form#settings div select#notificationRangeSelect").val(settings.notificationRange).trigger("change");
};

const setCity = () => {
  const city = sessionStorage.city;
  $("form#settingsLocation div select#city").val(city).trigger("change");
};

const getSettingsObject = () => {
  const settings = {
    event_changed: $("form#settings div select#EVENT_CHANGED").val(),
    invite_guest: $("form#settings div select#INVITE_GUEST").val(),
    uninvite_guest: $("form#settings div select#UNINVITE_GUEST").val(),
    user_status: $("form#settings div select#USER_STATUS_CHANGED").val(),
    user_role: $("form#settings div select#USER_ROLE_CHANGED").val(),
    cancel_event: $("form#settings div select#CANCEL_EVENT").val(),
    upcoming_event: $("form#settings div select#UPCOMING_EVENT").val(),
    notificationRange: $("form#settings div select#notificationRangeSelect").val(),
  };
  return settings;
};

export { initSettings };
