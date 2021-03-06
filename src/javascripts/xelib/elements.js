// ENUMERATIONS
const elementTypes = ['etFile', 'etMainRecord', 'etGroupRecord', 'etSubRecord', 'etSubRecordStruct', 'etSubRecordArray', 'etSubRecordUnion', 'etArray', 'etStruct', 'etValue', 'etFlag', 'etStringListTerminator', 'etUnion', 'etStructChapter'];
const defTypes = [ 'dtRecord', 'dtSubRecord', 'dtSubRecordArray', 'dtSubRecordStruct', 'dtSubRecordUnion', 'dtString', 'dtLString', 'dtLenString', 'dtByteArray', 'dtInteger', 'dtIntegerFormater', 'dtIntegerFormaterUnion', 'dtFlag', 'dtFloat', 'dtArray', 'dtStruct', 'dtUnion', 'dtEmpty', 'dtStructChapter'];
const smashTypes = ['stUnknown', 'stRecord', 'stString', 'stInteger', 'stFlag', 'stFloat', 'stStruct', 'stUnsortedArray', 'stUnsortedStructArray', 'stSortedArray', 'stSortedStructArray', 'stByteArray', 'stUnion'];
const valueTypes = ['vtUnknown', 'vtBytes', 'vtNumber', 'vtString', 'vtText', 'vtReference', 'vtFlags', 'vtEnum', 'vtColor', 'vtArray', 'vtStruct'];

applyEnums(xelib, elementTypes, 'elementTypes');
applyEnums(xelib, defTypes, 'defTypes');
applyEnums(xelib, smashTypes, 'smashTypes');
applyEnums(xelib, valueTypes, 'valueTypes');

// ELEMENT HANDLING METHODS
xelib.HasElement = function(_id, path = '') {
    return GetBool(function(_bool) {
        if (!lib.HasElement(_id, wcb(path), _bool))
            Fail(`Failed to check if element exists at: ${elementContext(_id, path)}`);
    });
};
xelib.GetElement = function(_id, path = '', noException = false) {
    return GetHandle(function(_res) {
        if (!lib.GetElement(_id, wcb(path), _res))
            if (!noException) Fail(`Failed to get element at: ${elementContext(_id, path)}`);
    });
};
xelib.AddElement = function(_id, path = '') {
    return GetHandle(function(_res) {
        if (!lib.AddElement(_id, wcb(path), _res))
            Fail(`Failed to create new element at: ${elementContext(_id, path)}`);
    });
};
xelib.RemoveElement = function(_id, path = '') {
    if (!lib.RemoveElement(_id, wcb(path)))
        Fail(`Failed to remove element at: ${elementContext(_id, path)}`);
};
xelib.RemoveElementOrParent = function(_id) {
    if (!lib.RemoveElementOrParent(_id))
        Fail(`Failed to remove element ${_id}`);
};
xelib.SetElement = function(_id1, _id2) {
    return GetHandle(function(_res) {
        if (!lib.SetElement(_id1, _id2, _res))
            Fail(`Failed to set element at ${_id2} to ${_id1}`);
    });
};
xelib.GetElements = function(_id = 0, path = '', sort = false) {
    return GetArray(function(_len) {
        if (!lib.GetElements(_id, wcb(path), sort, _len))
            Fail(`Failed to get child elements at: ${elementContext(_id, path)}`);
    });
};
xelib.GetDefNames = function(_id) {
    return GetString(function(_len) {
        if (!lib.GetDefNames(_id, _len))
            Fail(`Failed to get def names for: ${_id}`);
    }).split('\r\n');
};
xelib.GetAddList = function(_id) {
    return GetString(function(_len) {
        if (!lib.GetAddList(_id, _len))
            Fail(`Failed to get add list for: ${_id}`);
    }).split('\r\n');
};
xelib.GetLinksTo = function(_id, path) {
    return GetHandle(function(_res) {
        if (!lib.GetLinksTo(_id, wcb(path), _res))
            Fail(`Failed to get link at: ${elementContext(_id, path)}`);
    });
};
xelib.GetContainer = function(_id, noException = false) {
    return GetHandle(function(_res) {
        if (!lib.GetContainer(_id, _res))
            if (!noException) Fail(`Failed to get container for: ${_id}`);
    });
};
xelib.GetElementFile = function(_id) {
    return GetHandle(function(_res) {
        if (!lib.GetElementFile(_id, _res))
            Fail(`Failed to get element file for: ${_id}`);
    });
};
xelib.ElementCount = function(_id) {
    return GetInteger(function(_res) {
        if (!lib.ElementCount(_id, _res))
            Fail(`Failed to get element count for ${_id}`);
    });
};
xelib.ElementEquals = function(_id, _id2) {
    return GetBool(function(_bool) {
        if (!lib.ElementEquals(_id, _id2, _bool))
            Fail(`Failed to check element equality for ${_id} and ${_id2}`);
    });
};
xelib.CopyElement = function(_id, _id2, asNew = false, deepCopy = true) {
    return GetHandle(function(_res) {
        if (!lib.CopyElement(_id, _id2, asNew, deepCopy, _res))
            Fail(`Failed to copy element from ${_id} to ${_id2}`);
    });
};
xelib.GetSignatureAllowed = function(_id, signature) {
    return GetBool(function(_bool) {
        if (!lib.GetSignatureAllowed(_id, wcb(signature), _bool))
            Fail(`Failed to check if signature ${signature} is allowed on ${_id}`);
    });
};
xelib.GetIsModified = function(_id) {
    return GetBool(function(_bool) {
        if (!lib.GetIsModified(_id, _bool))
            Fail(`Failed to get is modified for ${_id}`);
    });
};
xelib.GetIsEditable = function(_id) {
    return GetBool(function(_bool) {
        if (!lib.GetIsEditable(_id, _bool))
            Fail(`Failed to get is editable for ${_id}`);
    });
};
xelib.GetIsRemoveable = function(_id) {
    return GetBool(function(_bool) {
        if (!lib.GetIsRemoveable(_id, _bool))
            Fail(`Failed to get is removeable for ${_id}`);
    });
};
xelib.GetCanAdd = function(_id) {
    return GetBool(function(_bool) {
        if (!lib.GetCanAdd(_id, _bool))
            Fail(`Failed to get can add for ${_id}`);
    });
};
xelib.ElementType = function(_id, asString = false) {
    return GetEnumValue(_id, 'ElementType', asString && elementTypes);
};
xelib.DefType = function(_id, asString = false) {
    return GetEnumValue(_id, 'DefType', asString && defTypes);
};
xelib.SmashType = function(_id, asString = false) {
    return GetEnumValue(_id, 'SmashType', asString && smashTypes);
};
xelib.ValueType = function(_id, asString = false) {
    return GetEnumValue(_id, 'ValueType', asString && valueTypes);
};
xelib.IsSorted = function(_id) {
    return GetBool(function(_bool) {
        if (!lib.IsSorted(_id, _bool))
            Fail(`Failed to get is sorted for ${_id}`);
    });
};
xelib.IsFlags = function(_id) {
    return xelib.ValueType(_id) === xelib.vtFlags;
};