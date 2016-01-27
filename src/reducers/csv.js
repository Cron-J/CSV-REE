import * as types from 'constants/ActionTypes';
import { createReducer } from 'redux-create-reducer';
import moment from 'moment';
import tables from '../utils/appfunc/tablelist';
import _ from 'underscore';

const initialState = {
  upload: {
    fileFormats: ['.csv', '.txt'],
    fileinfo: {
      name: '',
      type: '',
      size: 0
    },
    uploaded: false,
    error: ''
  },
  block: ['next', 'prev'],
  preview: {
    resultdata: {},
    originaldata: {},
    delimiter: ',',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: '#,###.##',
    noHeader: true,
    setters: {
      dateformat: [
        {value: 'DD-MM-YYYY', label: 'DD-MM-YYYY'}, 
        {value: 'MM/DD/YYYY', label: 'MM/DD/YYYY'}
      ],
      numberformat: [
        {value: '#,###.##', label: '1,000.00'},
        {value: '#.##', label: '1.00'},
        {value: '#,##', label: '1,00'},
        {value: '#.###,##', label: '1.000,00'}
      ],
      delimiterformat: [
        {value: ',', label: 'Comma: 1,2'},
        {value: ';', label: 'Semicolon: 1;2'},
        {value: '|', label: 'Pipe: 1|2'}
      ]
    }
  },
  mapping: {
    mappingName: '',
    childTables: [],
    remove: false,
    columns: [],
    tables: [],
    properties: [],
    tableObject: '',
    currentColumn: '',
    currentTable: '',
    selectedTable: '',
    currentProperty: '',
    defaultValue: '',
    mappingData: [],
    mappedColumn: [],
    mappedProperty: [],
    requiredProperty: [],
    selectedChildTableIndex: ''
  },
  synonymsList: [],
  importer: {},
  currentview: 'upload',
  autoMap:false,
  order: ['upload', 'preview', 'mapping', 'import']
};

function blockers(view, data) {
  switch (view) {
  case 'upload':
    if (data.uploaded === true || data.fileinfo.name.length > 0) {
      return ['prev'];
    }
    return ['prev', 'next'];
    break;
  default:
    return [];
    break;
  }
}

function updateIndexes(mapping){
  for(let i=0; i<mapping.childTables.length; i++){
    for(let j=0; j<mapping.childTables[i].children.length; j++){
      mapping.childTables[i].children[j].index = j;
    }
  }
  return mapping;
}

function mappingChildTableIndex(mapping,table){
  for(let i=0; i<mapping.mappingData.length; i++){
    mapping.mappingData[i].indx = i;
    if(mapping.mappingData[i].table == table && mapping.mappingData[i].index>0){
      mapping.mappingData[i].index = mapping.mappingData[i].index -1;
    }
  }
  return mapping;
}

function updateEllipsis(mapping){
  for(let i=0; i<mapping.mappingData.length; i++){
    for(let j=0; j<mapping.childTables.length; j++){
      if(mapping.mappingData[i].table == mapping.childTables[j].value){
        if(!mapping.childTables[j].children[mapping.mappingData[i].index].ellipsis)
          mapping.childTables[j].children[mapping.mappingData[i].index].ellipsis = [];
        mapping.childTables[j].children[mapping.mappingData[i].index].ellipsis = mapping.mappingData[i].ellipsis;
      }
    }
  }
  mapping = mappedColPro(mapping);
  return mapping;
}

function mappedColPro(state){
  state.mappedProperty=[];
  state.mappedColumn = [];
  console.log(state.mappingData);
  for(let i=0; i<state.mappingData.length; i++){
    let obj = {};
    let ellipsis = state.mappingData[i].ellipsis;
    let selectedTableIndex = state.mappingData[i].index;
    obj[state.mappingData[i].table] = {'property':state.mappingData[i].field, 'index': state.mappingData[i].index};
    state.mappedProperty.push(obj);
    state.mappedColumn.push(state.mappingData[i].userFieldName);
    for(let index=0; index<state.childTables.length; index++){
      if(state.childTables[index].value == state.mappingData[i].table){
        state.childTables[index].children[state.mappingData[i].index] = 
        {
          'children': [],
          'label':state.mappingData[i].actualTable,
          'value':state.mappingData[i].actualTable,
          'index': state.mappingData[i].index,
          'ellipsis': state.mappingData[i].ellipsis

        }
      }
    }
  }
  return state;
}
function isSuccess(currentview, view, state) {
  switch (view) {
    case 'upload':
      return true;
      break;
    case 'preview':
      if (state.upload.uploaded === true || state.order.indexOf(currentview) > state.order.indexOf(view)) {
        return true;
      }
      return false;
      break;
    case 'mapping':
      if (state.preview.resultdata.data || state.order.indexOf(currentview) > state.order.indexOf(view)) {
        return true;
      }
      return false;
      break;
    default:
      return false;
      break;
  }
}

function formatDate(data, fromdateformat, todateformat) {
    const momentdate = moment(data, fromdateformat);
    if (momentdate.format(fromdateformat) === data) {
      return momentdate.format(todateformat);
    }
  
  return data;
}

function formatNumber(data, numberformat) {
  switch(numberformat) {
  case '#,##':
    if(data.indexOf(',')<0) {
      data = data + ',00';
    }
    break;
  case '#.##':
    if(numberformat.indexOf('.')<0)
      data = data + '.00';
    break;
  case '#,###.##':
    if (data.toString().length > 5) {
      data = (data*100 / 100);
      var str = data.toString().split('.');  
      if (str[0].length >= 4) {
          str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      }
      if (str[1] && str[1].length >= 4) {
          str[1] = str[1].replace(/(\d{3})/g, '$1 ');
      }
      data = str.join('.');
      if(data.indexOf('.') < 0) {
          data = data + '.00';
      }
    }
    break;
  case '#.###,##':
    let str = data.toString();
    if (str.length > 5) {
      str = data.slice(0, -5) + '.' + data.slice(-3) + '.' + data.slice(-3); 
      data = str;
      if(data.indexOf(',') < 0) {
        data = data + ',00';
      }
    }
    break;
  default:
    break;
  }
  return data;
}

function formatPreviewData(responsedata, delimiter, numberformat, fromdateformat, todateformat) {
  const dataarray = [];
  const headers = responsedata['headers'].split(delimiter);
  for (let key in responsedata) {
    if (key !== 'headers' && key !== 'fileName') {
      const object = {};
      let keyCount = 0;
      const data  = responsedata[key].split(delimiter);
      for (let i = 0; i < data.length; i++) {
        let finaldata = formatDate(data[i], fromdateformat, todateformat);
        if (!isNaN(data[i])) {
          finaldata = formatNumber(data[i], numberformat);
        }
        object[headers[keyCount]] = finaldata;
        keyCount++;  
      }
      dataarray.push(object);
    }
  }
  return {headers: headers, data: dataarray};
}

function formatPreviewHeader(previewdata, check) {
  const newpreviewdata = JSON.parse(JSON.stringify(previewdata));
  let headers = [];
  const newdata = [];

  if (!check) {
    const headerdataobject = {};

    for (let i = 0; i < newpreviewdata.headers.length; i++) {
      const columnname = 'Column' + (i + 1);
      headers.push(columnname);
      headerdataobject[columnname] = newpreviewdata.headers[i];
    }
    newdata.push(headerdataobject);
    for (let i = 0; i < newpreviewdata.data.length; i++) {
      const newObject = {};
      let keyCount = 0;
      for (let key in newpreviewdata.data[i]) {
        if (key) {
          newObject[headers[keyCount]] = newpreviewdata.data[i][key];
          keyCount++;
        }
      }
      newdata.push(newObject);
    }
    newpreviewdata.headers = headers;
    newpreviewdata.data = newdata;
  } else {
    headers = newpreviewdata.headers;

    for (let i = 0; i < newpreviewdata.data.length; i++) {
      const newObject = {};
      let keyCount = 0;
      for (let key in newpreviewdata.data[i]) {
        if (key) {
          newObject[headers[keyCount]] = newpreviewdata.data[i][key];
          keyCount++;
        }
      }
      newdata.push(newObject);
    }
    newpreviewdata.headers = headers;
    newpreviewdata.data = newdata;
  }
  return newpreviewdata;
}

function formatPreview (data, delimiter, headercheck, numberformat, fromdateformat, todateformat) {
  const previewdata = formatPreviewData(data, delimiter, numberformat, fromdateformat, todateformat);
  return formatPreviewHeader(previewdata, headercheck);
}

function getProps (table, tablename, callback) {
  let found = false;
  if (table) {
    for (let key in table) {
      if (key === tablename) {
        callback(table[key]);
      }
      getProps(table[key].children, tablename, callback);
    }
  }
}

function getPropertiesoftable(tablename, mapping) {
  let table = {};
  let props = [];
  let required = [];
  getProps(tables, tablename, function(tableObject){
    table = tableObject
  });
  
  _.each(table, function(val, key){
    if (val.isRequired) {
      required.push(key);
    }
    if (key != 'children') {
      props.push({label: key, value: key});
    }
  });
  mapping.properties = props;
  mapping.requiredProperty = required;
}

function getTableName (childTables, tablename) {
  for (let i = 0; i < childTables.length; i++) {
    for (let j = 0; j < childTables[i].children.length; j++) {
      if (childTables[i].children[j].value === tablename) {
        return childTables[i].value;
      }
    }
  }
  return null;
}

function getChildTableAndIndex (tablename) {
  let index = tablename.replace ( /[^\d.]/g, '' );
  if(index.length>0)
    return parseInt(index);
  else
    return 0;
}

function mapData(mapping){
  let currentTable = mapping.selectedTable.split('(');
  let valueobject = {};
  let ellips;
  for (let i = 0; i < mapping.childTables.length; i++) {
    if (mapping.childTables[i].value === currentTable[0]) {
      console.log('===',mapping.childTables)
      if(!mapping.childTables[i].children[mapping.selectedChildTableIndex].ellipsis){
        mapping.childTables[i].children[mapping.selectedChildTableIndex].ellipsis = [];
      }
      mapping.childTables[i].children[mapping.selectedChildTableIndex].ellipsis.push(mapping.currentColumn);
      ellips = mapping.childTables[i].children[mapping.selectedChildTableIndex].ellipsis;
      break;
    }
  }
  mapping.mappedColumn.push(mapping.currentColumn);
  let obj = {};
  obj[currentTable[0]] = {'property': mapping.currentProperty, 'index': mapping.selectedChildTableIndex};
  mapping.mappedProperty.push(obj);
  //let index = getChildTableAndIndex(mapping.selectedTable);
  mapping.mappingData.push({
      "userFieldName": mapping.currentColumn,
      "transformations": [],
      "table": currentTable[0],
      "field": mapping.currentProperty,
      "actualTable": mapping.selectedTable,
      "defaultValue": mapping.defaultValue,
      "index": mapping.selectedChildTableIndex,
      'indx': mapping.mappingData.length,
      'ellipsis': ellips,
      "instance": '',
      "isRequired": ''
    });
  return mapping;
}
function attributeMapping(mapping) {
  mapping.currentTable = 'attributeValues'
    let index = -1;
    let childIndex = 0;
    let valueobject = {};
    let tablename;
    for (let i = 0; i < mapping.childTables.length; i++) {
      if (mapping.childTables[i].value === mapping.currentTable) {
        index = i;
        valueobject = mapping.childTables[i];
        childIndex = valueobject.children.length;
        break;
      }
    }
    if (index > -1) {
      const length = mapping.childTables[index].children.length;
      tablename = mapping.currentTable;
      valueobject.children.push({label: tablename, value: tablename, ellipsis:[mapping.currentColumn], index:length});
      mapping.childTables[index] = valueobject;
      mapping.tableObject = tablename;
      mapping.remove = true;
    }
  const mapField1 = {
    "userFieldName": mapping.currentColumn,
    "transformations": [],
    "field": 'value',
    "defaultValue": '',
    "index": childIndex,
    "indx": mapping.mappingData.length,
    "instance": '',
    "actualTable": tablename,
    "table": 'attributeValues',
    "ellipsis":[mapping.currentColumn],
    "isRequired": true
  };
  let obj = {};
  obj[mapField1.table] = {'property': 'value', 'index': childIndex};
  mapping.mappedProperty.push(obj);
  const mapField2 = {
    "userFieldName": '"'+mapping.currentColumn+'"',
    "transformations": [],
    "field": 'attribute',
    "defaultValue": mapping.currentColumn,
    "index": childIndex,
    "indx": mapping.mappingData.length+1,
    "actualTable": tablename,
    "instance": '',
    "ellipsis":[mapping.currentColumn],
    "table": 'attributeValues',
    "isRequired": true
  };
  let obj1 = {};
  obj1[mapField2.table] = {'property': 'attribute', 'index': childIndex};
  mapping.mappedProperty.push(obj1);
  mapping.mappedColumn.push(mapping.currentColumn);
  mapping.mappingData.push(mapField1);
  mapping.mappingData.push(mapField2);
  return mapping;
}

function autoMapping(currentState) {
  let synonymsList = currentState.synonymsList;
    for(let i in currentState.mapping.columns){

      for( let index in synonymsList){

        for(let indx in synonymsList[index].synonyms){

          let column =  currentState.mapping.columns[i].value;
          if(synonymsList[index].synonyms[indx] == column.toLowerCase()){

            let obj = {};
            obj[synonymsList[index].tableName] = {'property': index, 'index': '0'};
            currentState.mapping.mappedProperty.push(obj);
            currentState.mapping.mappedColumn.push(column);
            currentState.mapping.mappingData.push({
              "userFieldName": column,
              "transformations": [],
              "table": synonymsList[index].tableName,
              "field": index,
              "defaultValue": currentState.mapping.defaultValue,
              "index": currentState.mapping.mappingData.length + 1,
              "indx": currentState.mapping.mappingData.length,
              'actualTable': synonymsList[index].tableName,
              "instance": '',
              "isRequired": ''
            });
          }
        }
      }
      break;
    }
  currentState.mapping.selectedTable = 'product';
  return currentState.mapping;
}

function childTab(currentState){
  console.log('currentState.mapping.mappedData--00--', currentState.mapping.mappedData);
  /*let mappingData = currentState.mapping.mappedData;
  for(let i=0; i<mappingData.length; i++){
    for(let index=0; index<currentState.mapping.tables[0].children.length; index++){
      if(mappingData[i].table == currentState.mapping.tables[0].children[index].value){
        currentState.mapping.tables[0].children[index].children.push({'value':currentState.mapping.tables[0].children[index].value+'('+currentState.mapping.tables[0].children[index].children.length+')','label':currentState.mapping.tables[0].children[index].value+'('+currentState.mapping.tables[0].children[index].children.length+')'});
      }
    }
  }*/
  return currentState.mapping.tables;
}
export default createReducer(initialState, {
  [types.HANDLECHANGEVIEW](state, action) {
    let { view } = action.payload;
    if (!isSuccess(state.currentview, view, state)){
      view = state.currentview;
    }
    return {
      ...state,
      currentview: view,
      block: blockers(view, state[view])
    };
  },
  [types.HANDLECSVUPLOAD] (state, action) {
    const { file } = action.payload;
    const upload = state.upload;
    upload.fileinfo = file;
    return {
      ...state,
      block: blockers(state.currentview, upload),
      upload: upload
    };
  },
  [types.HANDLECSVUPLOADSUCCESS] (state, action) {
    let fileName = action.payload.response.body.fileName;
    const {response} = action.payload;
    const preview = state.preview;
    const upload = state.upload;
    const index = state.order.indexOf(state.currentview);
    state.upload.fileName = fileName;
    let view = state.currentview;
    preview.originaldata = response.body;
    preview.resultdata = formatPreview(response.body, preview.delimiter, preview.noHeader, preview.numberFormat, preview.dateFormat, preview.dateFormat);
    upload.uploaded = true;
    if (index > -1) {
      view = state.order[index+1];
    }
    return {
      ...state,
      preview: preview,
      currentview: view,
      block: blockers(view, state.preview),
      upload: upload
    };
  },
  [types.HANDLECSVUPLOADFAIL] (state, action) {
    return {
      ...state,
      block: ['next', 'prev']
    };
  },
  [types.HANDLECSVNEXTVIEW] (state, action) {
    const index = state.order.indexOf(state.currentview);
    let view = state.currentview;
    if (index > -1) {
      view = state.order[index+1];
    }
    return {
      ...state,
      currentview: view,
      block: blockers(view, state[view])
    };
  },
  [types.HANDLECSVPREVIOUSVIEW] (state, action) {
    const index = state.order.indexOf(state.currentview);
    let view = state.currentview;
    if (index > -1) {
      view = state.order[index-1];
    }
    return {
      ...state,
      currentview: view,
      block: blockers(view, state[view])
    };
  },
  [types.HANDLECSVPREVIEWHEADERCHANGE] (state, action) {
    const preview = state.preview;
    (preview.noHeader) ? preview.noHeader=false : preview.noHeader=true;
    preview.resultdata = formatPreview(preview.originaldata, preview.delimiter, preview.noHeader, preview.numberFormat, preview.dateFormat, preview.dateFormat);
    return {
      ...state,
      preview: preview
    }
  },
  [types.HANDLECSVPREVIEWDELIMITER] (state, action) {
    const {delimiter} = action.payload;
    const preview = state.preview;
    preview.delimiter = delimiter;
    preview.resultdata = formatPreview(preview.originaldata, delimiter, preview.noHeader, preview.numberFormat, preview.dateFormat, preview.dateFormat);
    return {
      ...state,
      preview: preview
    }
  },
  [types.HANDLECSVPREVIEWDATE] (state, action) {
    const {dateformat} = action.payload;
    const preview = state.preview;
    preview.resultdata = formatPreview(preview.originaldata, preview.delimiter, preview.noHeader, preview.numberFormat, preview.dateFormat, dateformat);
    preview.dateFormat = dateformat;
    return {
      ...state,
      preview
    };
  },
  [types.HANDLECSVPREVIEWNUMBER] (state, action) {
    const {numberformat} = action.payload;
    const preview = state.preview;
    preview.numberFormat = numberformat;
    preview.resultdata = formatPreview(preview.originaldata, preview.delimiter, preview.noHeader, numberformat, preview.dateFormat, preview.dateFormat);
    return {
      ...state,
      preview
    };
  },
  [types.HANDLEPREVIEWSETTING] (state, action) {
    const preview = state.preview;
    preview.numberFormat = '#,###.##';
    preview.dateFormat = 'MM/DD/YYYY';
    preview.delimiter = ',';
    preview.noHeader= true;
    preview.resultdata = formatPreview(preview.originaldata, preview.delimiter, preview.noHeader, preview.numberFormat, preview.dateFormat, preview.dateFormat);
    return {
      ...state,
      preview
    };
  },
  [types.HANDLECSVLOADTABLES] (state) {
    const mapping = state.mapping;
    const tableData = [];
    const tableRequiredFields = [];
    mapping.columns = _.map(state.preview.resultdata.headers, function(val){
      return {label: val, value: val};
    });
    let firsttable = '';
    for (firsttable in tables) break;
    const children = _.map(tables[firsttable].children, function(val, key) {
      var requiredField = [];
      for(let index in val){
        if(val[index].isRequired && val[index].isRequired === true){
          requiredField.push(index);
        }
      }
      tableRequiredFields[key] = requiredField;
      return {label: key, value: key, children: []};
    });

    tableData.push({label: firsttable, value: firsttable, children: children});
    mapping.tables = tableData;
    mapping.childTables = children;

    state.currentview = state.order[state.order.indexOf(state.currentview) + 1];
    
    mapping.currentTable = firsttable;
    getPropertiesoftable(firsttable, mapping);
    tableRequiredFields[firsttable] = mapping.requiredProperty;
    mapping.tableRequiredFields = tableRequiredFields;
    return {
      ...state,
      mapping
    }
  },
  [types.HANDLECSVMAPCOLUMNCHANGE] (state, action) {
    const {column} = action.payload;
    const mapping = state.mapping;
    mapping.currentColumn = column;
    return {
        ...state,
        mapping
    };
  },
  [types.HANDLECSVMAPTABLECHANGE] (state, action) {
    const {table} = action.payload;
    const mapping = state.mapping;
    mapping.currentTable = table;
    mapping.tableObject = '';
    mapping.currentProperty = '';
    mapping.remove = false;
    //getPropertiesoftable(table, mapping);
    return {
        ...state,
        mapping
    };
  },
  [types.HANDLECSVMAPPROPERTYCHANGE] (state, action) {
    const {property} = action.payload;
    const mapping = state.mapping;
    mapping.currentProperty = property;
    return {
        ...state,
        mapping
    };
  },
  [types.HANDLECSVMAPADD] (state) {
    const mapping = state.mapping;
    let index = -1;
    let valueobject = {};
    for (let i = 0; i < mapping.childTables.length; i++) {
      if (mapping.childTables[i].value === mapping.currentTable) {
        index = i;
        valueobject = mapping.childTables[i];
        break;
      }
    }
    if (index > -1) {
      const length = mapping.childTables[index].children.length;
      const tablename = mapping.currentTable;
      valueobject.children.push({label: tablename, value: tablename, index:length, ellipsis:[]});
      mapping.childTables[index] = valueobject;
      mapping.tableObject = tablename;
      mapping.remove = true;
    }
    return {
      ...state,
      mapping
    };
  },
  [types.HANDLECSVMAPREMOVE] (state) {
    let mapping = state.mapping;
    let mappedColumns = [];
    let updatedMapData = [];
    for(let k = 0; k < mapping.mappingData.length; k++) {
      if(mapping.mappingData[k].actualTable == mapping.currentTable){
        if(mapping.mappingData[k].index != mapping.selectedChildTableIndex){
          updatedMapData.push(mapping.mappingData[k]);
          mappedColumns.push(mapping.mappingData[k].userFieldName);
        }
      }else{
        updatedMapData.push(mapping.mappingData[k]);
        mappedColumns.push(mapping.mappingData[k].userFieldName);
      }

    }

    for (let i = 0; i < mapping.childTables.length; i++) {
      for (let j = 0; j < mapping.childTables[i].children.length; j++) {
        if (mapping.childTables[i].children[j].value === mapping.currentTable) {
          mapping.childTables[i].children.splice(j, 1);
          break;
        }
      }
    }
    mapping.mappingData = updatedMapData;
    mapping.mappedColumn = mappedColumns;
    mapping = mappingChildTableIndex(mapping,mapping.currentTable);
    mapping = updateIndexes(mapping);
    mapping.properties = [];
    mapping.tableObject = '';
    mapping.remove = false;
    mapping = updateEllipsis(mapping);
    return {
      ...state,
      mapping
    };
  },
  [types.HANDLECSVMAPTABLEINDEXCHANGE] (state, action) {
    let tableObject = action.payload.table;
    let tabl = tableObject.split('(');
    let table = tabl[0];
    let index = action.payload.index;
    table = table ? table : '';

    const mapping = state.mapping;
    mapping.selectedTable = table;
    mapping.selectedChildTableIndex = index;
    let isPrimarytable = false;
    for (let i = 0; i < mapping.tables.length; i++) {
      if (mapping.tables[i].value === table) {
        isPrimarytable = true;
        break;
      }
    }
    mapping.currentProperty='';
    if (!isPrimarytable) {
      mapping.tableObject = tableObject;
      const tableName = getTableName(mapping.childTables, table);
      getPropertiesoftable(tableName, mapping);
      mapping.remove = table.length > 0 ? true : false;
    } else {
      mapping.tableObject = mapping.tables[0].value;
      getPropertiesoftable(table, mapping);
      mapping.remove = false;
    }
    
    return {
      ...state,
      mapping
    };
  },
  [types.HANDLECSVMAPPING] (state, action) {
    let mapping = state.mapping;
    mapping = mapData(mapping);
    mapping.currentColumn=''; 
    mapping.currentProperty='';
    mapping.defaultValue = '';
    updateEllipsis(mapping);
    return {
      ...state,
      mapping
    }
  },
  [types.HANDLEATTRIBUTEMAPPING] (state, action) {
    let mapping = state.mapping;

    mapping = attributeMapping(mapping);
    mapping.currentColumn=''; 
    mapping.currentProperty='';
    return {
      ...state,
      mapping
    }
  },
  [types.HANDLEDEFAULTVALUECHANGE] (state, action) {
    const mapping = state.mapping;
    mapping.defaultValue = action.payload.defaultValue;
    mapping.currentColumn = '"'+action.payload.defaultValue+'"';

    return {
      ...state,
      mapping
    }
  },
  [types.HANDLECSVMAPDATAREMOVE] (state, action) {
    const { rowid } = action.payload;
    let mapping = state.mapping;
    for(let i=0; i<state.mapping.mappingData.length; i++){
      if(state.mapping.mappingData[i].index == state.mapping.mappingData[rowid].index && state.mapping.mappingData[i].ellipsis){
        let ellip = state.mapping.mappingData[i].ellipsis;
        let ellipsis = [];
        for(let x=0; x<ellip.length; x++){
          if(ellip[x] != state.mapping.mappingData[rowid].userFieldName){
            ellipsis.push(ellip[x]);
          }
        }
        state.mapping.mappingData[i].ellipsis = ellipsis;

      }
    }
    state.mapping = updateEllipsis(state.mapping);
    state.mapping.mappingData.splice(rowid, 1);
    for (let i = 0; i < state.mapping.mappingData.length; i++) {
      state.mapping.mappingData[i].indx = i;
    }
    state.mapping = updateEllipsis(state.mapping);
    //state.mapping = mappedColPro(state.mapping);
    return {
      ...state
    }
  },
  [types.GETSYNONYMSLISTSUCCESS] (state, action) {
    const { data } = action.payload.response;
    return {
      ...state,
      synonymsList: action.payload.response.result
    };
  },
  [types.HANDLEAUTOMAPPING] (state, action) {
    const mapping = autoMapping(state);
    return {
      ...state,
      mapping
    };
  },
  [types.SAVEMAPPEDDATASUCCESS] (state, action) {
    const response = action.payload.response;
    state.currentview = "import";
    state.block = ['prev','next'];
    state.importer.convertedJSON = response.convertedJSON;
    state.importer.id = response.id;
    state.importer.tenantId = response.tenantId;
    return {
      ...state
    }
  },
  [types.HANDLEMAPPINGNAME] (state, action) {
    const mapping = state.mapping;
    mapping.mappingName = action.payload.mappingName;
    return {
      ...state,
      mapping
    };
  },
  [types.HANDLECSVMAPTRANSFORMATION] (state, action) {
    const {rowid, transition} = action.payload;
    const mapping = state.mapping;
    mapping.mappingData[rowid].transformations = transition;
    return {
      ...state,
      mapping
    }
  },
  [types.LOADLISTSUCCESS] (state, action) {
    const { response } = action.payload;
    state.mappingList = response;
    return {
      ...state
    };
  },
  [types.GETMAPINFOSUCCESS] (state, action) {    
    let mapping = action.payload.response.mapping;
    let file = action.payload.response.file;
    let preview = state.preview;
    state.preview.originaldata = file;
    state.block = ['prev'];
    const tableData = [];
    let firsttable = '';
    for (firsttable in tables) break;

    const children = _.map(tables[firsttable].children, function(val, key) {

      return {label: key, value: key, children: []};
    });
    tableData.push({label: firsttable, value: firsttable, children: children});
    state.mapping.tables = tableData;
    state.mapping.childTables = children;
    state.mapping.mappingName = mapping.mappingName;
    state.mapping.mappedData = mapping.mappingInfo;
    state.mapping.mappingData = mapping.mappingInfo;
    state.mapping.tenantId = mapping.tenantId;
    state.mapping = mappedColPro(state.mapping);
    state.preview.resultdata = preview.resultdata = formatPreview(file, preview.delimiter, preview.noHeader, preview.numberFormat, preview.dateFormat, preview.dateFormat);
    state.mapping.columns = _.map(state.preview.resultdata.headers, function(val){
      return {label: val, value: val};
    });
    state.currentview = 'mapping';
    return {
      ...state
    }
  },
  [types.LOADLISTFAIL] (state, action) {
    return {
      ...state
    }
  },
  [types.HANDLEEDITCHANGEVIEW](state, action) {
    let { view } = action.payload;
    return {
      ...state,
      currentview: view,
      block: blockers(view, state[view])
    };
  },
  [types.GETMAPINFO] (state, action) {
    return {
      ...state
    };
  },
  [types.GETMAPINFOFAIL] (state, action) {
    return {
      ...state
    };
  },
  [types.AUTOMAPCHECK] (state, action) {
    state.autoMap = true;
    return {
      ...state
    }
  },
  [types.DOWNLOADDATASUCCESS] (state, action) {
    return {
      ...state
    }
  },
  [types.UPDATEMAPPINGSUCCESS] (state, action) {
    const response = action.payload.response;
    state.currentview = "import";
    state.block = ['prev','next'];
    state.importer.convertedJSON = response.convertedJSON;
    state.importer.id = response.id;
    state.importer.tenantId = response.tenantId;
    return {
      ...state
    }
  },
  [types.HANDLEEMPTYDEFAULTVALUE] (state, action){
    state.mapping.defaultValue = '';
    state.mapping.currentColumn = '';
    return {
      ...state
    }
  }
});
