import * as SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getAllEventsByUser } from "./rest";

import { serverAddress } from "./constants";

let stompClient;
const socketFactory = () => {
  return new SockJS(serverAddress + "/ws");
};

const openConnection = () => {
  console.log("---- openConnection ----");
  const socket = socketFactory();
  stompClient = Stomp.over(socket);
  stompClient.connect({}, onConnected);
};

const onMessageReceived = (payload) => {
  console.log("---- onMessageReceived ----");
  var message = JSON.parse(payload.body);
  console.log(message);

  $(".toast-container").append(`
  <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
    <strong class="me-auto">${message.title}</strong>
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">${message.message}</div>
  </div>
  `);
  // $(".toast").toast("show");
  // $(".toast:not(.show)").remove();
};

const onUpdateReceived = async (payload) => {
  console.log("------------------------ onUpdateReceived ----------------------------");
  getAllEventsByUser();
};

const onConnected = () => {
  console.log("---- onConnected ----");
  stompClient.subscribe("/notifications/" + sessionStorage.getItem("email"), onMessageReceived);
  stompClient.subscribe("/update/" + sessionStorage.getItem("email"), onUpdateReceived);
};

export { openConnection };
