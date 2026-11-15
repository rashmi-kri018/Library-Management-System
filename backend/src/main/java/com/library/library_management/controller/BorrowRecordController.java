
package com.library.library_management.controller;

import com.library.library_management.model.BorrowRecord;
import com.library.library_management.service.BorrowRecordService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow-records")
@CrossOrigin(origins = {"http://localhost:5173", "${FRONTEND_URL:http://localhost:5173}"})
public class BorrowRecordController {

    private final BorrowRecordService borrowRecordService;

    public BorrowRecordController(BorrowRecordService borrowRecordService) {
        this.borrowRecordService = borrowRecordService;
    }

    // Get all borrowing records
    @GetMapping
    public List<BorrowRecord> getAllRecords() {
        return borrowRecordService.getAllRecords();
    }

    // Issue a book
    @PostMapping
    public BorrowRecord issueBook(@RequestBody BorrowRecord record) {
        return borrowRecordService.issueBook(record);
    }

    // Return a book
    @PutMapping("/{id}/return")
    public BorrowRecord returnBook(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {

        return borrowRecordService.returnBook(
                id,
                request.get("returnDate")
        );
    }
}
