function onRun(context) {
  var sketch = context.api()

  // Next we want to extract the selected page of the selected (front-most) document
  var document = sketch.selectedDocument
  var page = document.selectedPage

  // Now let's create a new text layer, using a large font, and a traditional value...
  var layer = page.newText({alignment: NSTextAlignmentCenter, systemFontSize: 36, text:"Hello World"})

  // ...resize it so that the text just fits...
  layer.resizeToFitContents()

  document.centerOnLayer(layer)
};