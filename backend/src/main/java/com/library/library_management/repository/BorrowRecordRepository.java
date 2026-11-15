
package com.library.library_management.repository;

import com.library.library_management.model.BorrowRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BorrowRecordRepository
        extends MongoRepository<BorrowRecord, String> {

    List<BorrowRecord> findByReturnDateIsNull();

    boolean existsByBookIdAndReturnDateIsNull(String bookId);
}
