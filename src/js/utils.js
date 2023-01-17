function updateZone(city) {
  switch (city) {
    case "JERUSALEM":
      sessionStorage.setItem("zone", "+02:00");
      sessionStorage.setItem("zoneDiff", "+2");
      break;
    case "PARIS":
      sessionStorage.setItem("zone", "+01:00");
      sessionStorage.setItem("zoneDiff", "+1");
      break;
    case "LONDON":
      sessionStorage.setItem("zone", "+00:00");
      sessionStorage.setItem("zoneDiff", "+0");
      break;
    case "NEW_YORK":
      sessionStorage.setItem("zone", "-05:00");
      sessionStorage.setItem("zoneDiff", "-5");
      break;
    default:
      sessionStorage.setItem("zone", "+02:00");
      sessionStorage.setItem("zoneDiff", "+2");
  }
}

const renderUserinList = (user) => {
  console.log(user);
  let status = "";
  let statusClass = "";
  switch (user.statusType) {
    case "TENTATIVE":
      status = "?";
      statusClass = "tentative";
      break;
    case "APPROVED":
      status = "V";
      statusClass = "approved";
      break;
    case "REJECTED":
      status = "X";
      statusClass = "rejected";
      break;
    default:
    // code block
  }

  const userType = user.roleType.toLowerCase();
  const email = user.user.email;
  const id = user.user.id;

  const userToRender = `<li  id="${id}" class="userWrpper">
  <div class="${userType}Status ${statusClass}">${status}</div>
  <div class="${userType}Email">${email}</div>
  <div class="${userType}ChangeRole"><i class="bi bi-arrow-down-up"></i></div>
  <div class="${userType}Remove"><i class="bi bi-trash"></i></div>
  </li>`;

  if (userType == "admin") {
    $(".field.admins div.listWrapper ul").append(userToRender);
  } else if (userType == "guest") {
    $(".field.guests div.listWrapper ul").append(userToRender);
  }
};

const cleanAddModalFields = () => {
  $("#eventEditModal").modal("show"); // modal debug
  $("#organizerField").text(sessionStorage.getItem("currentUser"));
  $("#adminUsers").empty();
  $("#guestUsers").empty();
  $("#editModalTitle").val("");
  $("#date").val("");
  $("#time").val("");
  $("#checkbox").val("");
  $("#location").val("");
  $("#duration").val("");
  $("#description").val("");
};

const adaptEventsToFullCalendar = (events) => {
  console.log("in adaptEventsToFullCalendar");

  let myNewEvents = events;

  for (let i = 0; i < events.length; i++) {
    //research of mostfa and leon DON'T TOUCH OR CHANGE IT
    //--------------------------------------------------------
    var updatedZone;
    var calcZone = sessionStorage.zone.split(":");

    var h = parseInt(calcZone[0] * -1 + parseInt("+04:00"));
    if (h < 0) {
      if (h > 10) {
        updatedZone = "-" + h + ":" + calcZone[1];
      } else {
        updatedZone = "-0" + h + ":" + calcZone[1];
      }
    } else {
      if (h > 10) {
        updatedZone = "+" + h + ":" + calcZone[1];
      } else {
        updatedZone = "+0" + h + ":" + calcZone[1];
      }
    }

    myNewEvents[i].start = myNewEvents[i].time.split("+")[0] + updatedZone;
    if (isNaN(new Date(myNewEvents[i].start).getHours())) {
      let array = myNewEvents[i].time.split("-");
      array.pop();
      const newArray = array.join("-");
      console.log(newArray);
      myNewEvents[i].start = newArray + updatedZone;
    }

    //--------------------------------------------------------

    myNewEvents[i].myDuration = myNewEvents[i].duration;
    var myHour = new Date(myNewEvents[i].start).getHours();
    var myMin = new Date(myNewEvents[i].start).getMinutes();
    var myDuration2 = myNewEvents[i].duration;
    var calEnd = new Date(myNewEvents[i].start).setHours(myHour + myDuration2, (myHour + myDuration2 - (myHour + parseInt(myDuration2))) * 60 + myMin);

    myNewEvents[i].end = calEnd;
    myNewEvents[i].resourceId = sessionStorage.getItem("userId");

    const roles = myNewEvents[i].roles;
    roles.forEach((role) => {
      if (role.user.id == sessionStorage.getItem("userId")) {
        console.log("me!");
        myNewEvents[i].resourceId = "me";
      }
    });

    if (myNewEvents[i].resourceId == sessionStorage.getItem("userId")) {
      console.log("booom");
      console.log(myNewEvents[i]);
      $(".fc-event").css("background-color", "#D7CDD5").addClass(sessionStorage.getItem("userId"));
    }
  }

  // //ADDED class equals to orginaizerid
  // for (let i = 0; i < res.data.data.length; i++) {
  //   if (myNewEvents[i].resourceId == sessionStorage.getItem("userId")) {
  //     $(".fc-event").css("background-color", "#D7CDD5").addClass(sessionStorage.getItem("userId"));
  //     console.log(myNewEvents[i].resourceId);
  //   }
  // }

  return myNewEvents;
};

export { updateZone, renderUserinList, cleanAddModalFields, adaptEventsToFullCalendar };
