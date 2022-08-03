function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Clyde')
      .addItem('Send Emails', 'menuItem1')
      .addSeparator()
      .addSubMenu(ui.createMenu('Import Users')
          .addItem('Google Classroom', 'menuItem2')
          .addItem('Email List', 'menuItem3'))
      .addToUi();
}

function menuItem1() {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .alert('You clicked the first menu item!');
}

function menuItem2() {
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .alert('You clicked the second menu item!');
  
}
