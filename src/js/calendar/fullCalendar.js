import { Calendar } from "@fullcalendar/core";
import adaptivePlugin from "@fullcalendar/adaptive";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import momentPlugin from "@fullcalendar/moment";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { eventClickHandler } from "./calendar";
import { cleanAddModalFields } from "../utils";

var initialTimeZone = "local";
let calendar;
const initFullCal = () => {
  console.log("initFullCal");

  $(document).ready(function () {
    let calendarEl = document.getElementById("calendar");

    calendar = new Calendar(calendarEl, {
      plugins: [adaptivePlugin, interactionPlugin, dayGridPlugin, listPlugin, timeGridPlugin, resourceTimelinePlugin, momentPlugin],
      timeZone: initialTimeZone,
      titleFormat: "MM/YYYY",
      schedulerLicenseKey: "XXX",
      now: sessionStorage.currentTime,
      allDaySlot: false,
      slotDuration: "01:00:00",
      editable: true, // enable draggable events
      aspectRatio: 1.8,
      scrollTime: "00:00", // undo default 6am scrollTime
      headerToolbar: {
        left: "today addEventButton",
        center: "title",
        right: "prev,next timeGridDay,timeGridWeek,dayGridMonth,listWeek",
      },
      nowIndicator: true,
      initialView: "timeGridWeek",
      views: {},
      resources: [
        {
          id: sessionStorage.getItem("userId"),
        },
      ],
      // events: events,
      customButtons: {
        addEventButton: {
          text: "Add Event",
          click: function () {
            $("#eventEditModal").modal("show"); // modal debug
            $(".modal-content").removeClass("guest");
            $(".modal-content").removeClass("admin");
            $(".modal-content").removeClass("edit");
            $(".modal-content").addClass("new");
            cleanAddModalFields();
          },
        },
      },
      // timeZone: 'America/New_York',

      eventClick: (info) => eventClickHandler(info),
    });

    calendar.render();
  });
};

export { initFullCal, calendar };
