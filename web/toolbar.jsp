<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<body>
<table class="ControlPanel" cellpadding="0" cellspacing="0" border="0">
    <tr class="single">
        <td><input  disabled type="button" id="bulk_del" value="Bulk delete" onclick="bulk_delete()"> </td>
        <td>&nbsp;</td>
        <td><input  disabled type="button" id="bulk_edit" value="Bulk edit" onclick="hideAllButtons();Bulk_edit(this)"> </td>
    </tr>
</table>
</body>
<html>