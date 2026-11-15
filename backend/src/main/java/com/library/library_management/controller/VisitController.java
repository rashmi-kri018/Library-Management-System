package com.library.library_management.controller;

import com.library.library_management.model.Visit;
import com.library.library_management.service.VisitService;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visits")
@CrossOrigin(origins = {"http://localhost:5173", "${FRONTEND_URL:http://localhost:5173}"})
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @PostMapping
    public Visit checkIn(@RequestBody Visit visit) {
        return visitService.checkIn(visit);
    }

    @GetMapping
    public List<Visit> getAllVisits() {
        return visitService.getAllVisits();
    }

    @GetMapping("/current")
    public List<Visit> getCurrentVisitors() {
        return visitService.getCurrentVisitors();
    }

    @PutMapping("/{id}/checkout")
    public Visit checkOut(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {

        return visitService.checkOut(id, request.get("checkOutTime"));
    }
}