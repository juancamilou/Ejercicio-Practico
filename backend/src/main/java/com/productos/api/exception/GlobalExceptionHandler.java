package com.productos.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleProductoNoEncontrado(
            ProductoNoEncontradoException ex,
            WebRequest request) {
        
        ErrorResponse error = new ErrorResponse();
        error.setMensaje(ex.getMessage());
        error.setCodigo(HttpStatus.NOT_FOUND.value());
        error.setTimestamp(LocalDateTime.now());
        error.setRuta(request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex,
            WebRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errores = new HashMap<>();
        
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errores.put(error.getField(), error.getDefaultMessage())
        );
        
        response.put("mensaje", "Error de validación");
        response.put("codigo", HttpStatus.BAD_REQUEST.value());
        response.put("timestamp", LocalDateTime.now());
        response.put("errores", errores);
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex,
            WebRequest request) {
        
        ErrorResponse error = new ErrorResponse();
        error.setMensaje("Error interno del servidor");
        error.setCodigo(HttpStatus.INTERNAL_SERVER_ERROR.value());
        error.setTimestamp(LocalDateTime.now());
        error.setRuta(request.getDescription(false).replace("uri=", ""));
        
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
