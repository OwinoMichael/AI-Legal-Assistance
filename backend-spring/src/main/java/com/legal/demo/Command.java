package com.legal.demo;

import org.apache.tika.exception.TikaException;
import org.springframework.http.ResponseEntity;
import org.xml.sax.SAXException;

import java.io.IOException;

public interface Command <I, T>{

    ResponseEntity<T> execute(I input) throws TikaException, IOException, SAXException;
}
