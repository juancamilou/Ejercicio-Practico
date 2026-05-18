package com.productos.api.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private String mensaje;
    private Integer codigo;
    private LocalDateTime timestamp;
    private String ruta;
}
