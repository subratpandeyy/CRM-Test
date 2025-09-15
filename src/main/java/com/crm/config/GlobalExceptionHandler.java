package com.crm.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatusCode status, WebRequest request) {
		log.warn("Validation failed: {}", ex.getMessage());
		Map<String, Object> body = new HashMap<>();
		body.put("timestamp", OffsetDateTime.now(ZoneOffset.UTC));
		body.put("status", HttpStatus.BAD_REQUEST.value());
		body.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
		String message = ex.getBindingResult().getFieldErrors().stream()
				.map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
				.collect(Collectors.joining(", "));
		body.put("message", message);
		body.put("path", request.getDescription(false).replace("uri=", ""));
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
	}

	@Override
	protected ResponseEntity<Object> handleHttpMessageNotWritable(HttpMessageNotWritableException ex,
			HttpHeaders headers, HttpStatusCode status, WebRequest request) {
		Throwable root = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause() : ex;
		log.error("Failed to write response: {}", root.getMessage(), ex);
		Map<String, Object> body = new HashMap<>();
		body.put("timestamp", OffsetDateTime.now(ZoneOffset.UTC));
		body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
		body.put("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
		body.put("message", root.getMessage());
		body.put("path", request.getDescription(false).replace("uri=", ""));
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
	}

	@ExceptionHandler({ MethodArgumentTypeMismatchException.class, IllegalArgumentException.class })
	public ResponseEntity<Object> handleBadRequest(Exception ex, HttpServletRequest request) {
		log.warn("Bad request on {} {}: {}", request.getMethod(), request.getRequestURI(), ex.getMessage());
		Map<String, Object> body = new HashMap<>();
		body.put("timestamp", OffsetDateTime.now(ZoneOffset.UTC));
		body.put("status", HttpStatus.BAD_REQUEST.value());
		body.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
		body.put("message", ex.getMessage());
		body.put("path", request.getRequestURI());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
	}

	@ExceptionHandler({ org.springframework.security.access.AccessDeniedException.class })
	public ResponseEntity<Object> handleAccessDenied(Exception ex, HttpServletRequest request) {
		log.warn("Access denied on {} {}", request.getMethod(), request.getRequestURI());
		Map<String, Object> body = new HashMap<>();
		body.put("timestamp", OffsetDateTime.now(ZoneOffset.UTC));
		body.put("status", HttpStatus.FORBIDDEN.value());
		body.put("error", HttpStatus.FORBIDDEN.getReasonPhrase());
		body.put("message", "Access is denied");
		body.put("path", request.getRequestURI());
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
	}

	@ExceptionHandler({ org.springframework.security.core.AuthenticationException.class })
	public ResponseEntity<Object> handleAuthentication(Exception ex, HttpServletRequest request) {
		log.warn("Unauthorized on {} {}", request.getMethod(), request.getRequestURI());
		Map<String, Object> body = new HashMap<>();
		body.put("timestamp", OffsetDateTime.now(ZoneOffset.UTC));
		body.put("status", HttpStatus.UNAUTHORIZED.value());
		body.put("error", HttpStatus.UNAUTHORIZED.getReasonPhrase());
		body.put("message", "Unauthorized");
		body.put("path", request.getRequestURI());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleAll(Exception ex, HttpServletRequest request) {
		log.error("Unhandled error on {} {}: {}", request.getMethod(), request.getRequestURI(), ex.getMessage(), ex);
		Map<String, Object> body = new HashMap<>();
		body.put("timestamp", OffsetDateTime.now(ZoneOffset.UTC));
		body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
		body.put("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
		body.put("message", ex.getMessage());
		body.put("path", request.getRequestURI());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
	}
}
