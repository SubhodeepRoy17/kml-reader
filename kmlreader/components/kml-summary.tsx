"use client"

import type { KmlData } from "@/lib/types"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, LineChart, Hexagon, FileText, Folder, Globe } from "lucide-react"

interface KmlSummaryProps {
  kmlData: KmlData
}

export function KmlSummary({ kmlData }: KmlSummaryProps) {
  // Count feature types
  const counts = {
    Point: 0,
    LineString: 0,
    Polygon: 0,
    Folder: kmlData.folders.length,
    Document: kmlData.documents.length,
    Total: kmlData.features.length,
  }

  kmlData.features.forEach((feature) => {
    if (feature.type in counts) {
      counts[feature.type as keyof typeof counts]++
    }
  })

  const getIcon = (type: string) => {
    switch (type) {
      case "Point":
        return <MapPin className="h-4 w-4 text-blue-400" />
      case "LineString":
        return <LineChart className="h-4 w-4 text-purple-400" />
      case "Polygon":
        return <Hexagon className="h-4 w-4 text-indigo-400" />
      case "Folder":
        return <Folder className="h-4 w-4 text-yellow-400" />
      case "Document":
        return <FileText className="h-4 w-4 text-green-400" />
      case "Total":
        return <Globe className="h-4 w-4 text-pink-400" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-blue-300">KML Summary</h2>
        <p className="text-blue-400">Overview of elements in your KML file</p>
      </div>

      <Table>
        <TableCaption>Element counts in the KML file</TableCaption>
        <TableHeader>
          <TableRow className="border-blue-900">
            <TableHead className="text-blue-300">Element Type</TableHead>
            <TableHead className="text-right text-blue-300">Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(counts).map(([type, count]) => (
            <TableRow key={type} className="border-blue-900/50 hover:bg-blue-950/30">
              <TableCell className="font-medium flex items-center gap-2">
                {getIcon(type)}
                {type}
              </TableCell>
              <TableCell className="text-right">{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {kmlData.name && (
        <div className="p-4 rounded-md bg-blue-950/20 border border-blue-900">
          <h3 className="text-lg font-medium mb-1 text-blue-300">File Name</h3>
          <p>{kmlData.name}</p>
        </div>
      )}

      {kmlData.description && (
        <div className="p-4 rounded-md bg-blue-950/20 border border-blue-900">
          <h3 className="text-lg font-medium mb-1 text-blue-300">Description</h3>
          <p>{kmlData.description}</p>
        </div>
      )}
    </div>
  )
}

