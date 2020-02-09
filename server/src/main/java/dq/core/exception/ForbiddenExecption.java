package dq.core.exception;

import dq.core.enums.HttpCodeEnum;

public class ForbiddenExecption extends RuntimeException {

    public ForbiddenExecption(String message, Throwable cause) {
        super(message, cause);
    }

    public ForbiddenExecption(String message) {
        super(message);
    }


    public ForbiddenExecption() {
        super(HttpCodeEnum.FORBIDDEN.getMessage());
    }
}
