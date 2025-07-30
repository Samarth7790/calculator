import { HistoryEntry } from '../types/calculator';

export const exportHistoryAsCSV = (history: HistoryEntry[]): void => {
  const headers = ['Expression', 'Result', 'Date', 'Time'];
  const csvContent = [
    headers.join(','),
    ...history.map(entry => {
      const date = new Date(entry.timestamp);
      return [
        `"${entry.expression}"`,
        `"${entry.result}"`,
        date.toLocaleDateString(),
        date.toLocaleTimeString()
      ].join(',');
    })
  ].join('\n');

  downloadFile(csvContent, 'calculator-history.csv', 'text/csv');
};

export const exportHistoryAsPDF = (history: HistoryEntry[]): void => {
  // For a production app, you would use a PDF library like jsPDF
  // Here we'll create a simple HTML version that can be printed to PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Calculator History</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .expression { font-family: monospace; }
        .result { font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Calculator History</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <table>
        <thead>
          <tr>
            <th>Expression</th>
            <th>Result</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          ${history.map(entry => {
            const date = new Date(entry.timestamp);
            return `
              <tr>
                <td class="expression">${entry.expression}</td>
                <td class="result">${entry.result}</td>
                <td>${date.toLocaleDateString()}</td>
                <td>${date.toLocaleTimeString()}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const downloadFile = (content: string, filename: string, contentType: string): void => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  // Clean up
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};