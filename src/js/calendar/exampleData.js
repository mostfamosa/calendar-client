export const events = [
  {
    id: "1",
    start: "2022-12-18T02:30:00",
    title: "The first dynamic event",
    
    extendedProps: {
      public: true,
      location: "Tel Aviv",
      guests: ["ana", "leon", "mostafa", "rani"],
      admins: ["mostafa", "assaf", "tzahi", "leon"],
      myDuration: 2.5,
      organizer: "mostafa",
    
    },
    description: "Argentina woooooon!",
  },
  { id: "2", resourceId: "c", start: "2022-12-15T05:00:00", end: "2022-12-15T22:00:00", title: "event 2" },
  { id: "3", resourceId: "d", start: "2022-02-06", end: "2022-02-08", title: "event 3" },
  { id: "4", resourceId: "e", start: "2022-12-16T03:00:00", end: "2022-12-16T08:00:00", title: "event 4" },
  { id: "5", resourceId: "f", start: "2022-12-14T00:30:00", end: "2022-12-14T02:30:00", title: "event 5" },
  {
    id: "6",
    resourceId: "b",
    start: "2022-12-14T23:00:00",
    end: "2022-12-15T01:00:00",
    title: "event 1",
    extendedProps: {
      guests: ["ana", "leon"],
    },
    description: "Lecture",
  },
];
