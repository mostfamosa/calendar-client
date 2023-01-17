import { shareWithUser, getUsersSharedWithMe, getEventsSharedWithMe } from "./rest";
import { calendar } from "../calendar/fullCalendar";
import { adaptEventsToFullCalendar } from "../utils";

const initShare = async () => {
  // Create me at the top of shared users list
  var checkboxContainer = $(`<div class='checkboxContainer'><input type='checkbox' id=${sessionStorage.getItem("userId")} checked><label for='normal' style="margin-right: 10%;">${sessionStorage.getItem("email")}</label></br>`);
  $(".side_wrapper .sharedWithMe .listShared").append(checkboxContainer);

  // get users shared with me
  const res = await getUsersSharedWithMe();

  if (res.status == 200) {
    const users = res.data.data;

    users.forEach((user) => {
      $(".side_wrapper .sharedWithMe .listShared").append(renderSharedWithMe(user.id, user.email));
    });
  } else {
    console.log("error get users who shared with me");
  }

  // click on share calender with others
  $(document).on("click", ".shareBtn", async function (event) {
    console.log("share with others ");
    event.preventDefault();

    let email = prompt("Please enter email to share with ");
    if (email != null) {
      console.log(email);
      const res = await shareWithUser(email);
      console.log(res);

      if (res.status == 200) {
        alert("share success");
      } else {
        alert("share fail");
      }
    }
  });

  // click on show others events
  $(document).on("click", ".getShared", async function (event) {
    console.log("get shared events");
    event.preventDefault();

    const emails = getChoosenUsers();
    const res = await getEventsSharedWithMe(emails);
    const events = res.data.data;
    console.log(events);
    const adaptedEvents = adaptEventsToFullCalendar(events);

    // remove previous events from calendar
    const sources = calendar.getEventSources();
    sources.forEach((source) => {
      source.remove();
    });

    calendar.addEventSource(adaptedEvents);
  });

  // Click handler
  $(`#${sessionStorage.getItem("userId")}`).on("click", function () {
    if ($(this).is(":checked")) {
      console.log("11111");
      //$('#calendar').find(".fc-event").show();
      $("#calendar")
        .find("." + $(this).attr("id"))
        .show();
    } else {
      console.log("00000");
      $("#calendar")
        .find("." + $(this).attr("id"))
        .hide();
    }
  });
};

const renderSharedWithMe = (id, name) => {
  return `<div class='checkboxContainer'>
  <input type='checkbox' id=${id}>
  <label for='normal' style="margin-right: 10%;">${name}</label>
  </br>`;
};

const getChoosenUsers = () => {
  const users = [];
  $("ul.listShared div").each(function () {
    if ($(this).find("input").is(":checked")) {
      console.log($(this).find("input").is(":checked"));
      users.push($(this).find("label").text());
    }
  });

  return users;
};

export { initShare };
