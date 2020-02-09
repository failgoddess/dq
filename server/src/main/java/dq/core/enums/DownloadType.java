package dq.core.enums;

public enum DownloadType {
    Widget("widget"),
    DashBoard("dashboard"),
    DashBoardFolder("folder");

    private String type;

    private DownloadType(String type){
        this.type=type;
    }

    public static DownloadType getDownloadType(String type){
        for(DownloadType em:DownloadType.values()){
            if(em.type.equalsIgnoreCase(type)){
                return em;
            }
        }
        return null;
    }
}
