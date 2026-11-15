package com.library.library_management.repository;

import com.library.library_management.model.Visit;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VisitRepository extends MongoRepository<Visit, String> {

    List<Visit> findByCheckOutTimeIsNull();

    boolean existsByMemberIdAndCheckOutTimeIsNull(String memberId);
}