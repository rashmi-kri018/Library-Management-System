package com.library.library_management.service;

import com.library.library_management.model.Book;
import com.library.library_management.repository.BookRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Add a new book
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    // Get all books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Get book by ID
    public Book getBookById(String id) {
        return bookRepository.findById(id).orElse(null);
    }

    // Delete a book
    public void deleteBook(String id) {
        bookRepository.deleteById(id);
    }

    public Book updateBook(String id, Book updatedBook) {

    Book existingBook = bookRepository.findById(id).orElse(null);

    if (existingBook == null) {
        return null;
    }

    existingBook.setTitle(updatedBook.getTitle());
    existingBook.setAuthor(updatedBook.getAuthor());
    existingBook.setIsbn(updatedBook.getIsbn());
    existingBook.setStatus(updatedBook.getStatus());

    return bookRepository.save(existingBook);
 }
}