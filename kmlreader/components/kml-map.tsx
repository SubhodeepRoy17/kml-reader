"use client"

import type { KmlData } from "@/lib/types"
import dynamic from "next/dynamic"

// Dynamic import of the map component to avoid SSR
const KmlMapClient = dynamic(() => import("./kml-map-client").then(mod => mod.KmlMapClient), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full rounded-md overflow-hidden bg-gray-800 flex items-center justify-center">
    <div className="text-white">Loading map...</div>
  </div>
})

interface KmlMapProps {
  kmlData: KmlData
}

export function KmlMap({ kmlData }: KmlMapProps) {
  return <KmlMapClient kmlData={kmlData} />
}