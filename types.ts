
export enum WorkflowStep {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  DENSEPOSE = 'DENSEPOSE',
  SEMANTIC = 'SEMANTIC',
  LIGHTING = 'LIGHTING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface Garment {
  id: string;
  name: string;
  category: string;
  image: ImageData;
}

export interface VTONResult {
  imageUrl: string;
  analysis: string;
}
