<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<%@ page import="dao.sqlData" %>
<%@ page import="java.util.ArrayList" %>
<%!
    private final String tab = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>Choose table</title>
    <link rel="stylesheet" type="text/css" href="first.css">
    <script src="/scripts/validate.js"></script>
    <script src="/scripts/change_data.js"></script>
</head>

<body>
<pre>Databases:</pre>
<%  sqlData sqlData = (sqlData)request.getAttribute("dao");
    String selectedTable = request.getParameter("selectedTab");
    String curDatabase = sqlData.getCurDatabase();
    boolean isDatabaseSelected = (!curDatabase.equals(""));
    boolean isTableSelected = (selectedTable!=null && !selectedTable.equals(""));
    ArrayList<String> DBNames = sqlData.getDbNames();
    for (String DBName: DBNames){
        String href = "/sql?use=" + DBName;
        if (DBName.equals(curDatabase)){
            out.println("<a class=\"active\">" + DBName + "</a>" + tab);
        }else{
            out.println("<a href=\"" + href + "\">" + DBName + "</a>" + tab);
        }
    }
%>
<br>
<form id="sql_form" action=/sql method=service>
    <%    if ( isDatabaseSelected ) {
        ArrayList<String> tables = sqlData.getTabNames(curDatabase);
    %>
    <p>Choose table:
    <p><select name="selectedTab" onchange="form_submit()">
        <option></option>
        <% for (String table : tables) {
            if ( (selectedTable != null) && (table.equals(selectedTable)) ){
        %>
        <option selected><%=table%></option>
        <%}
        else{
        %>
        <option><%=table%></option>
        <%}
        }
        %>
    </select>
            <% if (isTableSelected){
        %>
        <jsp:include page="toolbar.jsp" flush="true"/>
            <% ArrayList<Object[]> data = sqlData.selectData("select * from " + selectedTable);
             ArrayList<String> columns = sqlData.getColumns(selectedTable);
             int colCount = columns.size();
             %>
    <p><table>
    <tr class="header">
        <% if (data.size()!=0){
        %>
        <th><input id="main_check" type="checkbox" onclick="selectAllChecks(this)"></th>
        <%} else
            out.print("<th><input disabled id=\"main_check\" type=\"checkbox\"" +
                    "onclick=\"selectAllChecks(this)\"> </th>");
            for (String colName:columns) {
        %>
        <th><%=colName%></th>
        <%}
        %>
        <th>change data</th>
    </tr>
    <% for (Object[] row: data) {
    %>
    <tr id=<%="tr" + row[0]%> >
        <td><input class="checkbox" type="checkbox" onclick="selectRow(this)"></td>
        <% for (int i = 0; i < colCount; i++) {
        %>
        <td><%=row[i]%></td>
        <% }
        %>
        <td>
            <input class="edit" type="button" value=edit onclick="highlight_tr(this); edit_record(<%=row[0]%>)">
            &nbsp&nbsp
            <input class="delete" type="button" value=delete onclick="del_record(<%=row[0]%>)">
        </td>
    </tr>
    <% }
    %>
    <tr>
        <% for (int i = 0; i <colCount + 1; i++){
        %>
        <td></td>
        <%}
        %>
        <td><input class="add" type="button" value="add record" onclick="highlight_tr(this); add_record(this)"></td>
    </tr>
</table>
    <%}
    }
    %>
</form>
<%  if (!isDatabaseSelected ){
%>
<p>Database not selected!
        <%}
    %>
        <% for (int i =0; i<sqlData.getQueryResult().size(); i++)
    out.println("<p>" + sqlData.getQueryResult().get(i));
    sqlData.getQueryResult().clear();
    %>
</body>
</html>