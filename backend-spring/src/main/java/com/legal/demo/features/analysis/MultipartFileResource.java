package com.legal.demo.features.analysis;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;

public class MultipartFileResource implements Resource {
    private final MultipartFile multipartFile;

    public MultipartFileResource(MultipartFile multipartFile) {
        this.multipartFile = multipartFile;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return multipartFile.getInputStream();
    }

    @Override
    public String getFilename() {
        return multipartFile.getOriginalFilename();
    }

    @Override
    public long contentLength() throws IOException {
        return multipartFile.getSize();
    }

    @Override
    public boolean exists() {
        return true;
    }

    @Override
    public boolean isReadable() {
        return true;
    }

    @Override
    public boolean isOpen() {
        return false;
    }

    @Override
    public boolean isFile() {
        return false;
    }

    @Override
    public URL getURL() throws IOException {
        throw new UnsupportedOperationException("MultipartFile resource cannot be resolved to URL");
    }

    @Override
    public URI getURI() throws IOException {
        throw new UnsupportedOperationException("MultipartFile resource cannot be resolved to URI");
    }

    @Override
    public File getFile() throws IOException {
        throw new UnsupportedOperationException("MultipartFile resource cannot be resolved to File");
    }

    @Override
    public long lastModified() throws IOException {
        return -1;
    }

    @Override
    public Resource createRelative(String relativePath) throws IOException {
        throw new UnsupportedOperationException("Cannot create relative resource");
    }

    @Override
    public String getDescription() {
        return "MultipartFile resource [" + multipartFile.getOriginalFilename() + "]";
    }
}