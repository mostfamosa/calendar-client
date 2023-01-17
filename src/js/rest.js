import axios from "axios";
import $ from "jquery";
import { serverAddress } from "./constants";
import { calendar } from "../js/calendar/fullCalendar";
import { adaptEventsToFullCalendar } from "../js/utils";

// ------------------------ events ----------------------------------
const getAllEventsByUser = (userId) => {
  const FetchPromise = axios({
    method: "GET",
    url: serverAddress + "/event/getEventsByUserIdShowOnly",
    // url: serverAddress + "/event/getEventsByUserId",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: {},
  });
  // var myNewEvents;
  FetchPromise.then((res) => {
    console.log(res.data.data);
    const events = adaptEventsToFullCalendar(res.data.data);
    console.log(events);

    // remove previous events from calendar
    const sources = calendar.getEventSources();
    sources.forEach((source) => {
      source.remove();
    });

    calendar.addEventSource(events);
  }).catch((error) => {
    console.log(error);
  });
};

const saveNewEvent = (event, addGuests) => {
  const FetchPromise = axios({
    method: "POST",
    url: serverAddress + "/event/saveEvent",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: {
      title: event.title,
      time: event.time,
      duration: event.myDuration,
      location: event.location,
      description: event.description,
      attachments: event.attachments,
      public: event.public,
      user: [],
    },
  });

  FetchPromise.then(async (res) => {
    console.log(res.data.data);
    sessionStorage.setItem("currentEventId", res.data.data.id);
    for (let i = 0; i < addGuests.length; i++) {
      inviteGuest(addGuests[i]);
      await new Promise((r) => setTimeout(r, 2000));
    }

    // add to fullCalendar
    calendar.addEvent({
      title: $("#editModalTitle").val(),
      start: $("#date").val() + "T" + $("#time").val(),
      end: "2022-12-19T20:00:00",
      extendedProps: {
        public: $("#checkbox").is(":checked"),
        location: $("#location").val(),
        organizer: sessionStorage.getItem("currentUser"),
        duration: $("#duration").val(),
      },
      description: $("#description").val(),
    });

    // event.user.push(myGuest);
    location.reload();
  }).catch((error) => {
    console.log(error.response.data.message);
  });
};

const updateEvent = (event, addGuests) => {
  const update = axios({
    method: "PUT",
    url: serverAddress + "/event/updateEvent/event",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    params: {
      eventId: sessionStorage.getItem("currentEventId"),
    },
    data: {
      title: event.title,
      time: event.time,
      duration: event.myDuration,
      location: event.location,
      description: event.description,
      attachments: event.attachments,
      public: event.public,
      user: [],
    },
  })
    .then(async (res) => {
      console.log(res.data.data);
      sessionStorage.setItem("currentEventId", res.data.data.id);
      for (let i = 0; i < addGuests.length; i++) {
        inviteGuest(addGuests[i]);
        await new Promise((r) => setTimeout(r, 2000));
      }
      location.reload();
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
};

const deleteEvent = async (id) => {
  const deleteE = axios({
    method: "DELETE",
    url: serverAddress + "/event/deleteEvent?eventId=" + sessionStorage.getItem("currentEventId"),
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
  return await deleteE;
};

const hideEvent = async (id) => {
  const hide = axios({
    method: "PATCH",
    url: serverAddress + "/event/leaveEvent?eventId=" + sessionStorage.getItem("currentEventId"),
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
  return await hide;
};

const switchStatus = async (isArrive) => {
  const switchS = axios({
    method: "PATCH",
    url: serverAddress + "/event/switchStatus?eventId=" + sessionStorage.getItem("currentEventId"),
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    params: {
      booleanValue: isArrive,
    },
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
  return await switchS;
};

// ------------------------ roles ----------------------------------
// switch role - not implemented!

const inviteGuest = async (email) => {
  const invite = axios({
    method: "POST",
    url: serverAddress + "/event/inviteGuest?eventId=" + sessionStorage.getItem("currentEventId") + "&email=" + email, // Will need to change to eventId later!!!!~~~~~~
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: {},
  })
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
  return await invite;
};

const removeGuest = async (email) => {
  const remove = axios({
    method: "DELETE",
    url: serverAddress + "/event/removeGuest?eventId=" + sessionStorage.getItem("currentEventId") + "&email=" + email,
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: {},
  })
    .then((res) => {
      console.log(res.data.data);
      return true;
    })
    .catch((error) => {
      console.log(error.response.data.message);
      return false;
    });
  return await remove;
};

const switchRole = async (id) => {
  const switchR = axios({
    method: "PATCH",
    url: serverAddress + "/event/switchRole?eventId=" + sessionStorage.getItem("currentEventId"),
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    data: id,
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
  return await switchR;
};

export { updateEvent, getAllEventsByUser, inviteGuest, saveNewEvent, removeGuest, switchRole, deleteEvent, hideEvent, switchStatus };
