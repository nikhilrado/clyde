// recursive function that returns link of prefilled form
// will prefill the first question
// recursiveness reduces number of API calls
function generatePrefilledFormLink(schoolUsername) {
  if (typeof prefillLinkTemplate == "undefined") {
    var template = "XXXTEMPLATEXXX"
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Log");
    var url = sheet.getFormUrl();
    console.log(url)

    var existingForm = FormApp.openByUrl(url);
    var formResponse = existingForm.createResponse();
    var items = existingForm.getItems();
    // Prefill Name
    var formItem = items[0].asTextItem();
    var response = formItem.createResponse(template);
    formResponse.withItemResponse(response);

    prefillLinkTemplate = formResponse.toPrefilledUrl();
    console.log(prefillLinkTemplate)
    return (generatePrefilledFormLink(schoolUsername))
  }
  // if api has bee called, just replace the text
  return prefillLinkTemplate.replace("XXXTEMPLATEXXX", schoolUsername)
};