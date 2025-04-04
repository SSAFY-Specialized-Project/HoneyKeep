package com.barcode.honeykeep.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {

    public static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:15-alpine")
            .withReuse(true)
            .withExposedPorts(5432);

    public static GenericContainer<?> redisContainer = new GenericContainer<>(DockerImageName.parse("redis:latest"))
            .withReuse(true)
            .withExposedPorts(6379);

    public static MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:latest"))
            .withReuse(true)
            .withExposedPorts(27017);

    static {
        postgreSQLContainer.start();
        redisContainer.start();
        mongoDBContainer.start();
    }

    @Bean
    @ServiceConnection(name = "postgres")
    PostgreSQLContainer<?> postgresContainer() {
        return postgreSQLContainer;
    }

    @Bean
    @ServiceConnection(name = "redis")
    GenericContainer<?> redisContainer() {
        return redisContainer;
    }

    @Bean
    @ServiceConnection(name = "mongodb")
    MongoDBContainer mongoDBContainer() {
        return mongoDBContainer;
    }
}
