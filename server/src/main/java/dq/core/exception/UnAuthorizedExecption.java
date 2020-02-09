package dq.core.exception;

import dq.core.enums.HttpCodeEnum;

public class UnAuthorizedExecption extends RuntimeException {

    public UnAuthorizedExecption(String message, Throwable cause) {
        super(message, cause);
    }

    public UnAuthorizedExecption(String message) {
        super(message);
    }


    public UnAuthorizedExecption() {
        super(HttpCodeEnum.UNAUTHORIZED.getMessage());
    }
}
