import React, { useState, useRef } from 'react';
import { Upload, Camera, FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Image as ImageIcon, HelpCircle, Edit3 } from 'lucide-react';
import { SAMPLE_DOCUMENTS, SampleDocumentItem } from '../data/sampleDocuments';

interface UploadBoxProps {
  onAnalyze: (payload: {
    image?: string;
    textContext?: string;
    fileName: string;
    simplificationLevel: string;
    userQuestion?: string;
  }) => void;
  isLoading: boolean;
  selectedLanguage: string;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
  onAnalyze,
  isLoading,
  selectedLanguage,
}) => {
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    previewUrl: string;
    rawBase64?: string;
    textContext?: string;
  } | null>(null);
  const [manualText, setManualText] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [simplificationLevel, setSimplificationLevel] = useState<'simple' | 'very_simple_esl' | 'structured_bullets'>('simple');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedFile({
        name: file.name,
        previewUrl: result,
        rawBase64: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleDocumentItem) => {
    setSelectedFile({
      name: sample.title,
      previewUrl: sample.imageUrl,
      rawBase64: sample.imageUrl,
      textContext: sample.textContext,
    });
    setManualText(sample.textContext);
  };

  // Camera integration for taking a photo of a physical letter or sign
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setIsCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        }, 100);
      } catch (err) {
        alert('Could not access camera. Please check camera permissions or upload an image.');
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedFile({
        name: `Camera-Capture-${new Date().toLocaleTimeString()}.jpg`,
        previewUrl: dataUrl,
        rawBase64: dataUrl,
      });
      // Stop camera
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    }
  };

  const handleStartAnalysis = () => {
    const textToSend = manualText.trim() || selectedFile?.textContext;
    if (!selectedFile && !textToSend) return;

    onAnalyze({
      image: selectedFile?.rawBase64,
      textContext: textToSend,
      fileName: selectedFile?.name || (manualText ? 'Pasted Notice Text' : 'Uploaded Document'),
      simplificationLevel,
      userQuestion: userQuestion.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Mode Selector Tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex bg-slate-200/80 dark:bg-slate-800 p-1 rounded-2xl border border-slate-300 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setInputMode('file')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              inputMode === 'file'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Image or Camera</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              inputMode === 'text'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Paste / Type Document Text</span>
          </button>
        </div>
      </div>

      {/* Mode 1: File Upload / Camera */}
      {inputMode === 'file' ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/50 ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          tabIndex={0}
          role="region"
          aria-label="Upload document or image area"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Choose file to upload"
          />

          {/* Live Camera View if Active */}
          {isCameraActive ? (
            <div className="max-w-md mx-auto space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-4/3 shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  LIVE CAMERA
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg"
                >
                  <Camera className="w-5 h-5" /> Take Snapshot
                </button>
                <button
                  type="button"
                  onClick={toggleCamera}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedFile ? (
            /* Selected File Preview Box */
            <div className="max-w-lg mx-auto bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-left flex items-start gap-4">
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shrink-0 flex items-center justify-center">
                {selectedFile.previewUrl.startsWith('data:image') ? (
                  <img
                    src={selectedFile.previewUrl}
                    alt="Document thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText className="w-8 h-8 text-indigo-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Ready for Copilot
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate text-base mt-0.5">
                  {selectedFile.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Multimodal visual analysis powered by Gemma 4 / Gemini
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Change File
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Default Upload Placeholder */
            <div className="space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Upload or Snap Any Difficult Document
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Drag & drop notices, bills, medical forms, prescriptions, public signs, or food menus
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" /> Choose Image / PDF
                </button>
                <button
                  type="button"
                  onClick={toggleCamera}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Use Camera
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Direct Text Input / Paste */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Paste Notice, Letter, or Form Text Here:
            </label>
            <span className="text-xs text-slate-500 font-mono">{manualText.length} characters</span>
          </div>
          <textarea
            rows={6}
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Paste text from an email, landlord notice, citation, medical portal, or document here..."
            className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
          />
        </div>
      )}

      {/* Optional User Question Callout */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Have a specific question about this document? (Optional)</span>
        </label>
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          placeholder="e.g. When is the final move-out deadline? How much do I owe? Do I need to fast before my visit?"
          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Simplification & Explanation Level Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
        <label className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
          Reading & Cognitive Simplification Level
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'simple',
              title: 'Plain English',
              desc: 'Conversational, no jargon, 4th–5th grade readability',
            },
            {
              id: 'very_simple_esl',
              title: 'ESL / Maximum Clarity',
              desc: 'Shortest words, direct sentences, helpful definitions',
            },
            {
              id: 'structured_bullets',
              title: 'Step-by-Step Bullets',
              desc: 'High structure, minimal text, immediate action focus',
            },
          ].map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setSimplificationLevel(lvl.id as any)}
              className={`text-left p-3.5 rounded-xl border-2 transition-all ${
                simplificationLevel === lvl.id
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-bold text-sm">{lvl.title}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{lvl.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Translating into: <strong className="text-slate-800 dark:text-slate-200">{selectedLanguage}</strong></span>
        </div>

        <button
          type="button"
          onClick={handleStartAnalysis}
          disabled={isLoading || (!selectedFile && !manualText.trim())}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-3 ${
            isLoading || (!selectedFile && !manualText.trim())
              ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white hover:shadow-indigo-500/25'
          }`}
          aria-label="Analyze document and extract copilot actions"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Document with Gemma 4...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze & Generate Actions</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Or Try Sample Documents for Instant Demonstration */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            Or Try a Real-World Sample Document:
          </h4>
          <span className="text-xs text-slate-500">Instant Demo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{sample.category}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {sample.badge}
                </span>
              </div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {sample.title}
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {sample.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
