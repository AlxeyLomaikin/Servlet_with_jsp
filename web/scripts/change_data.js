
function highlight_tr (button) {
    var tr = button.parentNode.parentNode;
    if (tr.className == 'active')
        tr.className = '';
    else
        tr.className = 'active';
}

function form_submit() {
    var form = document.getElementById('sql_form');
    if (form!=null)
        form.submit();
}

function save_record(ok_button) {
    var tr = ok_button.parentNode.parentNode;
    var id = tr.id.substring(2);
    var fields = tr.getElementsByTagName('td');
    var columns = document.getElementsByTagName('th');
    var fieldCount = fields.length;

    var form = document.getElementById('sql_form');
    var action = document.createElement('input');

    if (id != "") {
        action.innerHTML = '<input type="hidden" name="action" value="edit">edit</input>';
        form.appendChild(action.firstChild);
        var edit_id = document.createElement('input');
        edit_id.innerHTML = "<input type=hidden name='id' value='" + id + "'> </input>";
        form.appendChild(edit_id.firstChild);
    }
    else{
        action.innerHTML = '<input type="hidden" name="action" value="add">add</input>';
        form.appendChild(action.firstChild);
    }

    for (var i=2; i < fieldCount-1; i++){
        var field = document.createElement('input');
        field.innerHTML = "<input type=hidden name='" + columns[i].textContent +
            "' value='" + fields[i].firstChild.value + "'> </input>";
        form.appendChild(field.firstChild);
    }
    form_submit();
}

function edit_record(id){
    var tr = document.getElementById('tr' + id);
    if (tr != null) {
        var fields = tr.getElementsByTagName('td');
        var childNum = fields.length;
        var colNames = document.getElementsByTagName('th');
        for (var i = 2; i < childNum-1; i++){
            fields[i].innerHTML = "<td><input required type=text id='" + colNames[i].textContent + "' value='" +
                fields[i].textContent + "' onchange='check_input(this)'> </input></td>";
        }
        var td = document.createElement('td');
        var ok = document.createElement('input');
        ok.innerHTML = "<input type=button onclick='save_record(this)' disabled value='OK'> </input>";
        var cancel = document.createElement('input');
        cancel.innerHTML = "<input type=button onclick='form_submit()' value='cancel'> </input>";
        td.appendChild(ok.firstChild);
        td.innerHTML+="&nbsp&nbsp&nbsp";
        td.appendChild(cancel.firstChild);
        tr.replaceChild(td, fields[childNum-1]);
    }
}

function add_record(add_button){
    var tr = add_button.parentNode.parentNode;
    var id = "";
    if (tr != null) {
        var fields = tr.getElementsByTagName('td');
        var colNames = document.getElementsByTagName('th');
        var childNum = fields.length ;
        for (var i = 2; i < childNum-1; i++){
            fields[i].innerHTML = "<td><input required type=text id='" + colNames[i].textContent +
                "' onchange='check_input(this)'> </input></td>";
        }
        var td = document.createElement('td');
        var ok = document.createElement('input');
        ok.innerHTML = "<input type=button onclick='save_record(this)' disabled value='OK'> </input>";
        var cancel = document.createElement('input');
        cancel.innerHTML = "<input type=button onclick='form_submit()' value='cancel'> </input>";
        td.appendChild(ok.firstChild);
        td.innerHTML+="&nbsp&nbsp&nbsp";
        td.appendChild(cancel.firstChild);
        tr.replaceChild(td, fields[childNum-1]);
    }
}

function hideAllButtons(){
    var i = 0;
    var mainCheckbox = document.getElementById('main_check');
    var addButton = document.getElementsByClassName('add')[0];
    var bulkDelButton = document.getElementById('bulk_del');
    var bulkEditButton = document.getElementById('bulk_edit');
    var Checkboxes = document.getElementsByClassName('checkbox');
    var editButtons = document.getElementsByClassName('edit');
    var delButtons = document.getElementsByClassName('delete');

    mainCheckbox.disabled = true;
    addButton.disabled = true;
    bulkDelButton.disabled = true;
    bulkEditButton.disabled = true;
    for (i = 0; i<delButtons.length; i++)
        delButtons[i].disabled = true;
    for (i = 0; i<Checkboxes.length; i++)
        Checkboxes[i].disabled = true;
    for (i = 0; i<editButtons.length; i++)
        editButtons[i].disabled = true;
}

function bulkSave(ok){
    var tr = ok.parentNode.parentNode;
    var firstId = tr.id.substring(2);
    if (firstId != "") {
        var fields = tr.getElementsByTagName('td');
        var columns = document.getElementsByTagName('th');
        var fieldCount = fields.length;
        var form = document.getElementById('sql_form');
        var action = document.createElement('input');
        action.innerHTML = '<input type="hidden" name="action" value="bulkEdit">bulkEdit</input>';
        form.appendChild(action.firstChild);
        var CheckBoxes = document.getElementsByClassName('checkbox');
        var edit_ids = "";
        for (i = 0; i<CheckBoxes.length; i++)
            if (CheckBoxes[i].checked) {
                tr = CheckBoxes[i].parentNode.parentNode;
                var id = tr.id.substring(2);
                edit_ids+= id + ",";
            }
        edit_ids = edit_ids.substring(0, edit_ids.length - 1);
        var ids = document.createElement('input');
        ids.innerHTML = "<input type=hidden name='ids' value='" + edit_ids + "'> </input>";
        form.appendChild(ids.firstChild);
        for (var i=2; i < fieldCount-1; i++){
            var value = fields[i].firstChild.value;
            if (value!='') {
                var field = document.createElement('input');
                field.innerHTML = "<input type=hidden name='" + columns[i].textContent +
                    "' value='" + fields[i].firstChild.value + "'> </input>";
                form.appendChild(field.firstChild);
            }
        }
        form_submit();
    }
}

function Bulk_edit(button) {
    var firstId = "";
    var i =0;
    var tr;
    var CheckBoxes = document.getElementsByClassName('checkbox');
    for (i = 0; i<CheckBoxes.length; i++)
        if (CheckBoxes[i].checked) {
            tr = CheckBoxes[i].parentNode.parentNode;
            firstId = tr.id.substring(2);
            break;
        }

    if (firstId != "") {
        tr = document.getElementById('tr' + firstId);
        var fields = tr.getElementsByTagName('td');
        var childNum = fields.length;
        var colNames = document.getElementsByTagName('th');
        for (i = 2; i < childNum-1; i++){
            fields[i].innerHTML = "<td><input type=text id='" + colNames[i].textContent +
                                     "' onchange='checkBulkInput(this)'> </input></td>";
        }
        var td = document.createElement('td');
        var ok = document.createElement('input');
        ok.innerHTML = "<input type=button onclick='bulkSave(this)' disabled value='OK'> </input>";
        var cancel = document.createElement('input');
        cancel.innerHTML = "<input type=button onclick='form_submit()' value='cancel'> </input>";
        td.appendChild(ok.firstChild);
        td.innerHTML+="&nbsp&nbsp&nbsp";
        td.appendChild(cancel.firstChild);
        tr.replaceChild(td, fields[childNum-1]);
    }
}

function bulk_delete() {
    var ids = "";
    var items = document.getElementsByClassName('checkbox');
    for (var i = 0; i < items.length; i++) {
        var elt = items[i];
        if (elt.checked) {
            var tr = elt.parentNode.parentNode;
            var id = tr.id.substring(2);
            ids += id + ",";
        }
    }
    if (ids != "") {
        ids = ids.substring(0, ids.length - 1);
        var form = document.getElementById('sql_form');
        var action = document.createElement('input');
        action.innerHTML = '<input type="hidden" name="action" value="bulkDelete">del_ids</input>';
        var del_ids = document.createElement('input');
        del_ids.innerHTML = '<input type="hidden" name="ids" value="' + ids + '">del_ids</input>';
        form.appendChild(action.firstChild);
        form.appendChild(del_ids.firstChild);
        form_submit();
    }
}

function del_record(id) {
    var action = document.createElement('input');
    action.innerHTML = '<input type="hidden" name="action" value="delete">delete</input>';
    var del_id = document.createElement('input');
    del_id.innerHTML = '<input type="hidden" name="id" value="' + id + '">del_id</input>';
    var form = document.getElementById('sql_form');
    if (form != null) {
        form.appendChild(action.firstChild);
        form.appendChild(del_id.firstChild);
        form.submit();
    }
}