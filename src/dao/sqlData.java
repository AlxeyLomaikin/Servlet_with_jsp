package dao;

import model.Query_Types;

import java.io.PrintWriter;
import java.sql.*;
import java.util.ArrayList;

/**
 * Created by AlexL on 23.12.2015.
 */
public class sqlData {
    private Connection con = null;

    //list of all DatabaseNames and name of selected DB
    private ArrayList<String> dbNames = new ArrayList<>();
    private String curDatabase = "";

    //Result of execution of query
    private ArrayList<String> queryResult = new ArrayList<>();

    public sqlData(){
        try{
            Class.forName("com.mysql.jdbc.Driver");

            //get DBases names
            con = DriverManager.getConnection("jdbc:mysql://localhost/", "root", "smosh4071");
            DatabaseMetaData dbMeta = con.getMetaData();
            ResultSet resSc = dbMeta.getCatalogs();
            while (resSc.next()) {
                dbNames.add(resSc.getString("TABLE_CAT"));
            }
            resSc.close();
        } catch (ClassNotFoundException | SQLException ex) {
            ex.printStackTrace();
        }
    }

    public String getCurDatabase() {
        return curDatabase;
    }
    public ArrayList<String> getDbNames() {
        return dbNames;
    }
    public ArrayList<String> getQueryResult(){
        return this.queryResult;
    }

    public boolean closeConnection(){
        try{
            if (con!=null)con.close();
            return true;
        }catch (SQLException ex){
            return false;
        }
    }

    public ArrayList<String> getColumns (String tabName){
        ArrayList<String> colNames = new ArrayList<>();
        try{
            ResultSet rs = con.getMetaData().getColumns(null, null, tabName, null);
            while (rs.next()) {
                colNames.add(rs.getString("COLUMN_NAME"));
            }
            rs.close();
        }catch (SQLException | NullPointerException ex){
            ex.printStackTrace();
        }
        return colNames;
    }

    public ArrayList<String> getTabNames(String dbName){
        ArrayList<String> tabNames = new ArrayList<>();
        try{
            ResultSet rs = con.getMetaData().getTables(dbName, null, null, null);
            while (rs.next()) {
                tabNames.add(rs.getString("TABLE_NAME"));
            }
            rs.close();
        }catch (SQLException | NullPointerException ex){
            ex.printStackTrace();
        }
        return tabNames;
    }

    public void executeUpd(String sql) {
        boolean isDatabaseSelected = (!curDatabase.equals(""));
        int query_type = Query_Types.parseQuery(sql);
        switch (query_type){
            case Query_Types.CREATE_DATABASE:
                createDB(sql.trim());
                break;
            case Query_Types.DROP_DATABASE:
                dropDB(sql.trim());
                break;
            case Query_Types.USE_DATABASE:
                useDB(sql.trim());
                break;
            case Query_Types.SELECT_DATA:
                queryResult.add("Error: not updQuery!");
                break;
            case Query_Types.UPDATE_QUERY:
                if ( isDatabaseSelected )
                    executeUpdQuery(sql.trim());
                else queryResult.add("Can't execute: database not selected!");
                break;
            default:
                queryResult.add("Incorrect request!");
                break;
        }
    }

   private void useDB(String sql){
        queryResult.clear();
        String dbName = sql.split(" ")[1];
        if (dbName.charAt(dbName.length()-1)==';')
            dbName = dbName.replace(";","");

        //if database exist and not selected at this moment
        if ( (!dbName.equals(curDatabase)) && (dbNames.contains(dbName)) )
            try{
                if (con!=null)
                    con.close();
                con = DriverManager.getConnection("jdbc:mysql://localhost/" + dbName, "root", "smosh4071");
                this.curDatabase = dbName;
                queryResult.add("Database was changed");
            }catch (SQLException ex){
                queryResult.add(ex.getMessage());
            }
        else if (!dbNames.contains(dbName)) {
            try{
                if (con!=null)
                    con.close();
                con = DriverManager.getConnection("jdbc:mysql://localhost/", "root", "smosh4071");
            }catch (SQLException ex){
                queryResult.add(ex.getMessage());
            }
            this.curDatabase="";
            queryResult.add("Database with name `" + dbName + "` is not exist!");
        }
    }

   private void createDB(String sql) {
       queryResult.clear();
        if (con != null) {
            Statement statement = null;
            try {
                statement = con.createStatement();
                String dbName = sql.split(" ")[2];
                if (dbName.charAt(dbName.length() - 1) == ';') {
                    dbName = dbName.replace(";", "");
                }
                else
                    sql+=";";
                statement.executeUpdate(sql);
                dbNames.add(dbName);
                queryResult.add("database `"+dbName+"` was successfully created");
            } catch (SQLException ex) {
                queryResult.add(ex.getMessage());
            } finally {
                try {
                    if (statement != null) statement.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
        else queryResult.add("connection error");
    }

    private void dropDB(String sql){
        queryResult.clear();
        if (con != null) {
            Statement statement = null;
            try {
                statement = con.createStatement();
                String dbName = sql.split(" ")[2];
                if (dbName.charAt(dbName.length() - 1) == ';') {
                    dbName = dbName.replace(";", "");
                } else
                    sql+=";";
                statement.executeUpdate(sql);
                dbNames.remove(dbName);
                queryResult.add("database `"+dbName+"` was successfully droped!");
            } catch (SQLException ex) {
                queryResult.add(ex.getMessage());
            } finally {
                try {
                    if (statement != null) statement.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        }
        else queryResult.add("connection error");
    }

    private void executeUpdQuery(String sql) {
        queryResult.clear();
        if (con != null) {
            Statement st = null;
            try {
                st = con.createStatement();
                st.executeUpdate(sql);
            } catch (SQLException ex) {
                queryResult.add(ex.getMessage());
            }finally{
                try{
                    if (st!=null) st.close();
                }catch (SQLException ex){
                    ex.printStackTrace();
                }
            }
        }
        else queryResult.add("Connection error");
    }

    public ArrayList<Object[]> selectData (String sql){
        queryResult.clear();
        ArrayList<Object[]>data = null;
        if (con!=null) {
            Statement st = null;
            ResultSet rs = null;
            try {
                st = con.createStatement();
                rs = st.executeQuery(sql);
                data = new ArrayList<>();
                while (rs.next()){
                    ArrayList<String> row = new ArrayList<>();
                    for (int i = 1; i<=rs.getMetaData().getColumnCount(); i++)
                        row.add(rs.getString(i));
                    data.add(row.toArray());
                }

            } catch (SQLException ex) {
                queryResult.add(ex.getMessage());
            }finally{
                try {
                    if (st != null) st.close();
                    if (rs != null) rs.close();
                }catch(SQLException ex){
                    ex.printStackTrace();
                }
            }
        }
        else queryResult.add("Connection error");
        return data;
    }

}
