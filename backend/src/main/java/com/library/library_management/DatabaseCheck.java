package com.library.library_management;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.core.env.Environment;

@Component
public class DatabaseCheck implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;
    private final Environment environment;

    public DatabaseCheck(MongoTemplate mongoTemplate, Environment environment) {
        this.mongoTemplate = mongoTemplate;
        this.environment = environment;
    }

    @Override
    public void run(String... args) {
        System.out.println("DATABASE NAME: " +
        mongoTemplate.getMongoDatabaseFactory()
        .getMongoDatabase().getName());
        System.out.println("CONFIGURED DATABASE: " +
                environment.getProperty("spring.data.mongodb.database"));

        System.out.println("MONGO DATABASE FACTORY: " +
        mongoTemplate.getMongoDatabaseFactory().getClass().getName());
    }
}