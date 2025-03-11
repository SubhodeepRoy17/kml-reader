"use client"

import type React from "react"

import { useState } from "react"
import { KmlViewer } from "@/components/kml-viewer"
import { SpaceBackground } from "@/components/space-background"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <SpaceBackground />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600">
            Cosmic KML Explorer
          </h1>
          <p className="text-xl text-blue-300 max-w-2xl mx-auto">
            Upload your KML files to visualize geographic data across the cosmos
          </p>
        </div>

        {!file ? (
          <div className="max-w-md mx-auto">
            <div className="border-2 border-dashed border-blue-500 rounded-lg p-12 text-center bg-black/50 backdrop-blur-sm hover:border-purple-400 transition-colors">
              <Upload className="h-12 w-12 mx-auto mb-4 text-blue-400" />
              <h2 className="text-xl font-semibold mb-2">Upload KML File</h2>
              <p className="text-blue-300 mb-6">Drag and drop your KML file or click to browse</p>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Select KML File
              </Button>
              <input id="file-upload" type="file" accept=".kml" onChange={handleFileChange} className="hidden" />
            </div>
          </div>
        ) : (
          <KmlViewer file={file} onReset={() => setFile(null)} />
        )}
      </div>
    </main>
  )
}

