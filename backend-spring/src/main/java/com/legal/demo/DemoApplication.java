package com.legal.demo;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@SpringBootApplication
@EnableAsync(proxyTargetClass = true)
public class DemoApplication {

	@Value("${file.upload-dir:./uploads}")
	private String uploadDir;

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@PostConstruct
	public void init() {
		try {
			Files.createDirectories(Paths.get(uploadDir));
		} catch (IOException e) {
			throw new RuntimeException("Could not create upload directory!", e);
		}
	}

}
