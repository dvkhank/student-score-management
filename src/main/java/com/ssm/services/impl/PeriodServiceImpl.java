package com.ssm.services.impl;

import com.ssm.models.Period;
import com.ssm.repositories.PeriodRepository;
import com.ssm.services.PeriodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PeriodServiceImpl implements PeriodService {
    @Autowired
    private PeriodRepository periodRepository;

    @Cacheable(value = "periods", key = "'periods'")
    @Override
    public List<Period> getAllPeriod() {
        return periodRepository.findAll();
    }
}
