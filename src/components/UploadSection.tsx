import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, Copy, Download, AlertCircle } from 'lucide-react';
import { LanguageBadge } from './LanguageBadge';
import { LanguageSelector } from './LanguageSelector';
import { UsageCounter } from './UsageCounter';
import { createWorker } from 'tesseract.js';
import { useAuth } from '../contexts/AuthContext';
import { useUserPlan } from '../hooks/useUserPlan';
import { DatabaseService } from '../lib/database';
import { toast } from 'react-hot-toast';

export const UploadSection: React.FC = () => {
  const { user } = useAuth();
  const { planType, subscription } = useUserPlan();
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [language, setLanguage] = useState<string>('pt');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar uso diário quando componente monta
  React.useEffect(() => {
    const loadDailyUsage = async () => {
      if (!user) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        const usage = await DatabaseService.getDailyUsage(user.id, today);
        setDailyUsage(usage);

        // Definir limite baseado no plano
        if (subscription?.plan) {
          setDailyLimit(subscription.plan.daily_limit);
        } else {
          // Buscar limite do plano gratuito
          const plans = await DatabaseService.getActivePlans();
          const freePlan = plans.find(plan => plan.price === 0);
          setDailyLimit(freePlan?.daily_limit || 3);
        }
      } catch (error) {
        console.error('Erro ao carregar uso diário:', error);
      }
    };

    loadDailyUsage();
  }, [user, subscription]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError('O arquivo é muito grande. O limite é 10MB.');
      return;
    }
    setFile(selectedFile);
    setExtractedText('');
    setError(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const extractText = async () => {
    if (!file || !user) return;
    
    try {
      // Verificar limite diário
      const hasReachedLimit = await DatabaseService.hasReachedDailyLimit(user.id);
      if (hasReachedLimit) {
        setError('Você atingiu o limite diário de extrações. Faça upgrade para o plano Premium para extrações ilimitadas.');
        return;
      }

      // Verificar se pode usar o idioma
      const canUseLanguage = await DatabaseService.canUserUseLanguage(user.id, language);
      if (!canUseLanguage) {
        setError('Este idioma está disponível apenas no plano Premium.');
        return;
      }

      setIsExtracting(true);
      setError(null);
      
      const worker = await createWorker(language);
      const { data: { text } } = await worker.recognize(file);
      
      setExtractedText(text);
      
      // Buscar ID do idioma e incrementar uso
      const languageData = await DatabaseService.getLanguageByCode(language);
      if (languageData) {
        await DatabaseService.incrementUsage(user.id, languageData.id);
        
        // Atualizar contador local
        setDailyUsage(prev => prev + 1);
        toast.success('Texto extraído com sucesso!');
      }
      
      await worker.terminate();
    } catch (err) {
      setError('Ocorreu um erro ao processar a imagem. Tente novamente.');
      console.error(err);
      toast.error('Erro ao extrair texto');
    } finally {
      setIsExtracting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Texto copiado!');
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([extractedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'texto-extraido.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Arquivo baixado!');
  };

  const hasReachedLimit = dailyUsage >= dailyLimit && planType === 'free';

  return (
    <section id="upload" className="py-16 px-6 md:px-10 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
          
          <UsageCounter 
            current={dailyUsage} 
            limit={dailyLimit}
            planType={planType}
          />
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Selecione o Idioma</h2>
            <LanguageSelector
              selectedLanguage={language}
              onLanguageChange={setLanguage}
              planType={planType}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Envie sua imagem ou PDF</h2>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                file ? 'border-green-500 bg-green-50' : 'border-blue-300 hover:border-blue-500 bg-blue-50'
              }`}
              onClick={handleUploadClick}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />
              
              {!file ? (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-blue-500 mb-4" />
                  <p className="text-gray-700 font-medium mb-2">Clique para enviar ou arraste aqui</p>
                  <p className="text-sm text-gray-500">JPG, PNG ou PDF (máx. 10MB)</p>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-500 mr-2" />
                  <p className="text-gray-700 font-medium">{file.name}</p>
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </p>
              </div>
            )}
          </div>
          
          {file && !extractedText && (
            <div className="flex justify-center mb-8">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center disabled:opacity-70"
                onClick={extractText}
                disabled={isExtracting || hasReachedLimit || !user}
              >
                {isExtracting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    <span>Extraindo...</span>
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    <span>Extrair Texto</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          {extractedText && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">Resultado</h3>
                <LanguageBadge language={language as 'pt' | 'en' | 'es'} />
              </div>
              
              <div className="relative">
                <textarea
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={extractedText}
                  readOnly
                />
                
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button 
                    className="bg-white text-gray-700 p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    onClick={copyToClipboard}
                    title="Copiar texto"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                  
                  <button 
                    className="bg-white text-gray-700 p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    onClick={downloadText}
                    title="Baixar como .txt"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {hasReachedLimit && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-amber-800 font-medium">Você atingiu o limite diário do plano gratuito</p>
                <p className="text-amber-700 text-sm mt-1">O limite será resetado à meia-noite do seu horário local. Faça upgrade para o plano Premium para extrações ilimitadas.</p>
                <a 
                  href="#precos"
                  className="mt-3 inline-block bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
                >
                  Upgrade para Premium
                </a>
              </div>
            </div>
          )}

          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-blue-800 font-medium">Faça login para usar o serviço</p>
                <p className="text-blue-700 text-sm mt-1">Crie uma conta gratuita para começar a extrair texto de imagens.</p>
                <a 
                  href="/signup"
                  className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Criar Conta Grátis
                </a>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-10">Por que escolher o ExtraiTexto?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Rápido e Preciso</h3>
              <p className="text-gray-600">Resultados em segundos com alta precisão, mesmo em imagens com baixa qualidade.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="bg-green-100 text-green-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Suporte a Idiomas</h3>
              <p className="text-gray-600">Detecção automática para múltiplos idiomas conforme seu plano.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Comece Grátis</h3>
              <p className="text-gray-600">Plano gratuito disponível. Faça upgrade quando precisar de mais recursos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};