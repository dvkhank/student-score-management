package com.ssm;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.text.MessageFormat;

@RestController
public class Dummy {
    record Hello(String Name) {
        @Override
        public String toString() {
            return MessageFormat.format("Hello {0}", Name);
        }
    }

    @GetMapping(path = {"/", "/{name}"})
    public Hello Get(@PathVariable(required = false) String name) {
        return new Hello(name.isEmpty() ? "world" : name);
    }
}
