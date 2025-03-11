export interface KmlFeature {
    type: string
    name: string
    description: string
    coordinates: number[][] | number[][][]
  }
  
  export interface KmlFolder {
    name: string
    description: string
  }
  
  export interface KmlDocument {
    name: string
    description: string
  }
  
  export interface KmlData {
    name: string
    description: string
    folders: KmlFolder[]
    documents: KmlDocument[]
    features: KmlFeature[]
  }
  
  