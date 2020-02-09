package dq.core.common.jdbc;

import org.springframework.jdbc.core.PreparedStatementCreator;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class QueryTimeOutStatementCreator implements PreparedStatementCreator {
    private final String sql;
    private final int queryTimeOut;

    public QueryTimeOutStatementCreator(String sql, int queryTimeOut) {
        this.sql = sql;
        this.queryTimeOut = queryTimeOut;
    }

    @Override
    public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
        final PreparedStatement statement = connection.prepareStatement(sql);

        if (queryTimeOut > 0) {
            try {
                statement.setQueryTimeout(queryTimeOut / 1000);
            } catch (Exception e) {
            }
        }
        return statement;
    }
}