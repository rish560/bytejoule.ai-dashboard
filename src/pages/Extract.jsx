import React, { useState, useEffect } from 'react';
import { FileText, Upload, Wand2, Download, Eye, Settings, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker with local approach
const setupPDFWorker = () => {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    try {
      // Use local worker from public directory first
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      console.log('PDF.js worker configured with local public worker');
    } catch (error) {
      try {
        // Fallback to local worker from node_modules
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
        console.log('PDF.js worker configured with local node_modules worker');
      } catch (fallbackError) {
        try {
          // Fallback to version-specific CDN path
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
          console.log('PDF.js worker configured with unpkg CDN');
        } catch (finalError) {
          try {
            // Last resort - use jsdelivr CDN
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
            console.log('PDF.js worker configured with jsdelivr CDN');
          } catch (ultimateError) {
            console.error('Failed to configure PDF.js worker:', ultimateError);
          }
        }
      }
    }
  }
};

// Setup worker immediately
setupPDFWorker();

const Extract = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [showAutoGenerateForm, setShowAutoGenerateForm] = useState(false);
  const [showGeneratedSchema, setShowGeneratedSchema] = useState(false);
  const [generatedSchema, setGeneratedSchema] = useState(null);
  const [isGeneratingSchema, setIsGeneratingSchema] = useState(false);
  const [schemaFile, setSchemaFile] = useState(null);
  const [schemaPrompt, setSchemaPrompt] = useState('');
  
  // PDF Viewer states
  const [pdfData, setPdfData] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [loadingPdf, setLoadingPdf] = useState(false);

  // Ensure PDF.js is properly initialized
  useEffect(() => {
    setupPDFWorker();
    console.log('PDF.js worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    console.log('File upload triggered:', file);
    if (file) {
      console.log('Setting uploaded file:', file.name, file.type, file.size);
      setUploadedFile(file);
      setExtractedData(null); // Reset previous results
      
      // If it's a PDF, load it for viewing
      if (file.type === 'application/pdf') {
        console.log('Loading PDF for viewing...');
        await loadPdfForViewing(file);
      } else {
        console.log('Non-PDF file, clearing PDF viewer');
        // Clear PDF viewer for non-PDF files
        setPdfData(null);
        setPdfPages([]);
      }
    }
  };

  const loadPdfForViewing = async (file) => {
    setLoadingPdf(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      setPdfData(pdf);
      
      // Render all pages for continuous scrolling with optimized rendering
      const pages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = window.innerWidth < 768 ? 1.0 : 1.2; // Responsive scale
        const viewport = page.getViewport({ scale });
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        // Convert canvas to data URL for better performance
        const dataUrl = canvas.toDataURL('image/png', 0.8);
        
        pages.push({
          pageNumber: i,
          dataUrl: dataUrl,
          width: viewport.width,
          height: viewport.height
        });
      }
      
      setPdfPages(pages);
    } catch (error) {
      console.error('Error loading PDF for viewing:', error);
    } finally {
      setLoadingPdf(false);
    }
  };

  // Intelligent document analysis function
  const analyzeDocumentContent = (text, fileName) => {
    const lowerText = text.toLowerCase();
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Detect document type
    let documentType = 'Unknown Document';
    let extractedFields = {};
    
    // Invoice detection
    if (lowerText.includes('invoice') || lowerText.includes('bill') || lowerText.includes('amount due') || lowerText.includes('total:')) {
      documentType = 'Invoice';
      extractedFields = extractInvoiceFields(text, lines);
    }
    // Resume/CV detection
    else if (lowerText.includes('experience') || lowerText.includes('education') || lowerText.includes('skills') || lowerText.includes('resume')) {
      documentType = 'Resume/CV';
      extractedFields = extractResumeFields(text, lines);
    }
    // Contract detection
    else if (lowerText.includes('agreement') || lowerText.includes('contract') || lowerText.includes('terms and conditions')) {
      documentType = 'Contract/Agreement';
      extractedFields = extractContractFields(text, lines);
    }
    // Financial statement detection
    else if (lowerText.includes('balance sheet') || lowerText.includes('income statement') || lowerText.includes('revenue')) {
      documentType = 'Financial Document';
      extractedFields = extractFinancialFields(text, lines);
    }
    // Research paper detection
    else if (lowerText.includes('abstract') || lowerText.includes('references') || lowerText.includes('methodology')) {
      documentType = 'Research Paper';
      extractedFields = extractResearchFields(text, lines);
    }
    // Form detection
    else if (lowerText.includes('form') || text.includes('___') || lowerText.includes('signature')) {
      documentType = 'Form';
      extractedFields = extractFormFields(text, lines);
    }
    // Default analysis
    else {
      documentType = 'General Document';
      extractedFields = extractGeneralFields(text, lines);
    }
    
    return {
      type: documentType,
      fields: extractedFields
    };
  };

  // Invoice field extraction
  const extractInvoiceFields = (text, lines) => {
    const fields = {};
    
    // Extract invoice number
    const invoiceMatch = text.match(/invoice\s*#?\s*:?\s*([A-Z0-9-]+)/i);
    if (invoiceMatch) fields['Invoice Number'] = invoiceMatch[1];
    
    // Extract dates
    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
    if (dateMatch) fields['Date'] = dateMatch[1];
    
    // Extract amounts
    const amountMatches = text.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g);
    if (amountMatches) {
      const amounts = amountMatches.map(a => a.replace('$', '')).filter(a => parseFloat(a) > 0);
      if (amounts.length > 0) {
        fields['Total Amount'] = '$' + Math.max(...amounts.map(parseFloat)).toFixed(2);
      }
    }
    
    // Extract company names (usually in first few lines)
    if (lines.length > 0) fields['Company'] = lines[0].trim();
    
    fields['Document Type'] = 'Invoice';
    fields['Word Count'] = text.split(/\s+/).length;
    
    return fields;
  };

  // Resume field extraction
  const extractResumeFields = (text, lines) => {
    const fields = {};
    
    // Extract name (usually first line)
    if (lines.length > 0) fields['Candidate Name'] = lines[0].trim();
    
    // Extract email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) fields['Email'] = emailMatch[0];
    
    // Extract phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) fields['Phone'] = phoneMatch[0];
    
    // Count experience years
    const experienceMatches = text.match(/(\d+)\s*years?\s*(of\s*)?experience/i);
    if (experienceMatches) fields['Years of Experience'] = experienceMatches[1] + ' years';
    
    // Extract skills section
    const skillsSection = text.match(/skills[\s:]*([^]*?)(?=\n\s*\n|\n[A-Z]|$)/i);
    if (skillsSection) {
      const skills = skillsSection[1].split(/[,\n]/).slice(0, 5).map(s => s.trim()).filter(s => s);
      fields['Key Skills'] = skills.join(', ');
    }
    
    fields['Document Type'] = 'Resume/CV';
    fields['Word Count'] = text.split(/\s+/).length;
    
    return fields;
  };

  // Contract field extraction
  const extractContractFields = (text, lines) => {
    const fields = {};
    
    // Extract parties
    const partyMatches = text.match(/between\s+([^,\n]+)\s+and\s+([^,\n]+)/i);
    if (partyMatches) {
      fields['Party 1'] = partyMatches[1].trim();
      fields['Party 2'] = partyMatches[2].trim();
    }
    
    // Extract dates
    const dateMatch = text.match(/dated?\s+([A-Za-z]+ \d{1,2},? \d{4})/);
    if (dateMatch) fields['Contract Date'] = dateMatch[1];
    
    // Extract term duration
    const termMatch = text.match(/term of (\d+) (years?|months?)/i);
    if (termMatch) fields['Contract Term'] = termMatch[1] + ' ' + termMatch[2];
    
    fields['Document Type'] = 'Contract/Agreement';
    fields['Word Count'] = text.split(/\s+/).length;
    
    return fields;
  };

  // Financial document field extraction
  const extractFinancialFields = (text, lines) => {
    const fields = {};
    
    // Extract financial periods
    const periodMatch = text.match(/(for the (year|quarter|month) ended? [A-Za-z]+ \d{1,2},? \d{4})/i);
    if (periodMatch) fields['Period'] = periodMatch[1];
    
    // Extract revenue figures
    const revenueMatch = text.match(/revenue\s*:?\s*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);
    if (revenueMatch) fields['Revenue'] = '$' + revenueMatch[1];
    
    // Extract net income
    const incomeMatch = text.match(/net income\s*:?\s*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);
    if (incomeMatch) fields['Net Income'] = '$' + incomeMatch[1];
    
    fields['Document Type'] = 'Financial Statement';
    fields['Word Count'] = text.split(/\s+/).length;
    
    return fields;
  };

  // Research paper field extraction
  const extractResearchFields = (text, lines) => {
    const fields = {};
    
    // Extract title (usually first meaningful line)
    const titleLine = lines.find(line => line.length > 20 && !line.toLowerCase().includes('university'));
    if (titleLine) fields['Paper Title'] = titleLine.trim();
    
    // Extract authors
    const authorMatch = text.match(/authors?\s*:?\s*([^.\n]+)/i);
    if (authorMatch) fields['Authors'] = authorMatch[1].trim();
    
    // Extract abstract
    const abstractMatch = text.match(/abstract[\s:]*([^]*?)(?=\n\s*\n|\n[1-9]\.|\nintroduction)/i);
    if (abstractMatch) {
      const abstract = abstractMatch[1].trim().substring(0, 200) + '...';
      fields['Abstract Preview'] = abstract;
    }
    
    // Count references
    const refMatches = text.match(/\[\d+\]/g);
    if (refMatches) fields['Reference Count'] = refMatches.length;
    
    fields['Document Type'] = 'Research Paper';
    fields['Word Count'] = text.split(/\s+/).length;
    
    return fields;
  };

  // Form field extraction
  const extractFormFields = (text, lines) => {
    const fields = {};
    
    // Count blank fields
    const blankFields = (text.match(/_{3,}/g) || []).length;
    if (blankFields > 0) fields['Blank Fields'] = blankFields;
    
    // Extract form title
    if (lines.length > 0) fields['Form Title'] = lines[0].trim();
    
    // Look for common form elements
    if (text.toLowerCase().includes('signature')) fields['Requires Signature'] = 'Yes';
    if (text.toLowerCase().includes('date')) fields['Requires Date'] = 'Yes';
    
    fields['Document Type'] = 'Form';
    fields['Word Count'] = text.split(/\s+/).length;
    
    return fields;
  };

  // General document field extraction
  const extractGeneralFields = (text, lines) => {
    const fields = {};
    
    // Extract title
    if (lines.length > 0) fields['Document Title'] = lines[0].trim();
    
    // Extract dates
    const dateMatches = text.match(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g);
    if (dateMatches && dateMatches.length > 0) {
      fields['Dates Found'] = dateMatches.slice(0, 3).join(', ');
    }
    
    // Extract email addresses
    const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    if (emailMatches && emailMatches.length > 0) {
      fields['Email Addresses'] = emailMatches.slice(0, 2).join(', ');
    }
    
    // Extract phone numbers
    const phoneMatches = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g);
    if (phoneMatches && phoneMatches.length > 0) {
      fields['Phone Numbers'] = phoneMatches.slice(0, 2).join(', ');
    }
    
    // Text statistics
    const words = text.split(/\s+/).filter(word => word.length > 0);
    fields['Word Count'] = words.length;
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    fields['Sentence Count'] = sentences.length;
    
    // Extract key terms (most frequent meaningful words)
    const wordFreq = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 3 && !['the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but', 'his', 'from', 'they', 'she', 'her', 'been', 'than', 'its', 'are', 'was', 'were', 'will'].includes(cleanWord)) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });
    
    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
    
    if (topWords.length > 0) fields['Key Terms'] = topWords.join(', ');
    
    fields['Document Type'] = 'General Document';
    
    return fields;
  };

  const handleExtraction = async () => {
    console.log('handleExtraction called!', { uploadedFile });
    if (!uploadedFile) {
      console.log('No uploaded file found');
      return;
    }
    
    console.log('Starting extraction...');
    setIsExtracting(true);
    
    try {
      // Extract text from PDF using PDF.js
      console.log('Converting file to array buffer...');
      const arrayBuffer = await uploadedFile.arrayBuffer();
      console.log('Loading PDF document...');
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      console.log('PDF loaded successfully, pages:', pdf.numPages);
      
      let fullText = '';
      const numPages = pdf.numPages;
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        console.log(`Processing page ${pageNum}/${numPages}`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      console.log('Text extraction complete, length:', fullText.length);
      
      // Analyze the extracted text to determine document type and extract relevant information
      const extractedInfo = analyzeDocumentContent(fullText, uploadedFile.name);
      console.log('Document analysis complete:', extractedInfo);
      
      const resultData = {
        fileName: uploadedFile.name,
        fileSize: (uploadedFile.size / 1024).toFixed(1) + ' KB',
        pageCount: numPages,
        documentType: extractedInfo.type,
        extractedFields: extractedInfo.fields,
        fullText: fullText
      };
      
      console.log('Setting extracted data:', resultData);
      setExtractedData(resultData);
      
    } catch (error) {
      console.error('Error extracting PDF content:', error);
      // Fallback to basic information
      setExtractedData({
        fileName: uploadedFile.name,
        fileSize: (uploadedFile.size / 1024).toFixed(1) + ' KB',
        error: 'Could not extract text from this PDF',
        extractedFields: {
          'Status': 'Error during extraction',
          'File Type': 'PDF',
          'Upload Date': new Date().toLocaleDateString()
        }
      });
    } finally {
      console.log('Extraction process complete');
      setIsExtracting(false);
    }
  };

  const handleSchemaFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSchemaFile(file);
    }
  };

  const validatePDF = async (file) => {
    // Check file extension
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error(`File "${file.name}" is not a PDF file`);
    }
    
    // Check MIME type
    if (file.type !== 'application/pdf' && file.type !== '') {
      console.warn(`Unexpected MIME type: ${file.type}, but filename suggests PDF`);
    }
    
    // Try to read the first few bytes to check PDF signature
    const arrayBuffer = await file.slice(0, 8).arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const signature = String.fromCharCode(...uint8Array.slice(0, 4));
    
    if (signature !== '%PDF') {
      throw new Error(`File "${file.name}" does not have valid PDF signature`);
    }
    
    console.log('PDF validation passed for:', file.name);
    return true;
  };

  const fallbackPDFParsing = async (file) => {
    try {
      console.log('Attempting fallback PDF parsing...');
      
      // Simple approach: try to extract basic text patterns
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert to string and look for text patterns
      let text = '';
      for (let i = 0; i < uint8Array.length - 1; i++) {
        const char = String.fromCharCode(uint8Array[i]);
        // Only include printable ASCII characters
        if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
          text += char;
        } else if (char === '\n' || char === '\r' || char === '\t') {
          text += ' ';
        }
      }
      
      // Clean up the text - remove PDF syntax and extract readable content
      const lines = text.split(/\s+/).filter(line => {
        return line.length > 2 && 
               !line.startsWith('%') && 
               !line.includes('obj') && 
               !line.includes('endobj') && 
               !/^\d+$/.test(line) &&
               !/^[<>\/\\()]+$/.test(line);
      });
      
      const cleanText = lines.join(' ').replace(/\s+/g, ' ').trim();
      
      if (cleanText.length > 50) {
        console.log('Fallback parsing extracted text:', cleanText.substring(0, 200));
        return cleanText;
      } else {
        throw new Error('Insufficient text extracted via fallback method');
      }
      
    } catch (error) {
      console.error('Fallback PDF parsing failed:', error);
      throw error;
    }
  };

  const parsePDFContent = async (file) => {
    try {
      console.log('Starting PDF parsing for file:', file.name);
      console.log('File size:', file.size, 'bytes');
      console.log('File type:', file.type);
      
      // Validate PDF first
      await validatePDF(file);
      
      const arrayBuffer = await file.arrayBuffer();
      console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
      
      // Check if worker is available before proceeding
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        console.warn('PDF.js worker not configured, trying fallback method');
        return await fallbackPDFParsing(file);
      }
      
      console.log('Using worker:', pdfjsLib.GlobalWorkerOptions.workerSrc);
      
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0, // Reduce PDF.js console spam
        disableAutoFetch: true,
        disableStream: true
      });
      
      console.log('PDF loading task created');
      const pdf = await loadingTask.promise;
      console.log('PDF loaded successfully, pages:', pdf.numPages);
      
      let textContent = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Processing page ${i}/${pdf.numPages}`);
        try {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          textContent += pageText + '\n';
          console.log(`Page ${i} text length:`, pageText.length);
        } catch (pageError) {
          console.warn(`Failed to extract text from page ${i}:`, pageError.message);
          // Continue with other pages
        }
      }
      
      console.log('Total extracted text length:', textContent.length);
      console.log('First 200 chars:', textContent.substring(0, 200));
      
      if (textContent.trim().length === 0) {
        throw new Error('PDF appears to be empty or contains no extractable text');
      }
      
      return textContent;
    } catch (error) {
      console.error('Primary PDF parsing failed:', error);
      
      // Try fallback method
      try {
        console.log('Trying fallback PDF parsing method...');
        return await fallbackPDFParsing(file);
      } catch (fallbackError) {
        console.error('Fallback PDF parsing also failed:', fallbackError);
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        throw error; // Throw original error
      }
    }
  };

  const analyzeTextForSchema = (text, fileName) => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const words = text.toLowerCase().split(/\s+/);
    const fields = [];
    
    // Dynamic analysis: Extract key patterns and data structures from the actual content
    const dynamicAnalysis = analyzeDynamicContent(text, words, lines, fileName);
    
    // Generate schema based on actual content patterns
    fields.push(...dynamicAnalysis.fields);
    
    return fields;
  };

  const analyzeDynamicContent = (text, words, lines, fileName) => {
    const analysis = {
      fields: [],
      documentType: 'unknown',
      confidence: 0
    };

    // 1. DETECT KEY-VALUE PAIRS
    const keyValuePairs = extractKeyValuePairs(lines);
    if (keyValuePairs.length > 0) {
      analysis.fields.push({
        fieldName: "key_value_data",
        type: "object",
        description: "Key-value pairs extracted from document",
        subFields: keyValuePairs.map(kv => ({
          name: kv.key.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          type: kv.type,
          description: `${kv.key}: ${kv.example}`,
          example: kv.example
        }))
      });
    }

    // 2. DETECT STRUCTURED DATA (Tables, Lists)
    const structuredData = extractStructuredData(lines);
    if (structuredData.length > 0) {
      analysis.fields.push({
        fieldName: "structured_data",
        type: "array",
        description: "Structured data sections (tables, lists, etc.)",
        subFields: structuredData.map(section => ({
          name: section.name,
          type: section.type,
          description: section.description,
          items: section.items
        }))
      });
    }

    // 3. DETECT DATES AND TEMPORAL DATA
    const dates = extractDates(text);
    if (dates.length > 0) {
      analysis.fields.push({
        fieldName: "temporal_data",
        type: "object",
        description: "Date and time information found in document",
        subFields: [
          { name: "dates_found", type: "array", description: "All dates mentioned in the document" },
          { name: "date_ranges", type: "array", description: "Date ranges or periods mentioned" },
          { name: "temporal_context", type: "string", description: "Context around temporal references" }
        ]
      });
    }

    // 4. DETECT NUMERICAL DATA AND MEASUREMENTS
    const numericalData = extractNumericalData(text);
    if (numericalData.length > 0) {
      analysis.fields.push({
        fieldName: "numerical_data",
        type: "object",
        description: "Numbers, measurements, and quantitative data",
        subFields: numericalData.map(num => ({
          name: num.category,
          type: "number",
          description: num.description,
          unit: num.unit || "unitless"
        }))
      });
    }

    // 5. DETECT CONTACT INFORMATION
    const contactInfo = extractContactInfo(text);
    if (contactInfo.emails.length > 0 || contactInfo.phones.length > 0) {
      analysis.fields.push({
        fieldName: "contact_information",
        type: "object",
        description: "Contact details found in document",
        subFields: [
          { name: "email_addresses", type: "array", description: "Email addresses mentioned" },
          { name: "phone_numbers", type: "array", description: "Phone numbers mentioned" },
          { name: "addresses", type: "array", description: "Physical addresses mentioned" },
          { name: "urls", type: "array", description: "URLs and web addresses" }
        ]
      });
    }

    // 6. DETECT CATEGORIES AND CLASSIFICATIONS
    const categories = extractCategories(words, lines);
    if (categories.length > 0) {
      analysis.fields.push({
        fieldName: "document_categories",
        type: "object",
        description: "Categorized content sections",
        subFields: categories.map(cat => ({
          name: cat.name,
          type: "string",
          description: cat.description,
          keywords: cat.keywords
        }))
      });
    }

    // 7. DETECT NAMED ENTITIES (People, Organizations, Locations)
    const entities = extractNamedEntities(text);
    if (entities.length > 0) {
      analysis.fields.push({
        fieldName: "named_entities",
        type: "object",
        description: "People, organizations, and locations mentioned",
        subFields: [
          { name: "people", type: "array", description: "Person names mentioned" },
          { name: "organizations", type: "array", description: "Company and organization names" },
          { name: "locations", type: "array", description: "Places and locations mentioned" },
          { name: "other_entities", type: "array", description: "Other significant named entities" }
        ]
      });
    }

    // 8. FALLBACK: CONTENT SECTIONS
    if (analysis.fields.length === 0) {
      // If no specific patterns found, create generic content sections
      const contentSections = createContentSections(lines);
      analysis.fields.push(...contentSections);
    }

    return analysis;
  };

  // Helper function: Extract key-value pairs
  const extractKeyValuePairs = (lines) => {
    const pairs = [];
    const keyValuePatterns = [
      /^(.+?):\s*(.+)$/,           // "Key: Value"
      /^(.+?)\s*[-–—]\s*(.+)$/,    // "Key - Value"
      /^(.+?)\s*[=]\s*(.+)$/,      // "Key = Value"
      /^(.+?)\s*[|]\s*(.+)$/,      // "Key | Value"
    ];

    lines.forEach(line => {
      for (const pattern of keyValuePatterns) {
        const match = line.match(pattern);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          
          if (key.length > 0 && key.length < 50 && value.length > 0) {
            pairs.push({
              key: key,
              value: value,
              type: inferDataType(value),
              example: value.length > 100 ? value.substring(0, 100) + '...' : value
            });
          }
        }
      }
    });

    return pairs;
  };

  // Helper function: Extract structured data
  const extractStructuredData = (lines) => {
    const sections = [];
    let currentSection = null;

    lines.forEach((line, index) => {
      // Detect table-like structures (multiple items separated by tabs or spaces)
      const items = line.split(/\t+|\s{3,}/).filter(item => item.trim().length > 0);
      
      if (items.length > 2) {
        if (!currentSection) {
          currentSection = {
            name: `table_section_${sections.length + 1}`,
            type: "table",
            description: "Tabular data section",
            items: []
          };
        }
        currentSection.items.push(items);
      } else if (currentSection && currentSection.items.length > 0) {
        sections.push(currentSection);
        currentSection = null;
      }

      // Detect list structures
      if (/^[-•*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
        if (!currentSection || currentSection.type !== "list") {
          if (currentSection) sections.push(currentSection);
          currentSection = {
            name: `list_section_${sections.length + 1}`,
            type: "list",
            description: "List items section",
            items: []
          };
        }
        currentSection.items.push(line.replace(/^[-•*]\s+|^\d+\.\s+/, ''));
      }
    });

    if (currentSection) sections.push(currentSection);
    return sections;
  };

  // Helper function: Extract dates
  const extractDates = (text) => {
    const datePatterns = [
      /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,           // MM/DD/YYYY
      /\b\d{1,2}-\d{1,2}-\d{2,4}\b/g,             // MM-DD-YYYY
      /\b\d{4}-\d{1,2}-\d{1,2}\b/g,               // YYYY-MM-DD
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{2,4}\b/gi, // Month DD, YYYY
    ];

    const dates = [];
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) dates.push(...matches);
    });

    return [...new Set(dates)]; // Remove duplicates
  };

  // Helper function: Extract numerical data
  const extractNumericalData = (text) => {
    const numericalPatterns = [
      { pattern: /\$[\d,]+\.?\d*/g, category: "currency", description: "Monetary amounts" },
      { pattern: /\b\d+%/g, category: "percentage", description: "Percentage values", unit: "%" },
      { pattern: /\b\d+\s*(?:kg|lb|g|oz|ton)\b/gi, category: "weight", description: "Weight measurements" },
      { pattern: /\b\d+\s*(?:cm|m|km|ft|in|mile)\b/gi, category: "distance", description: "Distance measurements" },
      { pattern: /\b\d+\s*(?:hour|hr|min|sec|day|week|month|year)s?\b/gi, category: "time_duration", description: "Time durations" },
    ];

    const numbers = [];
    numericalPatterns.forEach(({ pattern, category, description, unit }) => {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        numbers.push({ category, description, unit, examples: [...new Set(matches)] });
      }
    });

    return numbers;
  };

  // Helper function: Extract contact information
  const extractContactInfo = (text) => {
    return {
      emails: [...new Set(text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [])],
      phones: [...new Set(text.match(/\b(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b/g) || [])],
      urls: [...new Set(text.match(/https?:\/\/[^\s]+/g) || [])]
    };
  };

  // Helper function: Extract categories based on content clustering
  const extractCategories = (words, lines) => {
    const categories = [];
    const wordFreq = {};
    
    // Count word frequencies
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Find most frequent meaningful words
    const significantWords = Object.entries(wordFreq)
      .filter(([word, freq]) => freq > 1 && !isStopWord(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (significantWords.length > 0) {
      categories.push({
        name: "frequent_terms",
        description: "Most frequently mentioned terms in the document",
        keywords: significantWords.map(([word, freq]) => `${word} (${freq}x)`)
      });
    }

    return categories;
  };

  // Helper function: Extract named entities (simple pattern-based)
  const extractNamedEntities = (text) => {
    const entities = [];
    
    // Simple patterns for common named entities
    const capitalized = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    const organizations = text.match(/\b[A-Z][a-z]*\s+(?:Inc|Corp|LLC|Ltd|Company|Corporation|Group|Services|Solutions)\b/g) || [];
    
    if (capitalized.length > 0 || organizations.length > 0) {
      entities.push({
        name: "extracted_entities",
        description: "Named entities found in the document",
        people: capitalized.filter(name => name.split(' ').length <= 3),
        organizations: [...new Set(organizations)],
        other: [...new Set(capitalized)]
      });
    }

    return entities;
  };

  // Helper function: Create generic content sections
  const createContentSections = (lines) => {
    return [{
      fieldName: "document_content",
      type: "object",
      description: "General document content sections",
      subFields: [
        { name: "full_text", type: "string", description: "Complete extracted text content" },
        { name: "line_count", type: "number", description: "Total number of lines" },
        { name: "word_count", type: "number", description: "Estimated word count" },
        { name: "content_sections", type: "array", description: "Document divided into logical sections" }
      ]
    }];
  };

  // Helper function: Infer data type
  const inferDataType = (value) => {
    if (/^\d+$/.test(value)) return "integer";
    if (/^\d*\.?\d+$/.test(value)) return "number";
    if (/^(true|false)$/i.test(value)) return "boolean";
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "date";
    if (/@/.test(value)) return "email";
    if (/^https?:\/\//.test(value)) return "url";
    return "string";
  };

  // Helper function: Check if word is a stop word
  const isStopWord = (word) => {
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'these', 'those', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);
    return stopWords.has(word.toLowerCase());
  };

  // Keep the old function for backward compatibility but make it call the new dynamic analysis
  const analyzeOldTextForSchema = (text, fileName) => {
    // Just call the new dynamic analysis function
    return analyzeDynamicContent(text, text.toLowerCase().split(/\s+/), text.split('\n').filter(line => line.trim().length > 0), fileName).fields;
  };

  const handleGenerateSchema = async () => {
    setIsGeneratingSchema(true);
    
    try {
      let analyzedText = '';
      let schemaFields = [];
      
      if (schemaFile) {
        if (schemaFile.type === 'application/pdf') {
          // Parse PDF content using PDF.js
          analyzedText = await parsePDFContent(schemaFile);
        } else if (schemaFile.type.startsWith('text/')) {
          // Parse text file
          analyzedText = await schemaFile.text();
        } else {
          // For other file types, use filename and prompt for analysis
          analyzedText = schemaFile.name + '\n' + (schemaPrompt || '');
        }
        
        // Generate schema based on actual content
        schemaFields = analyzeTextForSchema(analyzedText, schemaFile.name);
      } else if (schemaPrompt) {
        // Generate schema based on prompt only
        schemaFields = analyzeTextForSchema(schemaPrompt, 'prompt_based');
      }
      
      const dynamicSchema = {
        schemaName: schemaFile ? 
          schemaFile.name.replace(/\.[^/.]+$/, "") + "_extracted_schema" : 
          "prompt_based_schema",
        generatedFrom: schemaFile ? `File Analysis: ${schemaFile.name}` : "Prompt Analysis",
        sourceFile: schemaFile ? schemaFile.name : null,
        sourcePrompt: schemaPrompt || null,
        contentPreview: analyzedText.substring(0, 200) + (analyzedText.length > 200 ? '...' : ''),
        fields: schemaFields
      };
      
      setTimeout(() => {
        setGeneratedSchema(dynamicSchema);
        setShowAutoGenerateForm(false);
        setShowGeneratedSchema(true);
        setIsGeneratingSchema(false);
      }, 1500); // Reduced time since we're doing real processing
      
    } catch (error) {
      console.error('Error parsing file:', error);
      setIsGeneratingSchema(false);
      
      // Provide more specific error information
      let errorMessage = 'Unable to parse file content';
      let errorDetails = error.message || 'Unknown error';
      
      if (error.message?.includes('PDF signature')) {
        errorMessage = 'Invalid PDF file format';
        errorDetails = 'File does not appear to be a valid PDF';
      } else if (error.message?.includes('worker')) {
        errorMessage = 'PDF processing service unavailable';
        errorDetails = 'PDF.js worker failed to load';
      } else if (error.message?.includes('empty')) {
        errorMessage = 'PDF contains no text';
        errorDetails = 'This PDF may be image-based or have no extractable text';
      }
      
      // Fallback to basic schema if parsing fails
      const fallbackSchema = {
        schemaName: "fallback_schema",
        generatedFrom: `Error - ${errorMessage}`,
        sourceFile: schemaFile ? schemaFile.name : null,
        sourcePrompt: schemaPrompt || null,
        contentPreview: `${errorMessage}\n\nError Details: ${errorDetails}\n\nPlease try:\n1. Ensuring the file is a valid PDF\n2. Using a text-based PDF (not scanned images)\n3. Refreshing the page and trying again`,
        fields: [
          {
            fieldName: "error_info",
            type: "object",
            description: "Error information from failed PDF parsing",
            subFields: [
              { name: "error_type", type: "string", description: "Type of error encountered" },
              { name: "error_message", type: "string", description: "Detailed error message" },
              { name: "suggested_action", type: "string", description: "Recommended action to resolve the issue" }
            ]
          },
          {
            fieldName: "raw_content",
            type: "string",
            description: "Raw document content (fallback field)",
            subFields: []
          }
        ]
      };
      setGeneratedSchema(fallbackSchema);
      setShowAutoGenerateForm(false);
      setShowGeneratedSchema(true);
    }
  };

  const downloadResults = (format) => {
    if (!extractedData) return;
    
    let content, filename, mimeType;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(extractedData, null, 2);
        filename = 'extracted_data.json';
        mimeType = 'application/json';
        break;
      case 'csv':
        const headers = Object.keys(extractedData.extractedFields);
        const values = Object.values(extractedData.extractedFields);
        content = [headers.join(','), values.map(v => `"${v}"`).join(',')].join('\n');
        filename = 'extracted_data.csv';
        mimeType = 'text/csv';
        break;
      default:
        return;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Extract Agent</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Configure your extraction settings and upload documents for AI-powered data extraction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* First Slice - Agent Configuration (1/3 width) */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            {!showAutoGenerateForm && !showGeneratedSchema ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Agent Configuration
                </h2>

                {/* Basic Settings */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic</h3>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Extraction Mode
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div>
                          <input type="radio" name="extraction-mode" id="balanced" className="mr-3" defaultChecked />
                          <label htmlFor="balanced" className="font-medium text-gray-900 cursor-pointer">Balanced</label>
                        </div>
                        <span className="text-sm text-gray-500">10 cred. / page</span>
                      </div>
                      
                      <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="radio" name="extraction-mode" id="advanced" className="mr-3" />
                        <label htmlFor="advanced" className="font-medium text-gray-900 cursor-pointer">Advanced</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schema Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Schema</h3>
                  
                  <div className="mb-4">
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700">
                      <option>Custom</option>
                      <option>Invoice</option>
                      <option>Receipt</option>
                      <option>Contract</option>
                      <option>Resume</option>
                    </select>
                  </div>

                  <button className="w-full mb-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Create Schema
                  </button>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Upload a file or provide a natural language description to automatically generate a schema.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setShowAutoGenerateForm(true)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Auto-Generate
                      </button>
                      <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        Create Manually
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Panel */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Service Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Credits Remaining</span>
                      <span className="text-sm text-gray-800 font-medium">1,250</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="text-sm text-gray-800 font-medium">99.2%</span>
                    </div>
                  </div>
                </div>
              </>
            ) : showAutoGenerateForm && !showGeneratedSchema ? (
              /* Auto-Generate Schema Form */
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Auto-Generate Schema</h2>
                <p className="text-gray-600 mb-6">
                  You need to provide at least one option: either a file or a prompt. You can also combine both.
                </p>

                {/* File Upload Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Upload a file
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleSchemaFileUpload}
                      className="hidden"
                      id="schema-file-upload"
                      accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                    />
                    <label htmlFor="schema-file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      {schemaFile ? (
                        <div className="text-sm">
                          <p className="text-blue-600 font-medium">{schemaFile.name}</p>
                          <p className="text-gray-500">{(schemaFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          <p className="font-medium">No file chosen</p>
                          <p>Click to upload a file</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Schema Generation Prompt */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Schema Generation Prompt
                  </label>
                  <textarea
                    value={schemaPrompt}
                    onChange={(e) => setSchemaPrompt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="4"
                    placeholder="Describe the structure you want to extract (e.g., 'Extract person information including name, age, and contact details')"
                  />
                </div>

                {/* Form Footer */}
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setShowAutoGenerateForm(false);
                      setSchemaFile(null);
                      setSchemaPrompt('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={handleGenerateSchema}
                      disabled={(!schemaFile && !schemaPrompt.trim()) || isGeneratingSchema}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {isGeneratingSchema ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Generating...
                        </>
                      ) : (
                        'Generate'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        // Handle publish logic here
                        console.log('Publishing schema...');
                        setShowAutoGenerateForm(false);
                      }}
                      disabled={(!schemaFile && !schemaPrompt.trim()) || isGeneratingSchema}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Generated Schema Display */
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Generated Schema</h2>
                  <button
                    onClick={() => {
                      setShowGeneratedSchema(false);
                      setGeneratedSchema(null);
                      setSchemaFile(null);
                      setSchemaPrompt('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back to Configuration
                  </button>
                </div>

                {generatedSchema && (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {/* Schema Header */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">{generatedSchema.schemaName}</h3>
                      <p className="text-blue-700 text-sm">Generated from: {generatedSchema.generatedFrom}</p>
                      {generatedSchema.sourceFile && (
                        <p className="text-blue-600 text-sm">Source file: {generatedSchema.sourceFile}</p>
                      )}
                      {generatedSchema.sourcePrompt && (
                        <p className="text-blue-600 text-sm">Prompt: "{generatedSchema.sourcePrompt}"</p>
                      )}
                    </div>

                    {/* Content Preview */}
                    {generatedSchema.contentPreview && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Content Preview</h4>
                        <p className="text-gray-600 text-sm font-mono bg-white p-2 rounded border">
                          {generatedSchema.contentPreview}
                        </p>
                      </div>
                    )}

                    {/* Schema Fields */}
                    <div className="space-y-3">
                      {generatedSchema.fields.map((field, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{field.fieldName}</h4>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {field.type}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{field.description}</p>
                          
                          {field.subFields && field.subFields.length > 0 && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-700">Sub-fields:</h5>
                              {field.subFields.map((subField, subIndex) => (
                                <div key={subIndex} className="bg-gray-50 rounded p-3 ml-4">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-800 text-sm">{subField.name}</span>
                                    <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                                      {subField.type}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 text-xs">{subField.description}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Use This Schema
                      </button>
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Save Schema
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Edit Schema
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Second Slice - File Upload & PDF Viewer (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            {/* Show PDF Viewer if PDF is uploaded, otherwise show upload area */}
            {uploadedFile && uploadedFile.type === 'application/pdf' ? (
              /* PDF Viewer */
              <div>
                {/* File info header */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-blue-800 font-medium">{uploadedFile.name}</p>
                        <p className="text-blue-600 text-sm">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setPdfData(null);
                        setPdfPages([]);
                        setExtractedData(null);
                      }}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* PDF Content */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">PDF Preview</h3>
                    {loadingPdf && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Loading PDF...</span>
                      </div>
                    )}
                  </div>
                  
                  {pdfPages.length > 0 && (
                    <div className="border border-gray-200 rounded-lg bg-gray-100 p-4">
                      <div className="max-h-[700px] overflow-y-auto overflow-x-auto space-y-6">
                        {pdfPages.map((page, index) => (
                          <div key={index} className="bg-white shadow-md rounded-lg border">
                            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b text-sm text-gray-700 text-center font-medium">
                              Page {page.pageNumber} of {pdfPages.length}
                            </div>
                            <div className="p-4 flex justify-center bg-gray-50">
                              <img
                                src={page.dataUrl}
                                alt={`Page ${page.pageNumber}`}
                                className="max-w-full h-auto border border-gray-300 rounded shadow-sm hover:shadow-md transition-shadow"
                                style={{ 
                                  maxWidth: '100%', 
                                  height: 'auto',
                                  cursor: 'grab'
                                }}
                                draggable={false}
                                onMouseDown={(e) => e.preventDefault()}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center text-sm text-gray-600">
                        <p>📄 {pdfPages.length} page{pdfPages.length !== 1 ? 's' : ''} • Scroll to view all content</p>
                      </div>
                    </div>
                  )}
                  
                  {loadingPdf && (
                    <div className="border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">Loading PDF Preview</h4>
                          <p className="text-gray-600">Rendering pages for optimal viewing...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Upload Area */
              <>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors mb-6">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                    multiple
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Drag and drop files here, or click to select files</h3>
                    <p className="text-gray-500 mb-4">
                      Upload a single file to verify your extraction, or run a bulk extraction on multiple files asynchronously.
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports: PDF, Images (PNG, JPG), Text files, Word documents
                    </p>
                  </label>
                </div>

                {uploadedFile && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-blue-800 font-medium">{uploadedFile.name}</p>
                        <p className="text-blue-600 text-sm">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end mb-6">
              <button
                onClick={handleExtraction}
                disabled={!uploadedFile || isExtracting}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                {isExtracting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Extracting...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Run Extract
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Third Slice - Extraction Results (appears when extraction is complete) */}
          {extractedData && (
            <div className="lg:col-span-3 bg-white rounded-lg shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                  Extraction Results
                  <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {extractedData.documentType}
                  </span>
                </h3>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => downloadResults('json')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    JSON
                  </button>
                  <button
                    onClick={() => downloadResults('csv')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                  <button
                    onClick={() => setExtractedData(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Close
                  </button>
                </div>
              </div>

              {/* Document Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-1">Document Type</h4>
                  <p className="text-blue-700 text-sm">{extractedData.documentType}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-1">File Info</h4>
                  <p className="text-green-700 text-sm">{extractedData.fileName}</p>
                  <p className="text-green-600 text-xs">{extractedData.fileSize} • {extractedData.pageCount} pages</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-1">Extracted Fields</h4>
                  <p className="text-purple-700 text-sm">{Object.keys(extractedData.extractedFields).length} fields found</p>
                </div>
              </div>

              {/* Extracted Fields in LlamaCloud Style */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Extracted Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(extractedData.extractedFields).map(([key, value]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-gray-800 text-sm">{key}</h5>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">
                          {typeof value}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded p-3 font-mono text-sm text-gray-700 border">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Text Preview (if available) */}
              {extractedData.fullText && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Full Text Preview</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {extractedData.fullText.substring(0, 1000)}
                      {extractedData.fullText.length > 1000 && '...'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Extract;