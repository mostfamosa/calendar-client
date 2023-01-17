import $ from "jquery";

const initHomePage = () => {
  console.log("initHomePage");
  $(document).ready(function () {
    const myTags = ["Java", "Spring Boot", "JPA", "Hibernate", "MySQL", "JavaScript", "CSS", "SCSS", "HTML", "git", "jQuery", "Bootstrap", "Firebase", "SPA", "Google Auth", "Tests", "Mock", "Webpack", "Filters"];

    var tagCloud = TagCloud(".techologies", myTags, {
      // radius in px
      radius: 200,

      // animation speed
      // slow, normal, fast
      maxSpeed: "fast",
      initSpeed: "fast",

      // 0 = top
      // 90 = left
      // 135 = right-bottom
      direction: 135,

      // interact with cursor move on mouse out
      keep: true,
    });

    var colors = ["#34A853", "#FBBC05", "#4285F4", "#7FBC00", "FFBA01", "01A6F0"];
    var random_color = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector(".techologies").style.color = random_color;
  });
};

export { initHomePage };
