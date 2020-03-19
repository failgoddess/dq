package dq.core.model;

import dq.model.Source;
import lombok.extern.slf4j.Slf4j;

import java.util.List;


@Slf4j
public abstract class BaseSource extends RecordInfo<Source> {
    public abstract String getJdbcUrl();

    public abstract String getUsername();

    public abstract String getPassword();

    public abstract String getDatabase();

    public abstract String getDbVersion();

    public abstract List<Dict<String,String>> getProperties();

    public abstract boolean isExt();
}
