package dq.core.common.jdbc;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.util.StringUtils;
import dq.core.consts.Consts;
import dq.core.enums.DataTypeEnum;
import dq.core.exception.SourceException;
import dq.core.model.JdbcSourceInfo;
import dq.core.utils.CollectionUtils;
import dq.core.utils.ServerUtils;
import dq.core.utils.SourceUtils;
import dq.core.config.SpringContextHolder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import static dq.core.consts.Consts.JDBC_DATASOURCE_DEFAULT_VERSION;

@Slf4j
@Component
public class JdbcDataSource {

    @Value("${spring.datasource.type}")
    private String type;

    @Value("${source.max-active:10}")
    @Getter
    private int maxActive;

    @Value("${source.initial-size:1}")
    @Getter
    private int initialSize;

    @Value("${source.min-idle:3}")
    @Getter
    private int minIdle;

    @Value("${source.max-wait:30000}")
    @Getter
    private long maxWait;

    @Value("${spring.datasource.time-between-eviction-runs-millis}")
    @Getter
    private long timeBetweenEvictionRunsMillis;

    @Value("${spring.datasource.min-evictable-idle-time-millis}")
    @Getter
    private long minEvictableIdleTimeMillis;

    @Value("${spring.datasource.test-while-idle}")
    @Getter
    private boolean testWhileIdle;

    @Value("${spring.datasource.test-on-borrow}")
    @Getter
    private boolean testOnBorrow;

    @Value("${spring.datasource.test-on-return}")
    @Getter
    private boolean testOnReturn;

    @Value("${source.break-after-acquire-failure:true}")
    @Getter
    private boolean breakAfterAcquireFailure;

    @Value("${source.connection-error-retry-attempts:0}")
    @Getter
    private int connectionErrorRetryAttempts;

    @Value("${source.query-timeout:600000}")
    @Getter
    private int queryTimeout;

    private static volatile Map<String, DruidDataSource> dataSourceMap = new HashMap<>();

    public synchronized void removeDatasource(JdbcSourceInfo jdbcSourceInfo) {
        String key = SourceUtils.getKey(jdbcSourceInfo.getJdbcUrl(),
                jdbcSourceInfo.getUsername(),
                jdbcSourceInfo.getPassword(),
                jdbcSourceInfo.getDbVersion(),
                jdbcSourceInfo.isExt());

        if (dataSourceMap.containsKey(key)) {
            DruidDataSource druidDataSource = dataSourceMap.get(key);
            druidDataSource.close();
            dataSourceMap.remove(key);
        }
    }

    public synchronized DruidDataSource getDataSource(JdbcSourceInfo jdbcSourceInfo) throws SourceException {
        String jdbcUrl = jdbcSourceInfo.getJdbcUrl();
        String username = jdbcSourceInfo.getUsername();
        String password = jdbcSourceInfo.getPassword();
        String dbVersion = jdbcSourceInfo.getDbVersion();
        boolean ext = jdbcSourceInfo.isExt();

        String key = SourceUtils.getKey(jdbcUrl, username, password, dbVersion, ext);

        if (dataSourceMap.containsKey(key) && dataSourceMap.get(key) != null) {
            DruidDataSource druidDataSource = dataSourceMap.get(key);
            if (!druidDataSource.isClosed()) {
                return druidDataSource;
            } else {
                dataSourceMap.remove(key);
            }
        }

        DruidDataSource instance = new DruidDataSource();

        if (StringUtils.isEmpty(dbVersion) ||
                !ext || JDBC_DATASOURCE_DEFAULT_VERSION.equals(dbVersion)) {

            String className = SourceUtils.getDriverClassName(jdbcUrl, null);
            try {
                Class.forName(className);
            } catch (ClassNotFoundException e) {
                throw new SourceException("Unable to get driver instance for jdbcUrl: " + jdbcUrl);
            }

            instance.setDriverClassName(className);

        } else {
            String path = ((ServerUtils) SpringContextHolder.getBean(ServerUtils.class)).getBasePath()
                    + String.format(Consts.PATH_EXT_FORMATER, jdbcSourceInfo.getDatabase(), dbVersion);
            instance.setDriverClassLoader(ExtendedJdbcClassLoader.getExtJdbcClassLoader(path));
        }

        instance.setUrl(jdbcUrl);
        instance.setUsername(username);

        if (!jdbcUrl.toLowerCase().contains(DataTypeEnum.PRESTO.getFeature())) {
            instance.setPassword(password);
        }

        instance.setInitialSize(initialSize);
        instance.setMinIdle(minIdle);
        instance.setMaxActive(maxActive);
        instance.setMaxWait(maxWait);
        instance.setTimeBetweenEvictionRunsMillis(timeBetweenEvictionRunsMillis);
        instance.setMinEvictableIdleTimeMillis(minEvictableIdleTimeMillis);
        instance.setTestWhileIdle(false);
        instance.setTestOnBorrow(testOnBorrow);
        instance.setTestOnReturn(testOnReturn);
        instance.setConnectionErrorRetryAttempts(connectionErrorRetryAttempts);
        instance.setBreakAfterAcquireFailure(breakAfterAcquireFailure);

        if (!CollectionUtils.isEmpty(jdbcSourceInfo.getProperties())) {
            Properties properties = new Properties();
            jdbcSourceInfo.getProperties().forEach(dict -> properties.setProperty(dict.getKey(), dict.getValue()));
            instance.setConnectProperties(properties);
        }

        try {
            instance.init();
        } catch (Exception e) {
            log.error("Exception during pool initialization", e);
            throw new SourceException(e.getMessage());
        }
        dataSourceMap.put(key, instance);
        return instance;
    }
}
