package dq.core.enums;

public enum FileTypeEnum {
    XLSX("excel", ".xlsx"),
    XLS("excel", ".xls"),
    CSV("csv", ".csv");

    private String type;
    private String format;

    public String getType() {
        return type;
    }

    public String getFormat() {
        return format;
    }

    FileTypeEnum(String type, String format) {
        this.type = type;
        this.format = format;
    }
}
