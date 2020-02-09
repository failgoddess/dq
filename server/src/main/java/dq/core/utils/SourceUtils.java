package dq.core.utils;

import com.alibaba.druid.util.StringUtils;
import dq.core.common.jdbc.ESDataSource;
import dq.core.common.jdbc.ExtendedJdbcClassLoader;
import dq.core.common.jdbc.JdbcDataSource;
import dq.core.consts.Consts;
import dq.core.enums.DataTypeEnum;
import dq.core.exception.ServerException;
import dq.core.exception.SourceException;
import dq.core.model.CustomDataSource;
import dq.core.model.JdbcSourceInfo;
import dq.core.config.SpringContextHolder;
import dq.runner.LoadSupportDataSourceRunner;
import lombok.extern.slf4j.Slf4j;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.regex.Matcher;

import static dq.core.consts.Consts.*;

@Slf4j
public class SourceUtils {

    private JdbcDataSource jdbcDataSource;

    public SourceUtils(JdbcDataSource jdbcDataSource) {
        this.jdbcDataSource = jdbcDataSource;
    }

    /**
     * 获取数据源
     *
     * @param jdbcSourceInfo
     * @return
     * @throws SourceException
     */
    DataSource getDataSource(JdbcSourceInfo jdbcSourceInfo) throws SourceException {
        if (jdbcSourceInfo.getJdbcUrl().toLowerCase().contains(DataTypeEnum.ELASTICSEARCH.getDesc().toLowerCase())) {
            return ESDataSource.getDataSource(jdbcSourceInfo, jdbcDataSource);
        } else {
            return jdbcDataSource.getDataSource(jdbcSourceInfo);
        }
    }

    Connection getConnection(JdbcSourceInfo jdbcSourceInfo) throws SourceException {
        DataSource dataSource = getDataSource(jdbcSourceInfo);
        Connection connection = null;
        try {
            connection = dataSource.getConnection();
        } catch (Exception e) {
            connection = null;
        }
        try {
            if (null == connection) {
                log.info("connection is closed, retry get connection!");
                releaseDataSource(jdbcSourceInfo);
                dataSource = getDataSource(jdbcSourceInfo);
                connection = dataSource.getConnection();
            }
        } catch (Exception e) {
            log.error("create connection error, jdbcUrl: {}", jdbcSourceInfo.getJdbcUrl());
            throw new SourceException("create connection error, jdbcUrl: " + jdbcSourceInfo.getJdbcUrl());
        }

        try {
            if (!connection.isValid(5)) {
                log.info("connection is invalid, retry get connection!");
                releaseDataSource(jdbcSourceInfo);
                connection = null;
            }
        } catch (Exception e) {
        }

        if (null == connection) {
            try {
                dataSource = getDataSource(jdbcSourceInfo);
                connection = dataSource.getConnection();
            } catch (SQLException e) {
                log.error("create connection error, jdbcUrl: {}", jdbcSourceInfo.getJdbcUrl());
                throw new SourceException("create connection error, jdbcUrl: " + jdbcSourceInfo.getJdbcUrl());
            }
        }

        return connection;
    }

    public static void releaseConnection(Connection connection) {
        if (null != connection) {
            try {
                connection.close();
                connection = null;
            } catch (Exception e) {
                e.printStackTrace();
                log.error("connection close error", e.getMessage());
            }
        }
    }


    public static void closeResult(ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
                rs = null;
            } catch (Exception e) {
                e.printStackTrace();
                log.error("resultSet close error", e.getMessage());
            }
        }
    }

    public static boolean checkDriver(String dataSourceName, String jdbcUrl, String version, boolean isExt) {
        if (!StringUtils.isEmpty(dataSourceName) && LoadSupportDataSourceRunner.getSupportDatasourceMap().containsKey(dataSourceName)) {
            if (isExt && !StringUtils.isEmpty(version) && !JDBC_DATASOURCE_DEFAULT_VERSION.equals(version)) {
                String path = ((ServerUtils) SpringContextHolder.getBean(ServerUtils.class)).getBasePath()
                        + String.format(Consts.PATH_EXT_FORMATER, dataSourceName, version);
                ExtendedJdbcClassLoader extendedJdbcClassLoader = ExtendedJdbcClassLoader.getExtJdbcClassLoader(path);
                CustomDataSource dataSource = CustomDataSourceUtils.getInstance(jdbcUrl, version);
                try {
                    assert extendedJdbcClassLoader != null;
                    Class<?> aClass = extendedJdbcClassLoader.loadClass(dataSource.getDriver());
                    if (null == aClass) {
                        throw new SourceException("Unable to get driver instance for jdbcUrl: " + jdbcUrl);
                    }
                } catch (NullPointerException en) {
                    throw new ServerException("JDBC driver is not found: " + dataSourceName + ":" + version);
                } catch (ClassNotFoundException ex) {
                    throw new SourceException("Unable to get driver instance: " + jdbcUrl);
                }
            } else {
                if (DataTypeEnum.ELASTICSEARCH.getDesc().equals(dataSourceName)) {
                    return true;
                } else {
                    try {
                        String className = getDriverClassName(jdbcUrl, null);
                        Class.forName(className);
                    } catch (Exception e) {
                        throw new SourceException("Unable to get driver instance: " + jdbcUrl, e);
                    }
                }
            }
            return true;
        } else {
            throw new SourceException("Not supported data type: jdbcUrl=" + jdbcUrl);
        }
    }

    public static String isSupportedDatasource(String jdbcUrl) {
        String dataSourceName = getDataSourceName(jdbcUrl);
        if (StringUtils.isEmpty(dataSourceName)) {
            throw new SourceException("Not supported data type: jdbcUrl=" + jdbcUrl);
        }
        if (!LoadSupportDataSourceRunner.getSupportDatasourceMap().containsKey(dataSourceName)) {
            throw new SourceException("Not supported data type: jdbcUrl=" + jdbcUrl);
        }

        String urlPrefix = String.format(JDBC_PREFIX_FORMATER, dataSourceName);
        String checkUrl = jdbcUrl.replaceFirst(DOUBLE_SLASH, EMPTY).replaceFirst(AT_SYMBOL, EMPTY);
        if (urlPrefix.equals(checkUrl)) {
            throw new SourceException("Communications link failure");
        }

        return dataSourceName;
    }

    public static String getDataSourceName(String jdbcUrl) {
        String dataSourceName = null;
        jdbcUrl = jdbcUrl.replaceAll(NEW_LINE_CHAR, EMPTY).replaceAll(SPACE, EMPTY).trim().toLowerCase();
        Matcher matcher = PATTERN_JDBC_TYPE.matcher(jdbcUrl);
        if (matcher.find()) {
            dataSourceName = matcher.group().split(COLON)[1];
        }
        return dataSourceName;
    }

    public static String getDriverClassName(String jdbcUrl, String version) {
        String className = null;
        try {
            className = DriverManager.getDriver(jdbcUrl.trim()).getClass().getName();
        } catch (SQLException e) {
        }
        if (StringUtils.isEmpty(className)) {
            DataTypeEnum dataTypeEnum = DataTypeEnum.urlOf(jdbcUrl);
            CustomDataSource customDataSource = null;
            if (null == dataTypeEnum) {
                try {
                    customDataSource = CustomDataSourceUtils.getInstance(jdbcUrl, version);
                } catch (Exception e) {
                    throw new SourceException(e.getMessage());
                }
            }

            if (null == dataTypeEnum && null == customDataSource) {
                throw new SourceException("Not supported data type: jdbcUrl=" + jdbcUrl);
            }
            className = null != dataTypeEnum && !StringUtils.isEmpty(dataTypeEnum.getDriver()) ? dataTypeEnum.getDriver() : customDataSource.getDriver().trim();
        }
        return className;
    }


    /**
     * 释放失效数据源
     *
     * @param jdbcSourceInfo
     * @return
     */
    public void releaseDataSource(JdbcSourceInfo jdbcSourceInfo) {
        if (jdbcSourceInfo.getJdbcUrl().toLowerCase().contains(DataTypeEnum.ELASTICSEARCH.getDesc().toLowerCase())) {
            ESDataSource.removeDataSource(jdbcSourceInfo.getJdbcUrl(), jdbcSourceInfo.getUsername(), jdbcSourceInfo.getPassword());
        } else {
            jdbcDataSource.removeDatasource(jdbcSourceInfo);
        }
    }

    public static String getKey(String jdbcUrl, String username, String password, String version, boolean isExt) {
        StringBuilder sb = new StringBuilder();
        if (!StringUtils.isEmpty(username)) {
            sb.append(username);
        }
        if (!StringUtils.isEmpty(password)) {
            sb.append(Consts.COLON).append(password);
        }
        sb.append(Consts.AT_SYMBOL).append(jdbcUrl.trim());
        if (isExt && !StringUtils.isEmpty(version)) {
            sb.append(Consts.COLON).append(version);
        }

        return MD5Util.getMD5(sb.toString(), true, 64);
    }
}
