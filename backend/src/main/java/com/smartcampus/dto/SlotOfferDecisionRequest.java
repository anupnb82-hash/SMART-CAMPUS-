package com.smartcampus.dto;

public class SlotOfferDecisionRequest {
    private boolean accept; // true = accept offer, false = decline

    public SlotOfferDecisionRequest() {}

    public SlotOfferDecisionRequest(boolean accept) {
        this.accept = accept;
    }

    public boolean isAccept() { return accept; }
    public void setAccept(boolean accept) { this.accept = accept; }
}
