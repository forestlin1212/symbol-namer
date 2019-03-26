var UI = require("sketch/ui"),
  DOM = require("sketch/dom");

export function onRename(context) {
  var document = DOM.getSelectedDocument();

  var selectedLayers = document.selectedLayers.map(layer => layer).filter(layer => layer.type === 'SymbolInstance');
  var selectedCount = selectedLayers.length;
  
  if (selectedCount === 0) {
    UI.message('Select one or more symbols');
  } else {
    let renamedCount = 0;
    selectedLayers.forEach(layer => {
      //get SymbolMaster name
      var layerSymbolMasterName = layer.master.name;
      var lastSlashIndex = layerSymbolMasterName.lastIndexOf('/');
      if(lastSlashIndex > -1){ //get short SymbolMaster name
        layerSymbolMasterName = layerSymbolMasterName.substring(lastSlashIndex+1);
      }
      
      var overrides = layer.overrides.filter(override => override.property === 'stringValue' && override.sketchObject.isEditable());
      var overrideCount = overrides.length;

      if (overrideCount > 0) {
        layer.name = overrides[0].value;
        renamedCount++
      }
      else if(layer.name != layerSymbolMasterName){
        //for the layers without text override, use the SymbolMaster name
        layer.name = layerSymbolMasterName;
        renamedCount++
      }
    });
    switch (renamedCount) {
      case 0:
        UI.message("None of the selected symbols renamed");
        break;
      case 1:
        UI.message("1 symbol renamed");
        break;
      default:
        UI.message(`${renamedCount} symbols renamed`);
    }
  }
}