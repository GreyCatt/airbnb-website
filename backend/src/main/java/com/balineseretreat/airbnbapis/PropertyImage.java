package com.balineseretreat.airbnbapis;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "property_images")
public class PropertyImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slot;

    @Column(nullable = false)
    private String url;

    @Column(name = "alt_text", nullable = false)
    private String alt;

    private String caption;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    protected PropertyImage() {
    }

    public PropertyImage(String slot, String url, String alt, String caption, int displayOrder) {
        this.slot = slot;
        this.url = url;
        this.alt = alt;
        this.caption = caption;
        this.displayOrder = displayOrder;
    }

    public void update(String slot, String url, String alt, String caption, int displayOrder) {
        this.slot = slot;
        this.url = url;
        this.alt = alt;
        this.caption = caption;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public String getSlot() { return slot; }
    public String getUrl() { return url; }
    public String getAlt() { return alt; }
    public String getCaption() { return caption; }
    public int getDisplayOrder() { return displayOrder; }
}
