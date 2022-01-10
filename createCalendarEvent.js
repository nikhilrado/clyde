/* Creates an event in google calendar (uses primary calendar if none specified)
   @param {String} eventName: the name of the event to be created
   @param {Object} startDateTime: the date and time that the event starts (passed as a js Date object)
   @param {int} durationMin: the duration of the event in minuted (must be greater than 0)
   @param {Object} args: optional arguments for the function
          {String} calendar: the name of the calendar that this event should be added to (any calendar that user has write access to)
          {String} description: description of event (can use basic html to markup (bold, underline, etc))
          {int} location: the location of the event
          {String} guests: a comma seperated list of guest emails to invite to the event
          {boolean} sendInvites: whether or not the program should send invitations (emails) to guests; defaults to false
*/
function createEvent(eventName, startDateTime, durationMin, args={}) {
  endDT = new Date(startDateTime + durationMin*60000);

  if (args['calendar']) {var cal = CalendarApp.getCalendarsByName(args['calendar'])[0];}
  else {var cal = CalendarApp.getDefaultCalendar();}

  Logger.log(cal.getId())
  var event = cal.createEvent(eventName, startDateTime, endDT,
      {location: args['location'],guests: args['guests'], sendInvites: args['sendInvites'], description: args['description']});
  Logger.log('Event ID: ' + event.getId());
  //Logger.log(CalendarApp.getDefaultCalendar().getId())
}

function test(){
  createEvent("Meeting with John", new Date(2022,0,9,10,30),30, {calendar: "TestCal", location: "bob's house"});
}
