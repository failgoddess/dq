package dq.core.enums;

public enum NumericUnitEnum {
    None("无"),
    TenThousand("万"),
    OneHundredMillion("亿"),
    Thousand("k"),
    Million("M"),
    Giga("G");

    private String unit;

    public String getUnit() {
        return unit;
    }

    public static NumericUnitEnum unitOf(String unit) {
        for (NumericUnitEnum numericUnitEnum : NumericUnitEnum.values()) {
            if (unit.equals(numericUnitEnum.unit)) {
                return numericUnitEnum;
            }
        }
        return null;
    }


    NumericUnitEnum(String unit) {
        this.unit = unit;
    }
}
