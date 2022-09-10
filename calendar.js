function daily() {
  // Determines how many events are happening in the next two hours that contain the term
  // "meeting".
  var calendars = CalendarApp.getCalendarsByName("CS@BCHS");
  Logger.log("Found %s matching calendars.", calendars.length);
  csAtBCHSCalendar = calendars[0];
  console.log(csAtBCHSCalendar);

  var now = new Date();
  var oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  var threeDaysFromNow = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);
  var events2 = CalendarApp.getCalendarById(csAtBCHSCalendar.getId()).getEvents(
    now,
    oneWeekFromNow,
    { search: "CSHS Meeting" }
  );
  var events = CalendarApp.getCalendarById(
    csAtBCHSCalendar.getId()
  ).getEventsForDay(threeDaysFromNow, { search: "CSHS Meeting" });
  Logger.log("Number of events: " + events.length);

  //addGuestsToEvent(events[0],["""])
  //console.log("Hello everyone, reminder that we will be having a cshs meeting this " +  + " in " +  events[0].getLocation() + "check Google Calendar for more info: https://calendar.google.com" + )//getEventURL(events[0],csAtBCHSCalendar))

  if (events.length > 0) {
    console.log(events[0].toString());
    var meetingTime = events[0].getStartTime().toLocaleDateString("en-us", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    var chatMessage = `Hello everyone, reminder that we will be having a CSHS meeting this ${meetingTime} in ${events[0].getLocation()}. Check Google Calendar for more info: https://calendar.google.com`;
    sendCshsChatUpdate(chatMessage);
  }
}

/**
 * @param {CalendarEvent} event The calendar event object
 * @param {string[]} guestEmails A string of emails to invite to the meeting
 */
function addGuestsToEvent(event, guestEmails) {
  for (const guestEmail of guestEmails) {
    event.addGuest(guestEmail);
  }
  //event.addGuest(attendeeEmail)
  console.log("hi");
}

function sendCshsChatUpdate(message) {
  const chatWebhook =
    PropertiesService.getScriptProperties().getProperty("googleChatWebhook");
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ text: message }),
  };
  UrlFetchApp.fetch(chatWebhook, options);
}

/**
 * @param {CalendarEvent} event The calendar event object
 * @param {Calendar} calendar The calendar object that the event is in
 */
// this currently does not work
function getEventURL(event, calendar) {
  var splitEventId = event.getId().split("@");
  return (
    "https://www.google.com/calendar/event?eid=" +
    Utilities.base64Encode(splitEventId[0] + " " + calendar.getId()).replace(
      "==",
      ""
    )
  );
}
