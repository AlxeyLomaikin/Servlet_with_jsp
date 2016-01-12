function areBulkButtonsDisabled (isDisabled){
    document.getElementById("bulk_del").disabled = isDisabled;
    document.getElementById("bulk_edit").disabled = isDisabled;
}

function selectRow(checkbox) {
    var i = 0;
    if (checkbox.checked) {
        checkbox.parentNode.parentNode.className = 'selected';
        areBulkButtonsDisabled(false);
        var allChecked = true;
        var checkboxes = document.getElementsByClassName('checkbox');
        for (i = 0; i < checkboxes.length; i++)
            if (!checkboxes[i].checked) {
                allChecked = false;
                break;
            }
        if (allChecked)
            document.getElementById('main_check').checked=true;
    }
    else{
        checkbox.parentNode.parentNode.className='';
        var hasChecked = false;
        var items = document.getElementsByClassName('checkbox');
        for ( i = 0; i < items.length; i++)
            if (items[i].checked) {
                hasChecked = true;
                break;
            }
        if (hasChecked)
            areBulkButtonsDisabled(false);
        else {
            document.getElementById('main_check').checked=false;
            areBulkButtonsDisabled(true);
        }
    }
}


function selectAllChecks(checkbox) {
    var items = document.getElementsByClassName('checkbox');
    var i =0;
    if (checkbox.checked) {
        areBulkButtonsDisabled(false);
        for (i = 0; i < items.length; i++)
            if (!items[i].checked) {
                items[i].parentNode.parentNode.className = 'selected';
                items[i].checked = true;
            }
    }
    else {
        areBulkButtonsDisabled(true);
        for (i = 0; i < items.length; i++)
            if (items[i].checked) {
                items[i].parentNode.parentNode.className = '';
                items[i].checked = false;
            }
    }
}

function check_input(input) {
    var tr = input.parentNode.parentNode;
    var inputs = tr.getElementsByTagName('input');
    var colCount = inputs.length;
    var ok = inputs [colCount-2];
    for (var i = 0; i < colCount-2; i++) {
        if ( (inputs[i].value == null) || (inputs[i].value == "") ) {
            ok.disabled = true;
            return false;
        }
        else if (inputs[i].id == "age") {
            var isInt = ( parseInt(inputs[i].value) == inputs[i].value );
            var isValid = ( isInt && (inputs[i].value >= 18) && (inputs[i].value < 100) );
            if (!isInt) {
                ok.disabled = true;
                alert("'age' must be integer!'");
                return false;
            }
            else if (!isValid) {
                ok.disabled = true;
                alert ("incorrect 'age'!'\n 18<=age<100");
                return false;
            }
        }
    }
    ok.disabled = false;
    return true;
}

function checkBulkInput(input) {
    var hasInput = false;
    var tr = input.parentNode.parentNode;
    var inputs = tr.getElementsByTagName('input');
    var colCount = inputs.length;
    var ok = inputs [colCount - 2];
    for (var i = 1; i < colCount - 2; i++) {
        if ((inputs[i].value != null) && (inputs[i].value != '')) {
            if (inputs[i].id == "age") {
                var isInt = ( parseInt(inputs[i].value) == inputs[i].value );
                var isValid = ( isInt && (inputs[i].value >= 18) && (inputs[i].value < 100) );
                if (!isInt) {
                    ok.disabled = true;
                    alert("'age' must be integer!'");
                    return false;
                }
                else if (!isValid) {
                    ok.disabled = true;
                    alert("incorrect 'age'!'\n 18<=age<100");
                    return false;
                }
                else
                    hasInput = true;
            }
            else
                hasInput = true;
        }
    }
    if ( hasInput )
        ok.disabled = false;
    else
    {
        alert("All fields are empty!");
        ok.disabled = true;
    }
    return hasInput;
}