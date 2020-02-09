package dq.core.enums;

public enum LogNameEnum {
    BUSINESS_SQL("BUSINESS_SQL"),
    BUSINESS_OPERATION("BUSINESS_OPERATION"),
    BUSINESS_SCHEDULE("BUSINESS_SCHEDULE");

    private String name;

    LogNameEnum(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
