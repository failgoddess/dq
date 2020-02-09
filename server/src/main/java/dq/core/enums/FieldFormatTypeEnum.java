package dq.core.enums;

public enum FieldFormatTypeEnum {
    Default("default"),
    Numeric("numeric"),
    Currency("currency"),
    Percentage("percentage"),
    ScientificNotation("scientificNotation"),
    Date("date"),
    Custom("custom");


    private String type;


    public static FieldFormatTypeEnum typeOf(String type) {
        for (FieldFormatTypeEnum formatTypeEnum : FieldFormatTypeEnum.values()) {
            if (type.equals(formatTypeEnum.type)) {
                return formatTypeEnum;
            }
        }
        return null;
    }

    public String getType() {
        return type;
    }


    FieldFormatTypeEnum(String type) {
        this.type = type;
    }
}
