import { updateEvent, getAllEventsByUser, inviteGuest, saveNewEvent, removeGuest, switchRole, deleteEvent, hideEvent, switchStatus } from "../rest";
import { calendar } from "./fullCalendar";
import pubSub from "./pubsub";
import { renderUserinList, cleanAddModalFields } from "../utils";

var addGuests = [];
var currentEventInfo;
var organizer;
var admins = [];
var guests = [];

// click on the event
const eventClickHandler = (info) => {
  $("#eventModal").removeClass("admin organizer guest myEvent");
  admins = [];
  guests = [];

  console.log(info);
  const eventId = info.event._def.publicId;
  currentEventInfo = info;
  var theRoles = info.event.extendedProps.roles;

  sessionStorage.setItem("currentEventId", info.event.id);

  for (let i = 0; i < theRoles.length; i++) {
    if (theRoles[i].roleType == "ORGANIZER") organizer = theRoles[i].user;
    else if (theRoles[i].roleType == "ADMIN") admins.push(theRoles[i]);
    else guests.push(theRoles[i]);
  }

  console.log(organizer);
  console.log(admins);
  console.log(guests);

  $("#eventModal").modal("show");
  $("#eventModal").attr("event-id", eventId);
  $(".modal-title").text(info.event._def.title);
  $(".row.field.public #checkbox").prop("checked", info.event._def.extendedProps.public);
  $(".row.field.time .content").text(info.event.start.getHours() + ":" + info.event.start.getMinutes());
  $(".row.field.date .content").text(info.event.start.getFullYear() + "-" + (info.event.start.getMonth() + 1) + "-" + info.event.start.getDate());
  $(".row.field.duration .content").text(info.event.extendedProps.myDuration + " (Hours)");
  $(".row.field.location .content").text(info.event.extendedProps.location);
  $(".field.description .content").text(info.event.extendedProps.description);

  $(".field.organizer div").text(organizer.email);

  $("#adminUsersShow").empty();
  admins.forEach((admin) => {
    console.log(admin);
    renderUserinList(admin);
    if (sessionStorage.userId == admin.user.id) {
      $("#eventModal").addClass("admin");
    }
  });

  $("#guestUsersShow").empty();
  guests.forEach((guest) => {
    console.log(guest);
    renderUserinList(guest);
    if (sessionStorage.userId == guest.user.id) {
      $("#eventModal").addClass("guest");
    }
  });

  if (sessionStorage.userId == organizer.id) {
    $("#eventModal").addClass("organizer");
  }

  if (info.event._def.resourceIds.includes("me")) {
    console.log("aaaaaaa");
    $("#eventModal").addClass("myEvent");
  }
};

const initCalendar = () => {
  $(document).ready(function () {
    // get events of user on load calendar page
    getAllEventsByUser(sessionStorage.getItem("userId"));

    // change date from side calendar
    pubSub.subscribe("anEvent", (date) => {
      calendar.gotoDate(date);
    });
  });

  $(document)
    .off("click")
    .on("click", "#btnSignup", function () {
      // remove previous eventHandker
    });

  // create new event
  $(document).on("click", ".new #SaveNewEventBtn", (event) => {
    console.log("Inside add new event!");
    event.preventDefault();

    // add to server
    const eventToAdd = {
      title: $(".title").val(),
      time: $("#date").val() + "T" + $("#time").val() + sessionStorage.zone,
      myDuration: $("#duration").val(),
      location: $("#location").val(),
      description: $("#description").val(),
      organizer: sessionStorage.getItem("currentUser"),
      public: $(".public #checkbox").is(":checked"),
    };

    saveNewEvent(eventToAdd, addGuests);
  });

  // edit event
  $(document).on("click", "#editEventButton", (event) => {
    event.preventDefault();

    $("#eventEditModal").modal("show");
    cleanAddModalFields();
    console.log(currentEventInfo);
    $("#editModalTitle.title").val(currentEventInfo.event._def.title);
    if (currentEventInfo.event.extendedProps.public) $("#checkbox").prop("checked", true);

    console.log("0" + currentEventInfo.event.start.getHours() + ":" + currentEventInfo.event.start.getMinutes());
    if (currentEventInfo.event.start.getHours() < 10 && currentEventInfo.event.start.getMinutes() < 10) $("#time").val("0" + currentEventInfo.event.start.getHours() + ":" + "0" + currentEventInfo.event.start.getMinutes());
    else if (currentEventInfo.event.start.getHours() < 10 && currentEventInfo.event.start.getMinutes() >= 10) $("#time").val("0" + currentEventInfo.event.start.getHours() + ":" + currentEventInfo.event.start.getMinutes());
    else if (currentEventInfo.event.start.getHours() >= 10 && currentEventInfo.event.start.getMinutes() < 10) $("#time").val(currentEventInfo.event.start.getHours() + ":" + "0" + currentEventInfo.event.start.getMinutes());
    else $("#time").val(currentEventInfo.event.start.getHours() + ":" + currentEventInfo.event.start.getMinutes());

    $("#date").val(currentEventInfo.event.start.getFullYear() + "-" + (currentEventInfo.event.start.getMonth() + 1) + "-" + currentEventInfo.event.start.getDate());
    $("#duration").val(currentEventInfo.event.extendedProps.myDuration);
    $("#location").val(currentEventInfo.event.extendedProps.location);
    $("#description").val(currentEventInfo.event.extendedProps.description);

    $("#organizerField").text(organizer.email);

    $("#adminUsersShow").empty();
    admins.forEach((admin) => {
      renderUserinList(admin);
    });

    $("#guestUsersShow").empty();
    guests.forEach((guest) => {
      renderUserinList(guest);
    });

    //check if the user guest
    for (let i = 0; i < guests.length; i++)
      if (guests[i].user.id == sessionStorage.getItem("userId")) {
        $(".modal-content").addClass("guest");
      }

    //check if the user admin
    for (let i = 0; i < admins.length; i++)
      if (admins[i].user.id == sessionStorage.getItem("userId")) {
        $(".modal-content").addClass("admin");
      }

    //check if the user orginaizer
    console.log(organizer);

    if (organizer.id == sessionStorage.getItem("userId")) {
      $(".modal-content").removeClass("admin");
      $(".modal-content").removeClass("guest");
    }

    $(".modal-content").removeClass("new");
    $(".modal-content").addClass("edit");
  });

  //update event
  $(document).on("click", ".edit #SaveNewEventBtn", (event) => {
    console.log("Inside update event!");
    event.preventDefault();

    // add to server
    const eventToAdd = {
      title: $("#editModalTitle").val(),
      time: $("#date").val() + "T" + $("#time").val() + sessionStorage.zone,
      myDuration: $("#duration").val(),
      location: $("#location").val(),
      description: $("#description").val(),
      organizer: sessionStorage.getItem("currentUser"),
      public: $(".public #checkbox").is(":checked"),
    };

    console.log(eventToAdd);

    updateEvent(eventToAdd, addGuests);
    // need to add if success...

    // update fullCalendar
    const calendarEvent = calendar.getEventById(sessionStorage.currentEventId);
    calendarEvent.setProp("title", eventToAdd.title);
    // calendarEvent.setProp("start", );    --------------------- mostafa help!!!
    // calendarEvent.setProp("end", );      --------------------- mostafa help!!!
    calendarEvent.setExtendedProp("public", eventToAdd.public);
    calendarEvent.setExtendedProp("location", eventToAdd.location);
    calendarEvent.setExtendedProp("guests", eventToAdd.g);
    calendarEvent.setExtendedProp("duration", eventToAdd.duration);

    // calendar.refetchEvents();
  });

  //switch role
  $(document).on("click", ".guestChangeRole, .adminChangeRole", async function (event) {
    console.log("Inside switch role!");
    event.preventDefault();

    const id = $(this).parent(".userWrpper").attr("id");
    const res = await switchRole(id);
    console.log(res);
    if (res.status == 200) {
      $(this).parent(".userWrpper").remove();
      renderUserinList(res.data.data);
    }
  });

  // invite guest
  $(document).on("click", "#eventAddGuest", async (event) => {
    console.log("Inside add guest to event (event modal)");
    event.preventDefault();
    const email = $(".row.addGuest input").val();
    // addGuests.push(email);
    const res = await inviteGuest(email);
    console.log(res);

    if (res.status == 200) {
      renderUserinList(res.data.data);
    }

    $(".row.addGuest input").val("");
  });

  // remove guest
  $(document).on("click", ".guestRemove, .adminRemove", async function (event) {
    console.log("Inside Remove Guest From Event!");
    event.preventDefault();

    // const email = $(this).siblings(".guestEmail").text();
    const email = $(this).siblings("div[class*=Email]").text();
    const res = await removeGuest(email);
    console.log("delete res: " + res);
    if (res == true) {
      $(this).parent(".userWrpper").remove();
    }
  });

  // switch status - approve
  $(document).on("click", ".modal-footer-buttons #approve", async function (event) {
    console.log("Inside switch status");
    event.preventDefault();

    const res = await switchStatus(true);
    if (res.status == 200) {
      $("#eventModal").modal("hide");
      // do the change at the popup
    }
  });

  // switch status - reject
  $(document).on("click", ".modal-footer-buttons #reject", async function (event) {
    console.log("Inside switch status");
    event.preventDefault();

    const res = await switchStatus(false);
    if (res.status == 200) {
      $("#eventModal").modal("hide");
      // do the change at the popup
    }
  });

  // delete event
  $(document).on("click", "#deleteEventButton", async function (event) {
    console.log("Inside deleteEventButton");
    event.preventDefault();

    const res = await deleteEvent();
    if (res.status == 200) {
      console.log("event was deleted");
      $("#eventModal").modal("hide");
      // delete from full calendar
      const event = calendar.getEventById(sessionStorage.currentEventId);
      event.remove();
    }
  });

  // hide event
  $(document).on("click", ".modal-footer-buttons #hide", async function (event) {
    console.log("Inside hideEvent");
    event.preventDefault();

    const res = await hideEvent();
    if (res.status == 200) {
      console.log("event was hided");
      $("#eventModal").modal("hide");
      // delete from full calendar
      const event = calendar.getEventById(sessionStorage.currentEventId);
      event.remove();
    }
  });
};

export { initCalendar, eventClickHandler };
