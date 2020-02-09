package dq.core.enums;

public enum VizVisiblityEnum {
    PORTAL("portal"),
    DASHBOARD("dashboard"),
    DISPLAY("display"),
    SLIDE("slide"),


    ;

    private String viz;

    VizVisiblityEnum(String viz) {
        this.viz = viz;
    }

    VizVisiblityEnum() {
    }

    public static VizVisiblityEnum vizOf(String viz) {
        for (VizVisiblityEnum visiblityEnum : VizVisiblityEnum.values()) {
            if (viz.equals(visiblityEnum.viz)) {
                return visiblityEnum;
            }
        }
        return null;
    }
}
