//components\kml-viewer.tsx

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Map, BarChart2 } from "lucide-react"
import { KmlSummary } from "@/components/kml-summary"
import { KmlDetails } from "@/components/kml-details"
import { KmlMap } from "@/components/kml-map"
import { parseKml } from "@/lib/kml-parser"
import type { KmlData } from "@/lib/types"

interface KmlViewerProps {
  file: File
  onReset: () => void
}

export function KmlViewer({ file, onReset }: KmlViewerProps) {
  const [kmlData, setKmlData] = useState<KmlData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const readFile = async () => {
      try {
        setLoading(true)
        setError(null)

        const reader = new FileReader()

        reader.onload = async (e) => {
          try {
            const content = e.target?.result as string
            const data = await parseKml(content)
            setKmlData(data)
          } catch (err) {
            setError("Failed to parse KML file. Please ensure it's a valid KML format.")
            console.error(err)
          } finally {
            setLoading(false)
          }
        }

        reader.onerror = () => {
          setError("Failed to read the file. Please try again.")
          setLoading(false)
        }

        reader.readAsText(file)
      } catch (error) {
        console.error("Error details:", error);
        setError("An unexpected error occurred.")
        setLoading(false)
      }
    }

    readFile()
  }, [file])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onReset} className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Upload Different File
        </Button>
        <div className="text-blue-300">
          <span className="font-medium">Current File:</span> {file.name}
        </div>
      </div>

      {loading ? (
        <Card className="p-8 text-center bg-black/50 border border-blue-900 backdrop-blur-sm">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-r-2 border-blue-500 border-b-2 border-transparent mb-4"></div>
          <p className="text-blue-300">Processing your KML file...</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center bg-black/50 border border-red-900 backdrop-blur-sm">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-400 mb-2 font-semibold">Error</p>
          <p className="text-blue-300">{error}</p>
        </Card>
      ) : kmlData ? (
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid grid-cols-3 bg-black/50 border border-blue-900">
            <TabsTrigger value="map" className="data-[state=active]:bg-blue-900/50">
              <Map className="h-4 w-4 mr-2" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="summary" className="data-[state=active]:bg-blue-900/50">
              <BarChart2 className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-blue-900/50">
              <FileText className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="mt-4">
            <Card className="bg-black/50 border border-blue-900 backdrop-blur-sm overflow-hidden">
              <KmlMap kmlData={kmlData} />
            </Card>
          </TabsContent>
          <TabsContent value="summary" className="mt-4">
            <Card className="bg-black/50 border border-blue-900 backdrop-blur-sm p-6">
              <KmlSummary kmlData={kmlData} />
            </Card>
          </TabsContent>
          <TabsContent value="details" className="mt-4">
            <Card className="bg-black/50 border border-blue-900 backdrop-blur-sm p-6">
              <KmlDetails kmlData={kmlData} />
            </Card>
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  )
}

