import { initLogin, initRegistration, initGithub } from "./auth/auth";
import { initSideCalendar } from "./calendar/sideCalendar";
import { initFullCal } from "./calendar/fullCalendar";
import { initHomePage } from "./home/home";
import { initCalendar } from "./calendar/calendar";
import { initShare } from "./share/share";
import { initSettings } from "./settings/settings";

const initRouter = async () => {
  await urlLocationHandler();

  // create document click that watches the nav links only
  document.addEventListener("click", (e) => {
    const { target } = e;
    if (target.matches("header div a")) {
      // header nav
      e.preventDefault();
      urlRoute();
    }
  });
};

const urlPageTitle = "Calendar";

// create an object that maps the url to the template, title, and description
const urlRoutes = {
  404: {
    template: "pages/404.html",
    title: "404 | " + urlPageTitle,
    description: "Page not found",
  },
  "/": {
    template: "pages/home.html",
    title: "Home | " + urlPageTitle,
    description: "This is the home page",
    init: () => {
      initHomePage();
      initGithub();
    },
  },
  "/signup": {
    template: "pages/signup.html",
    title: "Sign Up | " + urlPageTitle,
    description: "This is the sign up page",
    init: () => {
      initRegistration();
    },
  },
  "/login": {
    template: "pages/login.html",
    title: "Log In | " + urlPageTitle,
    description: "This is the log in page",
    init: () => {
      initLogin();
    },
  },
  "/calendar": {
    //  "/": {
    template: "pages/calendar.html",
    title: "My Calendar | " + urlPageTitle,
    description: "This is the calendar page",
    init: () => {
      initSideCalendar();
      initFullCal();
      initCalendar();
      initShare();
    },
  },
  "/github": {
    template: "pages/login.html",
    title: "Github Log In | " + urlPageTitle,
    description: "This is the Github log in page",
    init: () => {
      initGithub();
    },
  },
  "/user": {
    template: "pages/user.html",
    title: "User Settings | " + urlPageTitle,
    description: "This is the user settings page",
    init: () => {
      initSettings();
    },
  },
};

// create a function that watches the url and calls the urlLocationHandler
const urlRoute = async (event) => {
  event = event || window.event; // get window.event if event argument not provided
  event.preventDefault();
  console.log(event.target.href);
  // if (event.target.href.includes("localhost")) {
  // }
  window.history.pushState({}, "", event.target.href);
  await urlLocationHandler();
  // window.history.pushState(state, unused, target link);
};

// create a function that handles the url location
const urlLocationHandler = async () => {
  console.log("urlLocationHandler");
  const location = window.location.pathname; // get the url path
  console.log(location);

  if (location.length == 0) {
    location = "/";
  }
  // get the route object from the urlRoutes object
  const route = urlRoutes[location] || urlRoutes["404"];
  // get the html from the template

  const html = await fetch(route.template).then((response) => response.text());
  // set the content of the content div to the html
  document.getElementById("content").innerHTML = html;

  if (route.init) route.init();
  // route.init();

  // set the title of the document to the title of the route
  document.title = route.title;
  // set the description of the document to the description of the route
  // document.querySelector('meta[name="description"]').setAttribute("content", route.description);
};

export { initRouter };
