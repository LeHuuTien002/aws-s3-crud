package com.tien.demos3file;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoS3FileApplication {


    public static void main(String[] args) {
        // Tải các biến môi trường từ tệp .env
        Dotenv dotenv = Dotenv.configure().load();

        // Đặt biến môi trường vào System properties để Spring Boot có thể truy cập
        System.setProperty("cloud.aws.credentials.accessKey", dotenv.get("AWS_ACCESS_KEY_ID"));
        System.setProperty("cloud.aws.credentials.secretKey", dotenv.get("AWS_SECRET_ACCESS_KEY"));
        SpringApplication.run(DemoS3FileApplication.class, args);
    }

}
