package org.example.contentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "backend-service", path = "/api")
public interface BackendUserClient {

    @GetMapping("/users/{userId}")
    Map<String, Object> getUserById(@PathVariable("userId") Integer userId);
}
