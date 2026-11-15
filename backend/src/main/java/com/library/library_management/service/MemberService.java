package com.library.library_management.service;

import com.library.library_management.model.Member;
import com.library.library_management.repository.MemberRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member addMember(Member member) {
        if (memberRepository.existsByMemberId(member.getMemberId())) {
            throw new RuntimeException("Member ID already exists!");
        }
        return memberRepository.save(member);
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Member getMemberById(String id) {
        return memberRepository.findById(id).orElse(null);
    }

    public void deleteMember(String id) {
        memberRepository.deleteById(id);
    }

    public Member updateMember(String id, Member updatedMember) {
        Member existingMember = memberRepository.findById(id).orElse(null);

        if (existingMember == null) {
            return null;
        }

        if (!existingMember.getMemberId().equals(updatedMember.getMemberId())
                && memberRepository.existsByMemberId(updatedMember.getMemberId())) {
            throw new RuntimeException("Member ID already exists!");
        }

        existingMember.setMemberName(updatedMember.getMemberName());
        existingMember.setMemberId(updatedMember.getMemberId());
        existingMember.setMemberType(updatedMember.getMemberType());

        return memberRepository.save(existingMember);
    }
}