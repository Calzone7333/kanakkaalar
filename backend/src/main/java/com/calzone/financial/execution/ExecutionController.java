package com.calzone.financial.execution;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute/company-reg")
public class ExecutionController {
  @PostMapping
  public String execute(@RequestBody String payload){
    return "scheduled";
  }
}
