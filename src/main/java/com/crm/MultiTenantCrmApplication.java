package com.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationFailedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MultiTenantCrmApplication {

    public static void main(String[] args) {
        SpringApplication.run(MultiTenantCrmApplication.class, args);
    }

    @Bean
    public ApplicationListener<ApplicationFailedEvent> applicationFailedLogger() {
        return event -> {
            Throwable ex = event.getException();
            System.err.println("Application failed to start: " + (ex != null ? ex.getMessage() : "unknown error"));
            if (ex != null) {
                ex.printStackTrace();
            }
        };
    }

}
