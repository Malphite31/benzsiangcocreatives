import React, { useState, useEffect } from 'react';
import { Client, Platform } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  clientToEdit: Client | null;
}

const emptyClient: Omit<Client, 'id'> = {
  name: '',
  contact: '',
  platform: Platform.Upwork,
};

export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSave, clientToEdit }) => {
  const [client, setClient] = useState<Omit<Client, 'id'>>(emptyClient);

  useEffect(() => {
    if (clientToEdit) {
      setClient(clientToEdit);
    } else {
      setClient(emptyClient);
    }
  }, [clientToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...client,
      id: clientToEdit?.id || crypto.randomUUID(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{clientToEdit ? 'Edit Client' : 'Add New Client'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client Name</label>
              <input type="text" name="name" id="name" value={client.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Info</label>
              <input type="text" name="contact" id="contact" value={client.contact} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" placeholder="Email, username, etc." />
            </div>
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Platform</label>
              <select name="platform" id="platform" value={client.platform} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                {Object.values(Platform).map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{clientToEdit ? 'Update Client' : 'Create Client'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
