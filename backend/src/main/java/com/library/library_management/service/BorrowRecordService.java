
package com.library.library_management.service;

import com.library.library_management.model.BorrowRecord;
import com.library.library_management.model.Book;
import com.library.library_management.repository.BorrowRecordRepository;
import com.library.library_management.repository.BookRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BorrowRecordService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;

    public BorrowRecordService(
            BorrowRecordRepository borrowRecordRepository,
            BookRepository bookRepository) {

        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
    }

    // Get all borrowing records
    public List<BorrowRecord> getAllRecords() {
        return borrowRecordRepository.findAll();
    }

    // Issue a book
    public BorrowRecord issueBook(BorrowRecord record) {

        Book book = bookRepository.findById(record.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if ("Issued".equals(book.getStatus())) {
            throw new RuntimeException("Book is already issued");
        }

        book.setStatus("Issued");
        bookRepository.save(book);

        record.setReturnDate(null);

        return borrowRecordRepository.save(record);
    }

    // Return a book
    public BorrowRecord returnBook(String recordId, String returnDate) {

        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Borrowing record not found"));

        if (record.getReturnDate() != null) {
            throw new RuntimeException("Book has already been returned");
        }

        record.setReturnDate(returnDate);

        Book book = bookRepository.findById(record.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setStatus("Available");
        bookRepository.save(book);

        return borrowRecordRepository.save(record);
    }
}
