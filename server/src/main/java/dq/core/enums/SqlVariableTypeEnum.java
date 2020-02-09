package dq.core.enums;

public enum SqlVariableTypeEnum {
    QUERYVAR("query"),
    AUTHVARE("auth");


    private String type;

    public static SqlVariableTypeEnum typeOf(String type) {
        for (SqlVariableTypeEnum typeEnum : SqlVariableTypeEnum.values()) {
            if (typeEnum.type.equals(type)) {
                return typeEnum;
            }
        }
        return null;
    }

    public String getType() {
        return type;
    }

    SqlVariableTypeEnum(String type) {
        this.type = type;
    }
}
