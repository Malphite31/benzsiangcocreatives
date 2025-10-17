
import React from 'react';
import { XMarkIcon } from './icons/XMarkIcon';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceHtml: string | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoiceHtml }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    if (!invoiceHtml) return;

    const printWindow = window.open('', '_blank', 'height=800,width=800');

    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      // Use onload to ensure all content and styles are rendered before printing.
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        // The window can be closed automatically after printing, but some users might want it open.
        // printWindow.close();
      };
    } else {
      // This is a common issue if the browser's pop-up blocker is active.
      alert('Your browser blocked the pop-up. Please allow pop-ups for this site to print the invoice.');
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Generated Invoice</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-grow p-4 overflow-y-auto">
          {invoiceHtml && <iframe id="invoice-iframe" srcDoc={invoiceHtml} className="w-full h-full border-0" title="Invoice" />}
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-3">
           <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Close</button>
           <button type="button" onClick={handlePrint} disabled={!invoiceHtml} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed">Print Invoice</button>
        </div>
      </div>
    </div>
  );
};
