package dq.core.model;

import dq.core.common.Constants;
import lombok.Data;

@Data
public class QueryColumn {
    private String name;
    private String type;

    public QueryColumn(String name, String type) {
        this.name = name;
        this.type = type.toUpperCase();
    }

    public void setType(String type) {
        this.type = type == null ? Constants.EMPTY : type;
    }
}
