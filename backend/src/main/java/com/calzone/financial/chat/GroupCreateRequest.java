package com.calzone.financial.chat;

import lombok.Data;
import java.util.List;

@Data
public class GroupCreateRequest {
    private String name;
    private String admin;
    private List<String> members;
}
