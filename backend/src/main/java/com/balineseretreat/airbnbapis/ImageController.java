package com.balineseretreat.airbnbapis;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
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

    @GetMapping("/{id}")
    public PropertyImage imageById(@PathVariable Long id) {
        return findImage(id);
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

    @PutMapping("/{id}")
    public PropertyImage updateImage(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePropertyImageRequest request
    ) {
        PropertyImage image = findImage(id);
        image.update(
                request.slot(), request.url(), request.alt(),
                request.caption(), request.displayOrder()
        );
        return propertyImageRepository.save(image);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteImage(@PathVariable Long id) {
        PropertyImage image = findImage(id);
        propertyImageRepository.delete(image);
    }

    private PropertyImage findImage(Long id) {
        return propertyImageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Property image " + id + " was not found"
                ));
    }
}
