function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Clyde')
      .addItem('Send Emails', 'menuItem1')
      .addSeparator()
      .addSubMenu(ui.createMenu('Import Users')
          .addItem('Google Classroom', 'menuItem25')
          .addItem('Email List', 'menuItem3'))
      .addToUi();
}

function menuItem1() {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .alert('You clicked the first menu item!');
}

function menuItem2() {
  var html = HtmlService.createHtmlOutputFromFile('Page')
      .setWidth(400)
      .setHeight(300);
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showModalDialog(html, 'My custom dialog');
}

function menuItem3() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt("Paste an email list from Gmail or Calendar:")
  addToRange(emailStringToArray(result.getResponseText()),"Settings!A3:C100")
}