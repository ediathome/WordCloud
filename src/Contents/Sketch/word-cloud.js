function onRun(context) {
    var sketch = context.api();

    // Next we want to extract the selected page of the selected (front-most) document
    var document = sketch.selectedDocument;
    var page = document.selectedPage;

    // var userText = sketch.getStringFromUser("Test", "default");
    userData = createSettingsPanel();

    debugAlert("response code " + userData[0]);

    if(userData[0] !== 1000) return false;

    var separatorSet = NSCharacterSet.characterSetWithCharactersInString(' ');
    var words= userData[1].componentsSeparatedByCharactersInSet(separatorSet);
    var textLayers = [];

    for (var i=0; i < words.length; i++) {
        var nl = page.newText({alignment: NSTextAlignmentCenter, systemFontSize: 36, text:words[i]});
        nl.adjustToFit();
        textLayers[i] = nl;
    }

    // document.centerOnLayer(layer);
};

function debugAlert(msg) {
  alert = NSAlert.alloc().init();
  alert.setMessageText(msg);
  alert.addButtonWithTitle('Ok');
  return alert.runModal();
}

function createSettingsPanel(){
    var accessoryView = NSView.alloc().initWithFrame(NSMakeRect(0,20,278,150));
    
    var wordField = NSTextField.alloc().initWithFrame(NSMakeRect(0,0,220,25));
    wordField.setStringValue('Enter Words here...');

    accessoryView.addSubview(wordField);

    var alert = NSAlert.alloc().init();
    alert.informativeText =  "Enter your words and hit OK";
    alert.setMessageText('WordCloud');
    alert.addButtonWithTitle('Ok');
    alert.addButtonWithTitle('Cancel');
    alert.setAccessoryView(accessoryView);

    var responseCode = alert.runModal();

    var words = wordField.stringValue();
    // var random = 0;
    // if ([checkBox state]==NSOnState) {
        //   random = 1
        // }
        // var strokewidth = widthInput.floatValue();
        // var strokecolor = colorInput.stringValue();

        return [responseCode, words];
    };