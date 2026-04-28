package com.barbershop.modules.shared.model.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class Address {
  // Ethiopian administrative divisions
  private String kebele;      // Neighborhood/ward (smallest unit)
  private String woreda;      // District
  private String zone;        // Zone (subdivision of region)
  private String region;      // Region (e.g., Addis Ababa, Oromia, Amhara)
  private String specificArea; // Specific location/street details
  private boolean isPrimary;

  public Address() {
  }

  public Address(String kebele, String woreda, String zone, String region, String specificArea, boolean isPrimary) {
    this.kebele = kebele;
    this.woreda = woreda;
    this.zone = zone;
    this.region = region;
    this.specificArea = specificArea;
    this.isPrimary = isPrimary;
  }

  public String getKebele() {
    return kebele;
  }

  public void setKebele(String kebele) {
    this.kebele = kebele;
  }

  public String getWoreda() {
    return woreda;
  }

  public void setWoreda(String woreda) {
    this.woreda = woreda;
  }

  public String getZone() {
    return zone;
  }

  public void setZone(String zone) {
    this.zone = zone;
  }

  public String getRegion() {
    return region;
  }

  public void setRegion(String region) {
    this.region = region;
  }

  public String getSpecificArea() {
    return specificArea;
  }

  public void setSpecificArea(String specificArea) {
    this.specificArea = specificArea;
  }

  public boolean isPrimary() {
    return isPrimary;
  }

  public void setPrimary(boolean isPrimary) {
    this.isPrimary = isPrimary;
  }

}
