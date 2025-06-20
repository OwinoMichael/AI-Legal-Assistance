package com.legal.demo.features.documentupload.commandhandler;


import com.legal.demo.application.exceptions.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {
    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        // Convert to absolute path once during initialization
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    private Path uploadPath;

    //MultipartFile (Spring) - Standard interface for handling file uploads in web requests
    //Features -- file.getOriginalFilename(); -- file.getBytes(); -- file.getSize(); --
    public String storeFile(MultipartFile file) throws IOException{
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = FilenameUtils.getExtension(fileName);
        String storedFileName = UUID.randomUUID() + "." + fileExtension;

        //Paths (java.nio.file) - Creates Path objects for file system operations
        Path targetLocation = uploadPath.resolve(storedFileName);

        //Files (java.nio.file) - Utility for file operations (create, copy, delete)
        Files.createDirectories(targetLocation.getParent());
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return storedFileName;
    }


    //Resource (Spring) - Abstraction for files/classpath resources
    //Uniform access to files for downloading
    public Resource loadFileAsResource(String fileName) {
        try {
            // Use the same path construction as storeFile
            Path filePath = uploadPath.resolve(fileName);
            System.out.println("Looking for file at: " + filePath.toAbsolutePath());
            System.out.println("File exists: " + Files.exists(filePath));

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found " + fileName);
        }
    }


    public void deleteFileWithException(String fileName) throws IOException {
        // Resolve the file path
        Path filePath = uploadPath.resolve(fileName);

        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("File not found for deletion: " + fileName);
        }

        try {
            Files.delete(filePath);
            System.out.println("Successfully deleted file: " + fileName);
        } catch (IOException e) {
            throw new IOException("Failed to delete file: " + fileName, e);
        }
    }


}
