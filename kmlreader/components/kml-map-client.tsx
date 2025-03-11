"use client"

import { useEffect, useRef, useCallback } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { KmlData, KmlFeature } from "@/lib/types"
import 'leaflet-geometryutil';

interface KmlMapClientProps {
    kmlData: KmlData
  }

interface GeometryUtilType {
    geodesicArea: (latLngs: L.LatLng[]) => number;
  }
  
  export function KmlMapClient({ kmlData }: KmlMapClientProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const leafletMap = useRef<L.Map | null>(null)

    const calculateLength = useCallback((latlngs: [number, number][]) => {
        try {
          let length = 0
          for (let i = 0; i < latlngs.length - 1; i++) {
            length += L.latLng(latlngs[i]).distanceTo(L.latLng(latlngs[i + 1]))
          }
          return length / 1000 // Convert to kilometers
        } catch (error) {
          console.error("Error calculating length:", error);
          return 0;
        }
      }, [])

      const createLayerFromFeature = useCallback((feature: KmlFeature): L.Layer | null => {
        // Skip invalid features
        if (!feature || !feature.type || !feature.coordinates) {
          console.warn("Invalid feature:", feature);
          return null;
        }
    
        try {
          switch (feature.type) {
            case "Point":
              // Handle Point coordinates safely
              if (!Array.isArray(feature.coordinates) || !feature.coordinates[0]) {
                console.warn("Invalid Point coordinates:", feature.coordinates);
                return null;
              }
              
              let coords: number[];
              
              // Handle both formats: [lon, lat] or [[lon, lat]]
              if (Array.isArray(feature.coordinates[0])) {
                coords = feature.coordinates[0] as number[];
              } else {
                coords = feature.coordinates as unknown as number[];
              }
              
              // Verify coordinates are valid numbers
              if (coords.length < 2 || typeof coords[0] !== 'number' || typeof coords[1] !== 'number') {
                console.warn("Invalid Point coordinate values:", coords);
                return null;
              }
              
              return L.marker([coords[1], coords[0]], {
                icon: L.divIcon({
                  html: `<div class="w-3 h-3 rounded-full bg-purple-500 border border-purple-300 shadow-[0_0_10px_rgba(147,51,234,0.7)]"></div>`,
                  className: "custom-div-icon",
                }),
              }).bindPopup(`<div class="text-sm">${feature.name || "Point"}</div>`)
    
            case "LineString":
              // Handle LineString coordinates safely
              if (!Array.isArray(feature.coordinates) || feature.coordinates.length < 2) {
                console.warn("Invalid LineString coordinates:", feature.coordinates);
                return null;
              }
              
              // Filter out invalid coordinates and convert to LatLng format
              const latlngs = feature.coordinates
                .filter(coord => Array.isArray(coord) && coord.length >= 2 && 
                        typeof coord[0] === 'number' && typeof coord[1] === 'number')
                .map(coord => [coord[1], coord[0]] as [number, number]);
              
              if (latlngs.length < 2) {
                console.warn("Not enough valid coordinates for LineString");
                return null;
              }
              
              return L.polyline(latlngs, {
                color: "#6366f1",
                weight: 3,
                opacity: 0.8,
                dashArray: "5, 5",
                className: "animate-pulse",
              }).bindPopup(
                `<div class="text-sm">${feature.name || "LineString"}<br>Length: ${calculateLength(latlngs).toFixed(2)} km</div>`,
              )
    
            case "Polygon":
              // Handle Polygon coordinates safely
              if (!Array.isArray(feature.coordinates) || 
                  !Array.isArray(feature.coordinates[0]) || 
                  feature.coordinates[0].length < 3) {
                console.warn("Invalid Polygon coordinates:", feature.coordinates);
                return null;
              }
              
              // Filter out invalid coordinates and convert to LatLng format
              const polygonCoords = (feature.coordinates[0] as number[][])
                .filter(coord => Array.isArray(coord) && coord.length >= 2 && 
                        typeof coord[0] === 'number' && typeof coord[1] === 'number')
                .map(coord => [coord[1], coord[0]] as [number, number]);
              
              if (polygonCoords.length < 3) {
                console.warn("Not enough valid coordinates for Polygon");
                return null;
              }
              
              return L.polygon(polygonCoords, {
                color: "#8b5cf6",
                fillColor: "#8b5cf6",
                fillOpacity: 0.3,
                weight: 2,
              }).bindPopup(
                `<div class="text-sm">${feature.name || "Polygon"}<br>Area: ${calculateArea(polygonCoords).toFixed(2)} km²</div>`,
              )
    
            default:
              console.warn("Unsupported feature type:", feature.type);
              return null;
          }
        } catch (error) {
          console.error("Error creating layer from feature:", error);
          return null;
        }
      }
      , [calculateLength])
  
    useEffect(() => {
      if (!mapRef.current) return
  
      // Initialize map if it doesn't exist
      if (!leafletMap.current) {
        leafletMap.current = L.map(mapRef.current).setView([0, 0], 2)
  
        // Add custom space-themed tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(leafletMap.current)
  
        // Add custom styling to make it more space-like
        const mapContainer = mapRef.current
        if (mapContainer) {
          const style = document.createElement("style")
          style.textContent = `
            .leaflet-tile-pane {
              filter: hue-rotate(210deg) saturate(0.7) brightness(0.7);
            }
          `
          mapContainer.appendChild(style)
        }
      }
  
      // Clear existing layers
      leafletMap.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) return // Keep the base tile layer
        leafletMap.current?.removeLayer(layer)
      })
  
      // Add KML features to map
      const bounds = L.latLngBounds([])
      let hasValidBounds = false
  
      // Debug info
      console.log("KML features count:", kmlData.features.length);
  
      kmlData.features.forEach((feature, index) => {
        try {
          // Debug info
          console.log(`Processing feature ${index}:`, feature.type, feature.name);
          
          const layer = createLayerFromFeature(feature)
          if (layer) {
            layer.addTo(leafletMap.current!)
  
            // Extend bounds to include this feature
            if (layer instanceof L.Path) {
              try {
                const layerBounds = (layer as unknown as {getBounds(): L.LatLngBounds}).getBounds();
                if (layerBounds && layerBounds.isValid && layerBounds.isValid()) {
                  bounds.extend(layerBounds);
                  hasValidBounds = true;
                }
              } catch (e) {
                console.error("Error extending bounds:", e);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing feature ${index}:`, error);
        }
      })
  
      // Fit map to bounds if we have valid features
      if (hasValidBounds) {
        leafletMap.current.fitBounds(bounds, { padding: [20, 20] })
      } else {
        // Default view if no valid bounds
        leafletMap.current.setView([0, 0], 2);
      }
  
      return () => {
        // Cleanup will happen on next effect run
      }
    }, [kmlData, calculateLength, createLayerFromFeature])
  
    // Calculate area of a polygon in square kilometers (approximate)
    const calculateArea = (latlngs: [number, number][]) => {
      try {
        // Simple calculation for polygon area
        const polygon = L.polygon(latlngs);
        
        // Try to use geodesic area if available
        if (L.GeometryUtil && 'geodesicArea' in L.GeometryUtil) {
          try {
            const geometryUtil = L.GeometryUtil as unknown as GeometryUtilType;
            const area = geometryUtil.geodesicArea(polygon.getLatLngs()[0] as L.LatLng[]);
            return area / 1000000; // Convert to square kilometers
          } catch (e) {
            console.warn("Failed to use geodesicArea:", e);
          }
        }
        
        // Fallback: rough approximation
        // Get the bounds area as approximation
        const bounds = polygon.getBounds();
        const width = bounds.getEast() - bounds.getWest();
        const height = bounds.getNorth() - bounds.getSouth();
        const centerLat = bounds.getCenter().lat;
        
        // Approximate conversion to km at this latitude
        const latRad = centerLat * Math.PI / 180;
        const kmPerDegLat = 111.32; // km per degree latitude (roughly constant)
        const kmPerDegLon = 111.32 * Math.cos(latRad); // km per degree longitude (varies with latitude)
        
        const areaKm2 = (width * kmPerDegLon) * (height * kmPerDegLat);
        return areaKm2 * 0.7; // Apply a correction factor for approximation
      } catch (error) {
        console.error("Error calculating area:", error);
        return 0;
      }
    }
  
    return <div ref={mapRef} className="h-[600px] w-full rounded-md overflow-hidden" />
  }