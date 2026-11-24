package com.smartcampus.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class WaitingListRequest {
    private Long userId;
    private String resourceType;
    private Long resourceId;
    private LocalDate requestedDate;
    private LocalTime preferredStartTime;
    private LocalTime preferredEndTime;
    private String purpose;
    private int priority = 1;
    private boolean autoAllocateOptIn = true;

    public WaitingListRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }

    public LocalDate getRequestedDate() { return requestedDate; }
    public void setRequestedDate(LocalDate requestedDate) { this.requestedDate = requestedDate; }

    public LocalTime getPreferredStartTime() { return preferredStartTime; }
    public void setPreferredStartTime(LocalTime preferredStartTime) { this.preferredStartTime = preferredStartTime; }

    public LocalTime getPreferredEndTime() { return preferredEndTime; }
    public void setPreferredEndTime(LocalTime preferredEndTime) { this.preferredEndTime = preferredEndTime; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public int getPriority() { return priority; }
    public void setPriority(int priority) { this.priority = priority; }

    public boolean isAutoAllocateOptIn() { return autoAllocateOptIn; }
    public void setAutoAllocateOptIn(boolean autoAllocateOptIn) { this.autoAllocateOptIn = autoAllocateOptIn; }
}
