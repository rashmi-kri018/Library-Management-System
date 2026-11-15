package com.library.library_management.repository;

import com.library.library_management.model.Member;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MemberRepository extends MongoRepository<Member, String> {

    boolean existsByMemberId(String memberId);
}