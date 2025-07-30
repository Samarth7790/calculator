import React from 'react';
import { HistoryEntry } from '../types/calculator';
import { Trash2, Download, FileText } from 'lucide-react';
import { exportHistoryAsCSV, exportHistoryAsPDF } from '../utils/exportUtils';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClearHistory: () => void;
  onSelectEntry: (entry: HistoryEntry) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  history, 
  onClearHistory, 
  onSelectEntry 
}) => {
  return (
    <div className="history-panel bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 max-h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium opacity-70">History</h3>
        <div className="flex space-x-1">
          <button
            onClick={() => exportHistoryAsCSV(history)}
            className="p-1 rounded hover:bg-white/10 opacity-60 hover:opacity-100"
            title="Export as CSV"
            disabled={history.length === 0}
          >
            <Download className="w-3 h-3" />
          </button>
          <button
            onClick={() => exportHistoryAsPDF(history)}
            className="p-1 rounded hover:bg-white/10 opacity-60 hover:opacity-100"
            title="Export as PDF"
            disabled={history.length === 0}
          >
            <FileText className="w-3 h-3" />
          </button>
          <button
            onClick={onClearHistory}
            className="p-1 rounded hover:bg-white/10 opacity-60 hover:opacity-100"
            title="Clear History"
            disabled={history.length === 0}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      {/* History List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {history.length === 0 ? (
          <div className="text-xs opacity-50 text-center py-4">
            No calculations yet
          </div>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className="history-entry p-2 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors text-xs"
            >
              <div className="font-mono opacity-70 mb-1 truncate">
                {entry.expression}
              </div>
              <div className="font-mono font-medium truncate">
                = {entry.result}
              </div>
              <div className="opacity-50 text-xs mt-1">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};