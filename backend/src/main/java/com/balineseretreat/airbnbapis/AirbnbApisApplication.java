package com.balineseretreat.airbnbapis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AirbnbApisApplication {

	public static void main(String[] args) {
		SpringApplication.run(AirbnbApisApplication.class, args);
	}

}
