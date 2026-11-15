package com.library.library_management.service;

import com.library.library_management.model.Visit;
import com.library.library_management.repository.VisitRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VisitService {

    private final VisitRepository visitRepository;

    public VisitService(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    public Visit checkIn(Visit visit) {
        if (visitRepository.existsByMemberIdAndCheckOutTimeIsNull(
                visit.getMemberId())) {
            throw new RuntimeException("Member is already inside!");
        }

        return visitRepository.save(visit);
    }

    public List<Visit> getAllVisits() {
        return visitRepository.findAll();
    }

    public List<Visit> getCurrentVisitors() {
        return visitRepository.findByCheckOutTimeIsNull();
    }

    public Visit checkOut(String id, String checkOutTime) {
        Visit visit = visitRepository.findById(id).orElse(null);

        if (visit == null || visit.getCheckOutTime() != null) {
            return null;
        }

        visit.setCheckOutTime(checkOutTime);
        return visitRepository.save(visit);
    }
}