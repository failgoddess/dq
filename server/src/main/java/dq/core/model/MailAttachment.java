package dq.core.model;

import lombok.Data;

import java.io.File;

@Data
public class MailAttachment {
    private String name;
    private File file;
    private String url = null;

    private boolean isImage = false;

    public MailAttachment(String name, File file, String url, boolean isImage) {
        this.name = name;
        this.file = file;
        this.url = url;
        this.isImage = isImage;
    }

    public MailAttachment(String name, File file) {
        this.name = name;
        this.file = file;
    }
}
