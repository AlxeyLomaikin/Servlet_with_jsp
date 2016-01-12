package servlet; /**
 * Created by AlexL on 15.12.2015.
 */
import javax.servlet.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import dao.sqlData;

public class sqlServlet extends HttpServlet {
    private sqlData sqlData;

    @Override
    public void init() throws ServletException {
        sqlData = new sqlData();
    }

    @Override
    public void destroy() {
        if (sqlData != null) sqlData.closeConnection();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setAttribute("dao", sqlData);
        String forward = "/tableCtrl.jsp";

        String use = request.getParameter("use");
        String selectedTable = request.getParameter("selectedTab");
        String action = request.getParameter("action");

        boolean isTableSelected = ((selectedTable != null) && (!selectedTable.equals("")));

        if (use != null)
            sqlData.executeUpd("use " + use + ";");

        boolean isDatabaseSelected = (!sqlData.getCurDatabase().equals(""));

        if (isDatabaseSelected && isTableSelected) {
            if (action != null)
                switch (action) {
                    case "delete":
                        String del_id = request.getParameter("id");
                        deleteRow(del_id, request);
                        break;
                    case "edit":
                        String edit_id = request.getParameter("id");
                        editRow(edit_id, request);
                        break;
                    case "add":
                        addRow(request);
                        break;
                    case "bulkDelete":
                        bulkDelete(request);
                        break;
                    case "bulkEdit":
                        bulkEdit(request);
                        break;
                }
        }
        RequestDispatcher view = request.getRequestDispatcher(forward);
        view.forward(request, response);
    }

    private void deleteRow(String id, HttpServletRequest req) {
        try {
            String selectedTable = req.getParameter("selectedTab");
            int del_id = Integer.parseInt(id);
            sqlData.executeUpd("delete from " + selectedTable + " where id=\"" + del_id + "\";");
        } catch (NumberFormatException ex) {
            sqlData.getQueryResult().add("Incorrect id!\n" + id);
        }

    }
    private void bulkDelete(HttpServletRequest req){
        String ids = req.getParameter("ids");
        if (ids!=null && !ids.equals("")) {
            String [] del_ids = ids.split(",");
            for (int i = 0; i < del_ids.length; i++)
                deleteRow(del_ids[i], req);
        }
    }

    private void bulkEdit (HttpServletRequest req){
        String ids = req.getParameter("ids");
        if (ids!=null && !ids.equals("")) {
            String [] edit_ids = ids.split(",");
            for (int i = 0; i < edit_ids.length; i++)
                editRow(edit_ids[i], req);
        }
    }

    private void editRow(String id, HttpServletRequest req) {
        try {
            String selectedTable = req.getParameter("selectedTab");
            int edit_id = Integer.parseInt(id);
            Map<String, String[]> params = req.getParameterMap();
            ArrayList<String> record = new ArrayList<>();
            ArrayList<String> tabColumns = sqlData.getColumns(selectedTable);
            ArrayList<String> changedColumns = new ArrayList<>();
            for (String key : params.keySet())
                if (tabColumns.contains(key) && !key.equals("id")) {
                    changedColumns.add(key);
                    record.add(params.get(key)[0]);
                }
            String updQuery = "update doctor set ";
            for (int i=0; i<record.size(); i++){
                updQuery+=changedColumns.get(i) + "=\"" + record.get(i) + "\", ";
            }
            updQuery = updQuery.substring(0, updQuery.length()-2) + "where id=" + edit_id + ";";
            sqlData.executeUpd(updQuery);
        } catch (NumberFormatException ex) {
            sqlData.getQueryResult().add("Incorrect id!\n");
        }
    }

    private void addRow(HttpServletRequest req) {
        String selectedTable = req.getParameter("selectedTab");
        Map<String, String[]> params = req.getParameterMap();
        ArrayList<String> record = new ArrayList<>();
        ArrayList<String> columns = sqlData.getColumns(selectedTable);
        for (String key : params.keySet()) {
            if (columns.contains(key))
                record.add(params.get(key)[0]);
        }
        if ( columns.size() == record.size() + 1 ) {
            String updQuery = "insert into doctor values (null, \"" + record.get(0) + "\", \""
                    + record.get(1) + "\", \"" + record.get(2) + "\", \"" + record.get(3) + "\");";
            sqlData.executeUpd(updQuery);
        } else sqlData.getQueryResult().add("Wrong options!");
    }
}

