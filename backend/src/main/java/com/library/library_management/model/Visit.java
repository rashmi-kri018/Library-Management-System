package com.library.library_management.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "visits")
public class Visit {

    @Id
    private String id;

    private String memberId;
    private String memberName;
    private String memberType;
    private String checkInTime;
    private String checkOutTime;

    public Visit() {
    }

    public Visit(String memberId, String memberName,
                 String memberType, String checkInTime,
                 String checkOutTime) {
        this.memberId = memberId;
        this.memberName = memberName;
        this.memberType = memberType;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public String getMemberType() {
        return memberType;
    }

    public void setMemberType(String memberType) {
        this.memberType = memberType;
    }

    public String getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(String checkInTime) {
        this.checkInTime = checkInTime;
    }

    public String getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(String checkOutTime) {
        this.checkOutTime = checkOutTime;
    }
}