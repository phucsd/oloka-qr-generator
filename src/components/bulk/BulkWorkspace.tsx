import React, { useState } from 'react';
import { BulkItem, QRDesignConfig } from '../../types';
import { ExcelWorkbookInfo, parseExcelOrCsvFile } from '../../services/excelService';
import {
  BatchExportFormat,
  BatchProgress as IBatchProgress,
  BatchResult,
  cancelBatchProcessing,
  processBatchQR,
} from '../../services/batchService';
import { generateQRPdf } from '../../services/pdfService';
import { BulkStep, BulkStepper } from './BulkStepper';
import { DataStep } from './DataStep';
import { MappingStep } from './MappingStep';
import { DesignStep } from './DesignStep';
import { GenerateStep } from './GenerateStep';
import { BulkProgress } from './BulkProgress';
import { ResultsStep } from './ResultsStep';

interface BulkWorkspaceProps {
  designConfig: QRDesignConfig;
  onDesignConfigChange: (newConfig: QRDesignConfig) => void;
}

export const BulkWorkspace: React.FC<BulkWorkspaceProps> = ({
  designConfig,
  onDesignConfigChange,
}) => {
  // Step state
  const [currentStep, setCurrentStep] = useState<BulkStep>('data');
  const [maxStepReached, setMaxStepReached] = useState<number>(1);

  // Data state
  const [dataSourceType, setDataSourceType] = useState<'file' | 'text'>('file');
  const [workbookInfo, setWorkbookInfo] = useState<ExcelWorkbookInfo | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [rawTextLines, setRawTextLines] = useState<string>('');

  // Mapping state
  const [contentCol, setContentCol] = useState<string>('');
  const [filenameCol, setFilenameCol] = useState<string>('');
  const [labelCol, setLabelCol] = useState<string>('');

  // Prepared items for generation
  const [preparedItems, setPreparedItems] = useState<BulkItem[]>([]);

  // Generation & progress state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<IBatchProgress>({
    current: 0,
    total: 0,
    percentage: 0,
    currentFilename: '',
    passedCount: 0,
    repairedCount: 0,
    failedCount: 0,
  });

  // Results state
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const [pdfPresetToExport, setPdfPresetToExport] = useState<string>('a4-18');

  // Handle file loaded
  const handleWorkbookLoaded = (info: ExcelWorkbookInfo, file: File) => {
    setWorkbookInfo(info);
    setUploadedFile(file);
    if (info.headers.length > 0) {
      setContentCol(info.headers[0]);
      if (info.headers.length > 1) setFilenameCol(info.headers[1]);
      if (info.headers.length > 2) setLabelCol(info.headers[2]);
    }
  };

  const handleSheetChange = async (sheetName: string) => {
    if (!uploadedFile) return;
    try {
      const info = await parseExcelOrCsvFile(uploadedFile, sheetName);
      setWorkbookInfo(info);
      if (info.headers.length > 0) {
        setContentCol(info.headers[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const goToStep = (step: BulkStep) => {
    setCurrentStep(step);
    const stepIndexes: Record<BulkStep, number> = {
      data: 1,
      mapping: 2,
      design: 3,
      generate: 4,
      results: 5,
    };
    setMaxStepReached((prev) => Math.max(prev, stepIndexes[step]));
  };

  // Start generation job
  const handleStartGenerate = async (
    format: BatchExportFormat,
    validateWithZXing: boolean,
    generatePdf: boolean,
    pdfPresetId: string
  ) => {
    setIsProcessing(true);
    setPdfPresetToExport(pdfPresetId);
    setProgress({
      current: 0,
      total: preparedItems.length,
      percentage: 0,
      currentFilename: '',
      passedCount: 0,
      repairedCount: 0,
      failedCount: 0,
    });

    try {
      const result = await processBatchQR(
        preparedItems,
        designConfig,
        format,
        validateWithZXing,
        (p) => setProgress(p)
      );

      // If PDF toggle was checked, generate PDF as well
      if (generatePdf) {
        const passedItems = result.reportItems.filter(
          (it) => it.status === 'passed' || it.status === 'repaired'
        );
        if (passedItems.length > 0) {
          try {
            await generateQRPdf(passedItems, designConfig, pdfPresetId);
          } catch (pdfErr) {
            console.warn('PDF export error:', pdfErr);
          }
        }
      }

      setBatchResult(result);
      setIsProcessing(false);
      goToStep('results');
    } catch (err: any) {
      setIsProcessing(false);
      alert('Quá trình tạo mã QR bị dừng: ' + (err?.message || 'Lỗi không xác định'));
    }
  };

  // Retry failed items
  const handleRetryFailed = () => {
    if (!batchResult) return;
    const failedList = batchResult.reportItems.filter(
      (it) => it.status === 'failed' || it.status === 'mismatch'
    );
    if (failedList.length === 0) return;

    // Reset status to pending
    const retryItems: BulkItem[] = failedList.map((it) => ({
      ...it,
      status: 'pending',
      errorMessage: undefined,
    }));

    setPreparedItems(retryItems);
    // Bump ECC and margin to safe mode for retry
    onDesignConfigChange({
      ...designConfig,
      errorCorrectionLevel: 'H',
      margin: Math.max(designConfig.margin, 16),
      logoSize: designConfig.logoUrl ? Math.min(designConfig.logoSize, 0.20) : designConfig.logoSize,
    });
    goToStep('generate');
  };

  const handleExportPdfFromResults = async () => {
    if (!batchResult) return;
    const passedItems = batchResult.reportItems.filter(
      (it) => it.status === 'passed' || it.status === 'repaired'
    );
    if (passedItems.length === 0) {
      alert('Không có mã QR hợp lệ nào để in tem');
      return;
    }
    await generateQRPdf(passedItems, designConfig, pdfPresetToExport);
  };

  const handleStartNewBatch = () => {
    setWorkbookInfo(null);
    setUploadedFile(null);
    setRawTextLines('');
    setPreparedItems([]);
    setBatchResult(null);
    goToStep('data');
  };

  return (
    <div className="space-y-6">
      {/* Top Wizard Stepper */}
      <BulkStepper
        currentStep={currentStep}
        onStepClick={goToStep}
        maxStepReached={maxStepReached}
      />

      {/* Processing Progress View */}
      {isProcessing ? (
        <BulkProgress progress={progress} onCancel={cancelBatchProcessing} />
      ) : (
        <>
          {/* Step 1: Data */}
          {currentStep === 'data' && (
            <DataStep
              dataSourceType={dataSourceType}
              setDataSourceType={setDataSourceType}
              workbookInfo={workbookInfo}
              uploadedFile={uploadedFile}
              onWorkbookLoaded={handleWorkbookLoaded}
              onSheetChange={handleSheetChange}
              rawTextLines={rawTextLines}
              onTextLinesChange={setRawTextLines}
              onContinue={() => goToStep('mapping')}
            />
          )}

          {/* Step 2: Mapping */}
          {currentStep === 'mapping' && (
            <MappingStep
              dataSourceType={dataSourceType}
              workbookInfo={workbookInfo}
              rawTextLines={rawTextLines}
              contentCol={contentCol}
              setContentCol={setContentCol}
              filenameCol={filenameCol}
              setFilenameCol={setFilenameCol}
              labelCol={labelCol}
              setLabelCol={setLabelCol}
              onBack={() => goToStep('data')}
              onContinue={(items) => {
                setPreparedItems(items);
                goToStep('design');
              }}
            />
          )}

          {/* Step 3: Design */}
          {currentStep === 'design' && (
            <DesignStep
              items={preparedItems}
              config={designConfig}
              onChangeConfig={onDesignConfigChange}
              onBack={() => goToStep('mapping')}
              onContinue={() => goToStep('generate')}
            />
          )}

          {/* Step 4: Generate */}
          {currentStep === 'generate' && (
            <GenerateStep
              items={preparedItems}
              config={designConfig}
              onBack={() => goToStep('design')}
              onStartGenerate={handleStartGenerate}
            />
          )}

          {/* Step 5: Results */}
          {currentStep === 'results' && batchResult && (
            <ResultsStep
              result={batchResult}
              onRetryFailed={handleRetryFailed}
              onExportPdf={handleExportPdfFromResults}
              onStartNewBatch={handleStartNewBatch}
            />
          )}
        </>
      )}
    </div>
  );
};
