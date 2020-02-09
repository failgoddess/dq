package dq.core.enums;

public enum CheckEntityEnum {
    USER("user", "userService", "dq.model.User"),
    PROJECT("project", "projectService", "dq.model.Project"),
    ORGANIZATION("organization", "organizationService", "dq.model.Organization"),
    SOURCE("source", "sourceService", "dq.model.Source"),
    VIEW("view", "viewService", "dq.model.View"),
    WIDGET("widget", "widgetService", "dq.model.Widget"),
    DISPLAY("display", "displayService", "dq.model.Display"),
    DASHBOARD("dashboard", "dashboardService", "dq.model.Dashboard"),
    DASHBOARDPORTAL("dashboardPortal", "dashboardPortalService", "dq.model.DashboardPortal"),
    CRONJOB("cronJob", "cronJobService", "dq.model.CronJob");

    private String source;
    private String service;
    private String clazz;


    CheckEntityEnum(String source, String service, String clazz) {
        this.source = source;
        this.service = service;
        this.clazz = clazz;
    }

    public static CheckEntityEnum sourceOf(String source) {
        for (CheckEntityEnum sourceEnum : values()) {
            if (sourceEnum.source.equals(source)) {
                return sourceEnum;
            }
        }
        return null;
    }

    public String getService() {
        return service;
    }

    public String getClazz() {
        return clazz;
    }

    public String getSource() {
        return source;
    }
}
