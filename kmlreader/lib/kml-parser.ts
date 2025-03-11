import type { KmlData, KmlFeature, KmlFolder, KmlDocument } from "@/lib/types"
import { DOMParser } from "@xmldom/xmldom"
import * as toGeoJSON from "@tmcw/togeojson"
import { 
    Feature, 
    Geometry, 
    GeoJsonProperties, 
    Point, 
    LineString, 
    Polygon, 
    MultiLineString, 
    MultiPolygon 
  } from 'geojson';
export async function parseKml(kmlString: string): Promise<KmlData> {
  try {
    // Parse KML string to XML DOM
    const parser = new DOMParser()
    const kmlDoc = parser.parseFromString(kmlString, "text/xml")

    // Convert to GeoJSON for easier processing
    const geoJson = toGeoJSON.kml(kmlDoc)

    // Extract KML metadata
    const name = getElementText(kmlDoc, "name") || ""
    const description = getElementText(kmlDoc, "description") || ""

    // Extract folders
    const folderElements = kmlDoc.getElementsByTagName("Folder")
    const folders: KmlFolder[] = Array.from(folderElements).map((folderEl) => ({
      name: getElementTextFromNode(folderEl, "name") || "",
      description: getElementTextFromNode(folderEl, "description") || "",
    }))

    // Extract documents
    const documentElements = kmlDoc.getElementsByTagName("Document")
    const documents: KmlDocument[] = Array.from(documentElements).map((docEl) => ({
      name: getElementTextFromNode(docEl, "name") || "",
      description: getElementTextFromNode(docEl, "description") || "",
    }))

    // Process GeoJSON features to our format
    const features: KmlFeature[] = []

    if (geoJson.features) {
        geoJson.features.forEach((feature: Feature<Geometry | null, GeoJsonProperties>) => {
          if (feature.geometry) {
            // Create proper types for coordinates based on GeoJSON spec
            type Position = number[]; // [longitude, latitude] or [longitude, latitude, altitude]
            type LineStringCoordinates = Position[];
            type PolygonCoordinates = Position[][];
            type MultiLineStringCoordinates = Position[][];
            type MultiPolygonCoordinates = Position[][][];
      
            // Use a type assertion with proper type
            const geometryType = feature.geometry.type;
            let coordinates: Position | Position[] | Position[][] | Position[][][] = [];
            
            // Assign coordinates with proper typing
            switch (geometryType) {
              case "Point":
                coordinates = (feature.geometry as Point).coordinates as Position;
                break;
              case "LineString":
                coordinates = (feature.geometry as LineString).coordinates as Position[];
                break;
              case "MultiLineString":
                coordinates = (feature.geometry as MultiLineString).coordinates as Position[][];
                break;
              case "Polygon":
                coordinates = (feature.geometry as Polygon).coordinates as Position[][];
                break;
              case "MultiPolygon":
                coordinates = (feature.geometry as MultiPolygon).coordinates as Position[][][];
                break;
              default:
                coordinates = [];
            }
      
            // Map GeoJSON geometry types to our simplified types
            let featureType: string;
            switch (geometryType) {
              case "Point":
                featureType = "Point";
                break;
              case "LineString":
                featureType = "LineString";
                break;
              case "MultiLineString":
                featureType = "LineString"; // Simplify for our purposes
                break;
              case "Polygon":
                featureType = "Polygon";
                break;
              case "MultiPolygon":
                featureType = "Polygon"; // Simplify for our purposes
                break;
              default:
                featureType = geometryType;
            }
      
            // Extract properties
            const featureName = feature.properties?.name || "";
            const featureDescription = feature.properties?.description || "";
      
            // Handle different geometry types
            if (featureType === "Point") {
              features.push({
                type: featureType,
                name: featureName,
                description: featureDescription,
                coordinates: [coordinates as Position],
              });
            } else if (featureType === "LineString") {
              // Handle both LineString and MultiLineString
              if (geometryType === "LineString") {
                // Regular LineString
                features.push({
                  type: featureType,
                  name: featureName,
                  description: featureDescription,
                  coordinates: coordinates as LineStringCoordinates,
                });
              } else {
                // MultiLineString - add each line as a separate feature
                (coordinates as MultiLineStringCoordinates).forEach((line) => {
                  features.push({
                    type: featureType,
                    name: featureName,
                    description: featureDescription,
                    coordinates: line,
                  });
                });
              }
            } else if (featureType === "Polygon") {
              // Handle both Polygon and MultiPolygon
              if (geometryType === "Polygon") {
                // Regular Polygon
                features.push({
                  type: featureType,
                  name: featureName,
                  description: featureDescription,
                  coordinates: coordinates as PolygonCoordinates,
                });
              } else {
                // MultiPolygon - add each polygon as a separate feature
                (coordinates as MultiPolygonCoordinates).forEach((poly) => {
                  features.push({
                    type: featureType,
                    name: featureName,
                    description: featureDescription,
                    coordinates: poly,
                  });
                });
              }
            }
          }
        });
      }

    return {
      name,
      description,
      folders,
      documents,
      features,
    }
  } catch (error) {
    console.error("Error parsing KML:", error)
    throw new Error("Failed to parse KML file")
  }
}

// Helper function to get text content of an element
function getElementText(doc: import("@xmldom/xmldom").Document, tagName: string): string | null {
  const elements = doc.getElementsByTagName(tagName)
  if (elements.length > 0) {
    return elements[0].textContent
  }
  return null
}

// Helper function to get text content of an element from a specific node
function getElementTextFromNode(node: import("@xmldom/xmldom").Element, tagName: string): string | null {
  const elements = node.getElementsByTagName(tagName)
  if (elements.length > 0) {
    return elements[0].textContent
  }
  return null
}

