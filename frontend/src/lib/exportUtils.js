/**
 * Export Utilities for CSV and PDF
 * Provides functions to export data in multiple formats
 */

// CSV Export Function
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get all unique keys from data
  const keys = Array.from(
    new Set(
      data.flatMap((item) =>
        Object.keys(item).filter((key) => typeof item[key] !== 'object')
      )
    )
  );

  // Create CSV header
  const csvHeader = keys.map((key) => `"${key}"`).join(',');

  // Create CSV rows
  const csvRows = data.map((item) =>
    keys
      .map((key) => {
        const value = item[key];
        if (value === null || value === undefined) return '""';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return `"${value}"`;
      })
      .join(',')
  );

  // Combine header and rows
  const csvContent = [csvHeader, ...csvRows].join('\n');

  // Create blob and download
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

// JSON Export Function
export const exportToJSON = (data, filename = 'export.json') => {
  if (!data) {
    console.warn('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
};

// Excel-style export (CSV with proper formatting)
export const exportToExcel = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create workbook content in CSV format (Excel-compatible)
  const keys = Array.from(
    new Set(
      data.flatMap((item) =>
        Object.keys(item).filter((key) => typeof item[key] !== 'object')
      )
    )
  );

  // Header with BOM for UTF-8 Excel compatibility
  let csvContent = '\uFEFF'; // UTF-8 BOM
  csvContent += keys.map((key) => `"${key}"`).join(',') + '\n';

  // Data rows
  csvContent += data
    .map((item) =>
      keys
        .map((key) => {
          const value = item[key];
          if (value === null || value === undefined) return '""';
          // Format numbers without quotes for Excel
          if (typeof value === 'number') return value;
          // Format dates
          if (value instanceof Date) return `"${value.toLocaleDateString()}"`;
          // Format strings
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',')
    )
    .join('\n');

  downloadFile(csvContent, filename || 'export.xlsx', 'application/vnd.ms-excel;charset=utf-8;');
};

// PDF Export Function (simple text-based)
export const exportToPDF = (data, filename = 'export.pdf', options = {}) => {
  // Note: This creates a simple text PDF. For more complex PDFs, use a library like jsPDF or pdfkit
  const { title = 'Report', columns = [], format = 'report' } = options;

  let content = `${title}\nGenerated on: ${new Date().toLocaleString()}\n\n`;

  if (format === 'report' && typeof data === 'string') {
    content += data;
  } else if (Array.isArray(data)) {
    // Table format
    if (columns.length === 0) {
      // Auto-detect columns
      columns.push(
        ...Array.from(
          new Set(
            data.flatMap((item) =>
              Object.keys(item).filter((key) => typeof item[key] !== 'object')
            )
          )
        )
      );
    }

    // Column headers
    content += columns.map((col) => col.padEnd(20)).join('|') + '\n';
    content += columns.map(() => '-'.repeat(20)).join('+') + '\n';

    // Data rows
    data.forEach((item) => {
      content += columns
        .map((col) => {
          const value = item[col] || '';
          return String(value).substring(0, 20).padEnd(20);
        })
        .join('|') + '\n';
    });
  }

  // Create a simple text file as PDF placeholder
  // In production, use a proper PDF library like jsPDF, pdfkit, or iText
  downloadFile(content, filename, 'text/plain;charset=utf-8;');
};

// Advanced PDF export with formatting (requires external library)
export const exportToPDFAdvanced = (
  data,
  filename = 'export.pdf',
  options = {}
) => {
  // This would require jsPDF library
  // For now, we'll export as PDF-like format
  console.log('Advanced PDF export requires jsPDF library');
  exportToPDF(data, filename, options);
};

// Generic file download helper
const downloadFile = (content, filename, mimeType) => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
};

// Export report with filters
export const exportFilteredReport = (
  data,
  filters = {},
  filename = 'report',
  format = 'csv'
) => {
  let filtered = data;

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      filtered = filtered.filter((item) => {
        if (typeof value === 'string') {
          return String(item[key]).toLowerCase().includes(value.toLowerCase());
        }
        return item[key] === value;
      });
    }
  });

  // Export based on format
  const timestamp = new Date().toISOString().split('T')[0];
  const exportFilename = `${filename}_${timestamp}.${format}`;

  switch (format.toLowerCase()) {
    case 'csv':
      exportToCSV(filtered, exportFilename);
      break;
    case 'json':
      exportToJSON(filtered, exportFilename);
      break;
    case 'xlsx':
    case 'excel':
      exportToExcel(filtered, exportFilename);
      break;
    case 'pdf':
      exportToPDF(filtered, exportFilename, { title: filename });
      break;
    default:
      exportToCSV(filtered, exportFilename);
  }
};

// Batch export multiple data sources
export const exportBatchReport = (
  sections = [],
  filename = 'batch_report',
  format = 'csv'
) => {
  // Flatten all sections into a single array
  const allData = sections.reduce((acc, section) => {
    return [
      ...acc,
      { _section: section.title, _data: '' },
      ...section.data,
    ];
  }, []);

  const timestamp = new Date().toISOString().split('T')[0];
  const exportFilename = `${filename}_${timestamp}.${format}`;

  if (format.toLowerCase() === 'csv') {
    exportToCSV(allData, exportFilename);
  } else if (format.toLowerCase() === 'json') {
    // For JSON, maintain structure
    const json = sections.reduce((acc, section) => {
      return { ...acc, [section.title]: section.data };
    }, {});
    exportToJSON(json, exportFilename);
  }
};

// Generate summary report
export const generateSummaryReport = (data, summaryFields = []) => {
  const summary = {
    exportDate: new Date().toLocaleString(),
    totalRecords: data.length,
    fields: summaryFields,
  };

  if (summaryFields.length > 0) {
    summaryFields.forEach((field) => {
      const values = data.map((item) => item[field]).filter((v) => v);
      if (values.length > 0 && !isNaN(values[0])) {
        summary[field] = {
          total: values.reduce((a, b) => a + b, 0),
          average: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
          min: Math.min(...values),
          max: Math.max(...values),
        };
      }
    });
  }

  return summary;
};

export default {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  exportToPDF,
  exportToPDFAdvanced,
  exportFilteredReport,
  exportBatchReport,
  generateSummaryReport,
};
