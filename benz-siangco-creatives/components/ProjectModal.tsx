

import React, { useState, useEffect } from 'react';
import { Project, Client, ProjectType, ContentForm, ProjectStatus } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  projectToEdit: Project | null;
  clients: Client[];
}

const emptyProject: Omit<Project, 'id'> = {
  name: '',
  clientId: '',
  type: ProjectType.VideoEditing,
  form: ContentForm.ShortForm,
  status: ProjectStatus.NotStarted,
  budget: 0,
  dueDate: '',
  description: '',
  outputUrl: '',
  notes: '',
};

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, projectToEdit, clients }) => {
  const [project, setProject] = useState<Omit<Project, 'id'>>(emptyProject);

  useEffect(() => {
    if (projectToEdit) {
      // FIX: The project state is typed as Omit<Project, 'id'>.
      // We must remove the 'id' from projectToEdit before setting the state
      // to prevent a type mismatch during the build process.
      const { id, ...projectData } = projectToEdit;
      setProject(projectData);
    } else {
      setProject({
          ...emptyProject,
          clientId: clients.length > 0 ? clients[0].id : '',
      });
    }
  }, [projectToEdit, clients, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: name === 'budget' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.clientId) {
      alert("Please select a client.");
      return;
    }
    onSave({
      ...project,
      id: projectToEdit?.id || crypto.randomUUID(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{projectToEdit ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
              <input type="text" name="name" id="name" value={project.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
              <select name="clientId" id="clientId" value={project.clientId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                <option value="" disabled>Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Type</label>
              <select name="type" id="type" value={project.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                {Object.values(ProjectType).map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="form" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content Form</label>
              <select name="form" id="form" value={project.form} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                {Object.values(ContentForm).map(form => <option key={form} value={form}>{form}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select name="status" id="status" value={project.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                {Object.values(ProjectStatus).map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget ($)</label>
              <input type="number" name="budget" id="budget" value={project.budget} onChange={handleChange} min="0" className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
              <input type="date" name="dueDate" id="dueDate" value={project.dueDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="outputUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Output URL</label>
              <input type="url" name="outputUrl" id="outputUrl" value={project.outputUrl || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" placeholder="https://example.com/project-delivery" />
            </div>
            <div className="md:col-span-2">
              <div className="flex justify-between items-center">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              </div>
              <textarea name="description" id="description" value={project.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
              <textarea name="notes" id="notes" value={project.notes || ''} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500" placeholder="Add any specific details or remarks..."></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{projectToEdit ? 'Update Project' : 'Create Project'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};