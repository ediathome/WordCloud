function onRun(context) {
    var sketch = context.api();
    var document = sketch.selectedDocument;
    var page = document.selectedPage;

    userData = createSettingsPanel();

    if(userData[0] !== 1000) return false;

    var separatorSet = NSCharacterSet.characterSetWithCharactersInString(',');
    var words= userData[1].componentsSeparatedByCharactersInSet(separatorSet);
    var textLayers = [];
    var oldFontSize = 12;

    for (var i=0; i < words.length; i++) {
        var fontSize = randomFontSize(userData[2], userData[3]);
        var nl = page.newText({alignment: NSTextAlignmentLeft, systemFontSize: fontSize, text:words[i].trim()});
        if(i>0) {
            tmpFrame = textLayers[i-1].frame;
            tmpFrame.y += oldFontSize;
            nl.frame = tmpFrame;
        }
        nl.adjustToFit();
        textLayers[i] = nl;
        oldFontSize = fontSize;
    }
};

function randomFontSize(min, max) {
    var fsize = Math.floor((Math.random() * parseInt(max)) + parseInt(min));
    return fsize;
}

function debugAlert(msg) {
    alert = NSAlert.alloc().init();
    alert.setMessageText(msg);
    alert.addButtonWithTitle('Ok');
    return alert.runModal();
}

function createSettingsPanel(){
    var accessoryView = NSView.alloc().initWithFrame(NSMakeRect(0,20,278,100));

    var minFontSizeLabel = createLabel(NSMakeRect(0,63,100, 25), 'Minimum font size');
    var minFontSize = NSTextField.alloc().initWithFrame(NSMakeRect(0,45,24,25));
    minFontSize.setStringValue('12');

    var maxFontSizeLabel = createLabel(NSMakeRect(108,63,100,25), 'Maximum font size');
    var maxFontSize = NSTextField.alloc().initWithFrame(NSMakeRect(108,45,24,25));
    maxFontSize.setStringValue('36');

    var wordFieldLabel = createLabel(NSMakeRect(0,15,200,25), 'Words for cloud (separate by comma)');
    var wordField = NSTextField.alloc().initWithFrame(NSMakeRect(0,0,220,25));
    wordField.setStringValue('Lorem, ipsum, ');

    accessoryView.addSubview(minFontSizeLabel);
    accessoryView.addSubview(minFontSize);
    accessoryView.addSubview(maxFontSizeLabel);
    accessoryView.addSubview(maxFontSize);
    accessoryView.addSubview(wordFieldLabel);
    accessoryView.addSubview(wordField);

    var alert = NSAlert.alloc().init();
    alert.informativeText =  "Enter your words and hit OK";
    alert.setMessageText('WordCloud');
    alert.addButtonWithTitle('Ok');
    alert.addButtonWithTitle('Cancel');
    alert.setAccessoryView(accessoryView);

    var responseCode = alert.runModal();

    var minfs = minFontSize.stringValue();
    var maxfs = maxFontSize.stringValue();
    var words = wordField.stringValue();
    // var random = 0;
    // if ([checkBox state]==NSOnState) {
    //   random = 1;
    // }
    // var strokewidth = widthInput.floatValue();
    // var strokecolor = colorInput.stringValue();

    return [responseCode, words, minfs, maxfs];
};

function createLabel(rect, uistring){
    var label = NSTextField.alloc().initWithFrame(rect)
    label.setStringValue(uistring);
    setupAsLabel(label)
    return label;
}

function setupAsLabel(v){
    v.setDrawsBackground(false);
    v.setEditable(false);
    v.setEditable(false);
    v.setSelectable(false);
    v.setBezeled(false);
    v.setFont([NSFont systemFontOfSize:10]);
}