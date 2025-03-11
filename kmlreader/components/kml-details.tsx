"use client"

import type { KmlData } from "@/lib/types"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, LineChart, Hexagon } from "lucide-react"

interface KmlDetailsProps {
  kmlData: KmlData
}

export function KmlDetails({ kmlData }: KmlDetailsProps) {
  // Calculate length for LineString features
  const calculateLength = (coordinates: number[][]) => {
    try {
      let length = 0
      for (let i = 0; i < coordinates.length - 1; i++) {
        const [lon1, lat1] = coordinates[i]
        const [lon2, lat2] = coordinates[i + 1]
        
        // Safety check for valid coordinate values
        if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || 
            typeof lat2 !== 'number' || typeof lon2 !== 'number') {
          continue;
        }
        
        length += getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
      }
      return length
    } catch (error) {
      console.error("Error calculating length:", error);
      return 0;
    }
  }

  // Haversine formula to calculate distance between two points
  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  // Get icon for feature type
  const getIcon = (type: string) => {
    switch (type) {
      case "Point":
        return <MapPin className="h-4 w-4 text-blue-400" />
      case "LineString":
        return <LineChart className="h-4 w-4 text-purple-400" />
      case "Polygon":
        return <Hexagon className="h-4 w-4 text-indigo-400" />
      default:
        return null
    }
  }

  // Type guard for objects with @type
  const hasTypeProperty = (value: unknown): value is { '@type': unknown } => {
    return value !== null && typeof value === 'object' && '@type' in value;
  };

  // Helper function to safely stringify any value
  const safeString = (value: unknown): string => {
    if (value === null || value === undefined) {
      return "-";
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'number' || typeof value === 'boolean') {
      return value.toString();
    }
    
    try {
      // Handle XML or HTML content
      if (hasTypeProperty(value)) {
        // If it's an XML element or has special formatting
        return `[Formatted content]`;
      }
      
      // For other objects
      return JSON.stringify(value).substring(0, 100);
    } catch (error) {
      console.error("Error converting value to string:", error);
      return "[Error converting value]";
    }
  };

  // Prepare data for the table
  const tableData = kmlData.features.map((feature) => {
    try {
      let length = null;
      if (feature.type === "LineString") {
        // Make sure coordinates is an array of arrays of numbers
        if (Array.isArray(feature.coordinates)) {
          // Check if the first element is a coordinate pair or another array
          const isNestedArray = Array.isArray(feature.coordinates[0]) && 
                               Array.isArray(feature.coordinates[0][0]);
          
          if (!isNestedArray) {
            // It's a simple array of coordinate pairs
            length = calculateLength(feature.coordinates as number[][]);
          }
        }
      }

      return {
        ...feature,
        // Ensure name and description are safe to render
        name: safeString(feature.name),
        description: safeString(feature.description),
        length,
      };
    } catch (error) {
      console.error("Error processing feature for table:", error);
      return {
        type: feature.type || "Unknown",
        name: "Error processing feature",
        description: "-",
        length: null
      };
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-blue-300">KML Details</h2>
        <p className="text-blue-400">Detailed information about elements in your KML file</p>
      </div>

      <Table>
        <TableCaption>Detailed element information</TableCaption>
        <TableHeader>
          <TableRow className="border-blue-900">
            <TableHead className="text-blue-300">Type</TableHead>
            <TableHead className="text-blue-300">Name</TableHead>
            <TableHead className="text-blue-300">Description</TableHead>
            <TableHead className="text-right text-blue-300">Length (km)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((feature, index) => (
            <TableRow key={index} className="border-blue-900/50 hover:bg-blue-950/30">
              <TableCell className="font-medium flex items-center gap-2">
                {getIcon(feature.type)}
                {feature.type}
              </TableCell>
              <TableCell>{feature.name || "-"}</TableCell>
              <TableCell className="max-w-xs truncate">{feature.description || "-"}</TableCell>
              <TableCell className="text-right">{feature.length !== null ? feature.length.toFixed(2) : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {kmlData.folders.length > 0 && (
        <div className="p-4 rounded-md bg-blue-950/20 border border-blue-900">
          <h3 className="text-lg font-medium mb-2 text-blue-300">Folders</h3>
          <ul className="space-y-2">
            {kmlData.folders.map((folder, index) => (
              <li key={index} className="pl-4 border-l-2 border-blue-800">
                {typeof folder.name === 'string' ? folder.name : `Folder ${index + 1}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}