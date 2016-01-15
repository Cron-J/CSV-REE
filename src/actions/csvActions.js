import * as types from 'constants/ActionTypes';
import * as messageActions from '../common/messageComponent/actions/messageActions';
import api from 'utils/api/csv';

export function changeView(view) {
  return { type: types.HANDLECHANGEVIEW, payload: { view } };
}

export function editChangeView(view) {
  return { type: types.HANDLEEDITCHANGEVIEW, payload: { view } };
}

export function autoMapCheck(data) {
  return { 
    type: types.AUTOMAPCHECK 
  };
}
export function loadMappingList() {
  return  {
    types: [types.LOADLIST, types.LOADLISTSUCCESS, types.LOADLISTFAIL],
    payload: {
      response: api.getMappingList().then(response => response)
    }
  };
}

export function redirectEdit(id) {
  return {
    type: types.HANDLEREDIRECT,
    meta: {
      transition: () => ({
          path: '/mapping/edit/'+id
      })
    }
  }
}

export function getMapInfo(id) {
  return  {
    types: [types.GETMAPINFO, types.GETMAPINFOSUCCESS, types.GETMAPINFOFAIL],
    payload: {
      response: api.getMapping(id).then(response => response),
      id
    },
    meta: {
      transition: () => ({
        onSuccess: (response) =>({
          func: () => {
            return redirectEdit(id);
          }
        }),
        onFail: (response) =>({
          func: () => {
            return messageActions.showmessages('Unable to get selected mapping info.', 'error');
          }
        })
      })
    }
  };
}

 
export function startFileupload(file) {
  return {
    type: types.HANDLECSVUPLOAD,
    payload: {
      file
    }
  };
}

export function handleMappingName(mappingName) {
  return {
    type: types.HANDLEMAPPINGNAME,
    payload: {
      mappingName
    }
  };
}
export function nextview() {
  return {
    type: types.HANDLECSVNEXTVIEW
  };
}

function validateTable(table, actualTable, data){
  let validate = false;
  for(let i=0; i<data.csv.mapping.tableRequiredFields[table].length; i++){
    let valid = false;
    for(let j=0; j<data.csv.mapping.mappingData.length; j++){
      if(data.csv.mapping.mappingData[j].actualTable === actualTable && data.csv.mapping.mappingData[j].field === data.csv.mapping.tableRequiredFields[table][i]){
        valid = true;
      }
    }
    validate = valid;
  }
  return validate;
}

function check(mappedTable, singlemapping){
  for(let i=0; i<mappedTable.length; i++){
    if(mappedTable[i].actualTable === singlemapping.actualTable)
      return false;
  }
  return true;
}

function mappingValidation(data){
  let mappedTable = [];
  for(let i=0; i<data.csv.mapping.mappingData.length; i++){
    let c = check(mappedTable, data.csv.mapping.mappingData[i]);
    if(c)
      mappedTable.push({'table':data.csv.mapping.mappingData[i].table,'actualTable':data.csv.mapping.mappingData[i].actualTable});
  }
  for(let table in data.csv.mapping.tableRequiredFields){
    for(let i=0; i<mappedTable.length; i++){
      if(mappedTable[i].table === table)
        if(validateTable(table, mappedTable[i].actualTable, data)){
          concole.log('next');
        }else{
          console.log('All required properties should be mapped.');
          return messageActions.showmessages('All required properties should be mapped.', 'error');
        }
    }
  }
}

export function saveMappedData(data) {
  //return mappingValidation(data);
  if(data.params.id) {
    return updateMappedData(data.csv, data.params.id);
  } else {
    return createMappedData(data.csv);
  }
}

function createMappedData(data) {
  if(data.mapping.mappingName){
    return {
      types: [types.SAVEMAPPEDDATA, types.SAVEMAPPEDDATASUCCESS, types.SAVEMAPPEDDATAERROR],
      payload: {
        response: api.saveMappedData(data).then(response => response)
      }
    };
  }else {
    return messageActions.showmessages('Please enter the mapping name', 'error');
  }
}
function updateMappedData(data,id) {
  return {
    types: [types.UPDATEMAPPING, types.UPDATEMAPPINGSUCCESS, types.UPDATEMAPPINGFAIL],
    payload: {
      response: api.updateMapping(data, id).then(response => response),
      data
    },
    meta: {
      transition: () => ({
        onSuccess: (response) =>({
          func: () =>{
            return messageActions.showmessages('sucessfully mapping has updated', 'success');
          }
        }),
        onFail: (error) =>({
          func: () =>{
            return messageActions.showmessages(error, 'error');
          }
        })
      })
    }
  };
}

export function autoMapping() {
  return {
    type: types.HANDLEAUTOMAPPING
  };
}
export function handleSynonymsList() {
  return {
    types: [types.GETSYNONYMSLIST, types.GETSYNONYMSLISTSUCCESS, types.GETSYNONYMSLISTERROR],
    payload: {
      response: api.synonymsList().then(response => response)
    }
  };
}

export function attributeMapping() {
  return {
    type: types.HANDLEATTRIBUTEMAPPING
  };
}

export function defaultValueChange(defaultValue) {
  return {
    type: types.HANDLEDEFAULTVALUECHANGE,
    payload: {
      defaultValue
    }
  };
}
export function dataMapping() {
  return {
    type: types.HANDLECSVMAPPING
  };
}

export function addMapping() {
  return {
    type: types.HANDLECSVMAPADD
  }
}

export function removeMapping() {
  return {
    type: types.HANDLECSVMAPREMOVE
  }
}

export function removeMapData(rowid) {
  return {
    type: types.HANDLECSVMAPDATAREMOVE,
    payload: {
      rowid
    }
  }
}

export function updateMapTransformation(rowid, transition) {
  return {
    type: types.HANDLECSVMAPTRANSFORMATION,
    payload: {
      rowid,
      transition
    }
  }
}

export function previousview() {
  return {
    type: types.HANDLECSVPREVIOUSVIEW
  };
}

export function changeTableIndex(table) {
  return {
    type: types.HANDLECSVMAPTABLEINDEXCHANGE,
    payload: {
      table
    }
  };
}

export function uploadFile(file, uploaded) {
  if (uploaded) {
    return nextview();
  } else {
    return _uploadFile(file);
  }
}

export function loadTables() {
  return {
    type: types.HANDLECSVLOADTABLES
  };
}

export function changeColumn(column) {
  return {
    type: types.HANDLECSVMAPCOLUMNCHANGE,
    payload: {
      column
    }
  };
}

export function changeTable(table) {
  return {
    type: types.HANDLECSVMAPTABLECHANGE,
    payload: {
      table
    }
  };
}

export function changeProperty(property) {
  return {
    type: types.HANDLECSVMAPPROPERTYCHANGE,
    payload: {
      property
    }
  };
}

export function changeHeader(check) {
  return {
    type: types.HANDLECSVPREVIEWHEADERCHANGE,
    payload: {
      check
    }
  };
}

export function changeDelimiter(delimiter) {
  return {
    type: types.HANDLECSVPREVIEWDELIMITER,
    payload: {
      delimiter
    }
  };
}

export function changeNumber(numberformat) {
  return {
    type: types.HANDLECSVPREVIEWNUMBER,
    payload: {
      numberformat
    }
  };
}

export function changeDate(dateformat) {
  return {
    type: types.HANDLECSVPREVIEWDATE,
    payload: {
      dateformat
    }
  };
}

export function resetPreviewSetting() {
  return {
    type: types.HANDLEPREVIEWSETTING
  };
}

export function _uploadFile(file) {
  return {
    types: [types.DUMMY, types.HANDLECSVUPLOADSUCCESS, types.HANDLECSVUPLOADFAIL],
    payload: {
      response: api.uploadCSV(file).then(response => response),
      file
    }
  };
}
