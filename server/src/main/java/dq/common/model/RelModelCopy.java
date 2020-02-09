package dq.common.model;

import lombok.Getter;

@Getter
public class RelModelCopy {
    private Long originId;
    private Long copyId;

    public RelModelCopy(Long originId, Long copyId) {
        this.originId = originId;
        this.copyId = copyId;
    }
}
