package com.balineseretreat.airbnbapis;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final PropertyImageRepository propertyImageRepository;

    public ImageController(PropertyImageRepository propertyImageRepository) {
        this.propertyImageRepository = propertyImageRepository;
    }

    @GetMapping
    public Map<String, List<PropertyImage>> images() {
        return Map.of("images", propertyImageRepository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PropertyImage createImage(@Valid @RequestBody CreatePropertyImageRequest request) {
        PropertyImage image = new PropertyImage(
                request.slot(), request.url(), request.alt(),
                request.caption(), request.displayOrder()
        );
        return propertyImageRepository.save(image);
    }
}
