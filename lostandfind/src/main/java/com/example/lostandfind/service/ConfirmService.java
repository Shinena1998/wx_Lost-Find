package com.example.lostandfind.service;

/**
 * 用于用户判断提交事件
 * 用于审核判断是否完成审核
 * 用于判断是否为贵重物品
 */
public class ConfirmService {
    private boolean confirm;

    public boolean isConfirm() {
        return confirm;
    }

    public void setConfirm(boolean confirm) {
        this.confirm = confirm;
    }
}
