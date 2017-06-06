function onRun(context) {
    var sketch = context.api();
    var document = sketch.selectedDocument;
    var page = document.selectedPage;

    userData = createSettingsPanel();

    if(userData[0] !== 1000) return false;

    var separatorSet = NSCharacterSet.characterSetWithCharactersInString(',');
    var words= userData[1].componentsSeparatedByCharactersInSet(separatorSet);
    var textLayers = [];
    var placedTextLayers = [];
    var oldFontSize = 12;

    for (var i=0; i < words.length; i++) {
        var fontSize = randomFontSize(userData[2], userData[3]);
        var nl = page.newText({alignment: NSTextAlignmentLeft, systemFontSize: fontSize, text: words[i].trim()});
        nl.adjustToFit();
        textLayers[i] = nl;
        oldFontSize = fontSize;
    }
    var max_size_all = findMaxSize(textLayers);
    for (var j = 0; j < textLayers.length; j++) {
      // log("\n ***** placing layer " + j + " ******");
      tmpFrame = textLayers[j].frame;
      // rotate the layer
      if (rotateLayer(userData[4])) {
        textLayers[j]['_object'].setRotation(90.0);
        tmpFrame = findFreePosition(flipFrame(tmpFrame), placedTextLayers, max_size_all);
      } else {
        tmpFrame = findFreePosition(tmpFrame, placedTextLayers, max_size_all);
      }
      textLayers[j].frame = tmpFrame;
      placedTextLayers.push(textLayers[j]);
    }
};

function randomFontSize(min, max) {
    var fsize = Math.floor((Math.random() * parseInt(max)) + parseInt(min));
    return fsize;
}

function rotateLayer(vProbability) {
  var r_number = Math.round(Math.random() * 100);
  if(r_number <= vProbability) { return true; }
  return false;
}

function flipFrame(f) {
  return { x: f.y, y: f.x, width: f.height, height: f.width };
}

function findFreePosition(tmpFrame, placedTextLayers, max_size_all) {
  var max_size_placed = findMaxSize(placedTextLayers);
  var x_or_y = Math.round(Math.random() * 100);

  if(placedTextLayers.length == 0) {
    tmpFrame.x = max_size_all['center_x'] - Math.round(tmpFrame.width / 2);
    tmpFrame.y = max_size_all['center_y'] - Math.round(tmpFrame.height / 2);
    return tmpFrame;
  }
  // log(max_size_all);
  // log(max_size_placed);
  if(x_or_y < 50) {
    tmpFrame.x = max_size_placed['max_x'];
    tmpFrame.y = max_size_placed['min_y'];
    // log('place at max XXX');
  } else {
    tmpFrame.x = max_size_placed['min_x'];
    tmpFrame.y = max_size_placed['max_y'];
    // log('place at max YYY');
  }
  // log(tmpFrame);
  return tmpFrame;
}

function findMaxSize(textLayers) {
  var max_width = 0, max_height = 0, max_x = 0, min_x = 0, max_y = 0, min_y = 0;
  for (var i = 0; i < textLayers.length; i++) {
    tmpFrame = textLayers[i].frame;
    if(tmpFrame.width > max_width) { max_width = tmpFrame.width; }
    if(tmpFrame.height > max_height) { max_height = tmpFrame.height; }
    if((tmpFrame.x + tmpFrame.width) > max_x) { max_x = tmpFrame.x + tmpFrame.width; }
    if((tmpFrame.y + tmpFrame.height) > max_y) { max_y = tmpFrame.y + tmpFrame.height; }
    if(tmpFrame.x < min_x) { min_x = tmpFrame.x; }
    if(tmpFrame.y < min_y) { min_y = tmpFrame.y; }
  }
  return { 
    max_width: max_width, 
    max_height: max_height, 
    max_x: max_x, 
    max_y: max_y, 
    min_x: min_x, 
    min_y: min_y,
    center_x: Math.round(max_width / 2),
    center_y: Math.round(max_height / 2)
  };
}

function debugAlert(msg) {
    alert = NSAlert.alloc().init();
    alert.setMessageText(msg);
    alert.addButtonWithTitle('Ok');
    return alert.runModal();
}

function createSettingsPanel(){
    var accessoryView = NSView.alloc().initWithFrame(NSMakeRect(0,20,300,160));

    var minFontSizeLabel = createLabel(NSMakeRect(0,130,100, 25), 'Minimum font size');
    var minFontSize = NSTextField.alloc().initWithFrame(NSMakeRect(0,117,24,25));
    minFontSize.setStringValue('12');

    var maxFontSizeLabel = createLabel(NSMakeRect(108,130,100,25), 'Maximum font size');
    var maxFontSize = NSTextField.alloc().initWithFrame(NSMakeRect(108,117,24,25));
    maxFontSize.setStringValue('36');

    var wordFieldLabel = createLabel(NSMakeRect(0,85,200,25), 'Words for cloud (separate by comma)');
    var wordField = NSTextField.alloc().initWithFrame(NSMakeRect(0,72,220,25));
    wordField.setStringValue('Lorem, ipsum, dolor, sit, amet, consectetuer, adipiscing, elit., Aenean, commodo');

    var verticalRandomnessLabel = createLabel(NSMakeRect(0,40,200,25), 'Vertical probability');
    var verticalRandomness      = NSTextField.alloc().initWithFrame(NSMakeRect(0,27,50,25));
    verticalRandomness.setIntegerValue(50);

    accessoryView.addSubview(minFontSizeLabel);
    accessoryView.addSubview(minFontSize);
    accessoryView.addSubview(maxFontSizeLabel);
    accessoryView.addSubview(maxFontSize);
    accessoryView.addSubview(wordFieldLabel);
    accessoryView.addSubview(wordField);
    accessoryView.addSubview(verticalRandomnessLabel);
    accessoryView.addSubview(verticalRandomness);

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
    var vrand = verticalRandomness.integerValue();

    return [responseCode, words, minfs, maxfs, vrand];
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