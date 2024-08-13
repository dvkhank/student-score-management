package com.ssm.services.impl;

import com.ssm.models.ActivityKind;
import com.ssm.repositories.ActivityKindRepository;
import com.ssm.services.ActivityKindService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityKindServiceImpl implements ActivityKindService {
    @Autowired
    private ActivityKindRepository activityKindRepository;
    public List<ActivityKind> getAll() {
        return activityKindRepository.findAll();
    }
}
