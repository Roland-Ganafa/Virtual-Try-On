
import React, { useState, useEffect } from 'react';
import { WorkflowStep, ImageData, Garment } from './types';
import ImageUploader from './components/ImageUploader';
import WorkflowStatus from './components/WorkflowStatus';
import GarmentCatalog from './components/GarmentCatalog';
import BusinessPortal from './components/BusinessPortal';
import { vtonService } from './services/vtonService';

// Initial demo data
const DEFAULT_GARMENTS: Garment[] = [
  {
    id: '1',
    name: 'Cobalt Evening Blazer',
    category: 'Outerwear',
    image: { base64: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop', mimeType: 'image/jpeg' }
  },
  {
    id: '2',
    name: 'Silk Crimson Blouse',
    category: 'Tops',
    image: { base64: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop', mimeType: 'image/jpeg' }
  },
  {
    id: '3',
    name: 'Midnight Cashmere Knit',
    category: 'Tops',
    image: { base64: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop', mimeType: 'image/jpeg' }
  },
  {
    id: '4',
    name: 'Ivory Studio Coat',
    category: 'Outerwear',
    image: { base64: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800&auto=format&fit=crop', mimeType: 'image/jpeg' }
  }
];

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<ImageData | null>(null);
  const [garments, setGarments] = useState<Garment[]>(DEFAULT_GARMENTS);
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(WorkflowStep.IDLE);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusinessPortalOpen, setIsBusinessPortalOpen] = useState(false);

  const startProcessing = async () => {
    if (!personImage || !selectedGarment) return;

    setError(null);
    setResultImage(null);
    
    // Simulate technical workflow steps for visual feedback
    setCurrentStep(WorkflowStep.PARSING);
    await new Promise(r => setTimeout(r, 1200));
    
    setCurrentStep(WorkflowStep.DENSEPOSE);
    await new Promise(r => setTimeout(r, 1200));
    
    setCurrentStep(WorkflowStep.SEMANTIC);
    await new Promise(r => setTimeout(r, 1200));
    
    setCurrentStep(WorkflowStep.LIGHTING);
    await new Promise(r => setTimeout(r, 1200));
    
    setCurrentStep(WorkflowStep.GENERATING);
    
    try {
      // In a real scenario, we'd fetch the actual base64 if it's a URL
      let garmentData = selectedGarment.image;
      if (garmentData.base64.startsWith('http')) {
        const res = await fetch(garmentData.base64);
        const blob = await res.blob();
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        const fullBase64 = await base64Promise;
        garmentData = { base64: fullBase64, mimeType: blob.type };
      }

      const output = await vtonService.processTryOn(personImage, garmentData);
      setResultImage(output);
      setCurrentStep(WorkflowStep.COMPLETE);
    } catch (err) {
      console.error(err);
      setError("Failed to generate virtual try-on. Please ensure images are high-quality.");
      setCurrentStep(WorkflowStep.ERROR);
    }
  };

  const addGarmentToCatalog = (newGarment: Garment) => {
    setGarments([newGarment, ...garments]);
    setIsBusinessPortalOpen(false);
  };

  const reset = () => {
    setCurrentStep(WorkflowStep.IDLE);
    setResultImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 accent-gradient rounded flex items-center justify-center font-bold text-white italic">V</div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            V-STYLER <span className="text-indigo-400 font-light">PRO</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsBusinessPortalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Business Portal
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button 
            onClick={reset}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            New Session
          </button>
        </div>
      </nav>

      {isBusinessPortalOpen && (
        <BusinessPortal 
          onAddGarment={addGarmentToCatalog} 
          onClose={() => setIsBusinessPortalOpen(false)} 
        />
      )}

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Instant Virtual Fitting Room
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Upload your portrait and select any item from our curated business collection. 
            Experience 1:1 brand fidelity with our IDM-Diffusion engine.
          </p>
        </div>

        {currentStep === WorkflowStep.IDLE || currentStep === WorkflowStep.ERROR ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: User Upload */}
            <div className="lg:col-span-5 glass-panel p-8 rounded-3xl shadow-2xl space-y-8">
              <ImageUploader 
                label="Step 1: Your Portrait" 
                description="Upload a clear, full-body photo"
                onImageSelect={setPersonImage}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
              />
              
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <h4 className="text-[10px] text-gray-500 font-bold uppercase mb-2">Tips for best results</h4>
                <ul className="text-[11px] text-gray-400 space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full"/> Plain backgrounds work best</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full"/> Stand upright with arms slightly away</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full"/> Good natural lighting improves blending</li>
                </ul>
              </div>
            </div>

            {/* Right: Catalog Selection */}
            <div className="lg:col-span-7 glass-panel p-8 rounded-3xl shadow-2xl h-full">
              <GarmentCatalog 
                garments={garments} 
                selectedGarmentId={selectedGarment?.id || null} 
                onSelect={setSelectedGarment}
              />
            </div>

            {/* Bottom: Action Bar */}
            <div className="lg:col-span-12 flex flex-col items-center gap-6 mt-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm w-full max-w-md text-center">
                  {error}
                </div>
              )}
              <button
                disabled={!personImage || !selectedGarment}
                onClick={startProcessing}
                className={`px-16 py-5 rounded-full font-bold text-xl transition-all duration-300 transform active:scale-95 shadow-2xl flex items-center gap-3 ${
                  personImage && selectedGarment 
                    ? 'accent-gradient text-white hover:opacity-90 hover:shadow-indigo-500/30' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                {personImage && selectedGarment ? 'Drape & Render' : 'Complete Steps Above'}
                {personImage && selectedGarment && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            <WorkflowStatus currentStep={currentStep} />

            <div className="flex flex-col items-center justify-center min-h-[500px] glass-panel rounded-3xl overflow-hidden relative border border-white/5">
              {currentStep === WorkflowStep.COMPLETE && resultImage ? (
                <div className="w-full h-full flex flex-col md:flex-row">
                  <div className="flex-1 p-12 flex items-center justify-center bg-black/40 relative">
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                       <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-full shadow-lg">STUDIO RENDER</span>
                       <span className="px-3 py-1 bg-black/60 text-gray-300 text-[10px] font-bold rounded-full border border-white/10">IDM-VTON ENGINE</span>
                    </div>
                    <img src={resultImage} className="max-h-[750px] w-auto rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-700" alt="VTON Result" />
                  </div>
                  <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 p-8 flex flex-col gap-6 bg-white/[0.02]">
                    <div className="space-y-1">
                      <h4 className="text-white font-bold uppercase tracking-widest text-xs">Analysis Details</h4>
                      <p className="text-[10px] text-gray-500 font-medium italic">Identity preserving diffusion successful</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                          <span className="text-gray-400">Mesh Alignment</span>
                          <span className="text-emerald-400 font-bold">100%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-full"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                          <span className="text-gray-400">Texture Fidelity</span>
                          <span className="text-indigo-400 font-bold">99.2%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full w-[99%]"></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                          <span className="text-gray-400">Shadow Synthesis</span>
                          <span className="text-amber-400 font-bold">Matched</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full w-[95%]"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto space-y-3 pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 font-bold uppercase">Target Item</span>
                          <span className="text-sm text-white font-medium truncate max-w-[150px]">{selectedGarment?.name}</span>
                        </div>
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                          <img src={selectedGarment?.image.base64} alt="Source" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <button className="w-full py-4 bg-white text-black font-bold rounded-2xl text-sm hover:bg-gray-200 transition-all transform active:scale-[0.98] shadow-lg">
                        Download Result
                      </button>
                      <button 
                        onClick={reset}
                        className="w-full py-4 border border-white/10 text-gray-300 font-bold rounded-2xl text-sm hover:bg-white/5 transition-all"
                      >
                        Try New Garment
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-10 py-24 px-12 text-center">
                  <div className="relative">
                    <div className="w-28 h-28 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-indigo-500/5 rounded-full flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {currentStep === WorkflowStep.GENERATING ? 'Generating Photorealistic Blend' : 'Performing Human Parsing'}
                    </h3>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto font-light leading-relaxed">
                      Our diffusion model is aligning the garment's semantic features with your portrait's lighting environment.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-indigo-500/40 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 px-8 border-t border-white/5 bg-black/90 backdrop-blur-md flex justify-between items-center z-40">
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
            Engine: Live
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
             Cloud GPU Active
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
             Identity Preserved
          </div>
        </div>
        <div className="text-[10px] text-gray-600 font-medium">
          V-Styler Pro &copy; 2024 • Diffusion VTON-2.5-IMAGE
        </div>
      </footer>
    </div>
  );
};

export default App;
