package dq.core.enums;

public enum DownloadTaskStatus {
    PROCESSING((short) 1),
    SUCCESS((short) 2),
    FAILED((short) 3),
    DOWNLOADED((short) 4);

    private short status;

    private DownloadTaskStatus(short status) {
        this.status = status;
    }

    public short getStatus() {
        return status;
    }
}
