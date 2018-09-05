package com.example.lostandfind.Enum;

public enum CodeEnum {
    SUCCESS(0,"成功"),
    UNKNOW_ERROR(-1,"未知错误"),
    PRIMARY_SCHOOL(100,"他可能上小学"),
    MIDDLE_SCHOOL(101,"他可能上初中")
    ;


    private Integer code;
    private String msg;

    CodeEnum(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
