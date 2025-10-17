

import React, { useState, useMemo, useCallback } from 'react';
import { Client, Project, ProjectStatus, ProjectType, User } from '../types';
import { INITIAL_CLIENTS, INITIAL_PROJECTS } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';
import { ClientModal } from './ClientModal';
import { ProjectModal } from './ProjectModal';
import { ConfirmationModal } from './ConfirmationModal';
import { InvoiceModal } from './InvoiceModal';
import { StatusBadge } from './StatusBadge';
import { ProjectTypeBadge } from './ProjectTypeBadge';
import { AnalyticsGraph } from './AnalyticsGraph';
import { CalendarView } from './CalendarView';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';
import { generateInvoiceHtmlClientSide } from '../services/invoiceService';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { TagIcon } from './icons/TagIcon';
import { Squares2X2Icon } from './icons/Squares2X2Icon';
import { LinkIcon } from './icons/LinkIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { MiniCalendar } from './MiniCalendar';
import { ArrowLeftOnRectangleIcon } from './icons/ArrowLeftOnRectangleIcon';


const Header: React.FC<{
    user: User;
    onAddClient: () => void;
    onAddProject: () => void;
    onLogout: () => void;
}> = ({ user, onAddClient, onAddProject, onLogout }) => (
    <header className="bg-white/80 dark:bg-gray-800/80 shadow-sm sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
                <Logo className="h-7 w-auto text-gray-900 dark:text-gray-100" />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">Welcome, {user.name.split(' ')[0]}</span>
                <ThemeToggle />
                <button
                    onClick={onAddClient}
                    className="flex items-center px-3 sm:px-4 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 dark:bg-primary-900/50 dark:text-primary-200 dark:hover:bg-primary-900 text-sm font-medium"
                >
                    <PlusIcon className="w-5 h-5 sm:mr-1" />
                    <span className="hidden sm:inline">Add Client</span>
                </button>
                <button
                    onClick={onAddProject}
                    className="flex items-center px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium shadow"
                >
                    <PlusIcon className="w-5 h-5 sm:mr-1" />
                    <span className="hidden sm:inline">Add Project</span>
                </button>
                <button onClick={onLogout} className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" title="Logout">
                    <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    </header>
);

interface SummaryCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}
const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

type Tab = 'dashboard' | 'projects' | 'clients' | 'calendar';

interface AppContentProps {
    user: User;
    onLogout: () => void;
}

export const AppContent: React.FC<AppContentProps> = ({ user, onLogout }) => {
    const clientsKey = `clients_${user.email}`;
    const projectsKey = `projects_${user.email}`;

    const [clients, setClients] = useLocalStorage<Client[]>(clientsKey, INITIAL_CLIENTS);
    const [projects, setProjects] = useLocalStorage<Project[]>(projectsKey, INITIAL_PROJECTS);

    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [deletionTarget, setDeletionTarget] = useState<{ type: 'client' | 'project', id: string } | null>(null);

    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [invoiceHtml, setInvoiceHtml] = useState<string | null>(null);

    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [typeFilter, setTypeFilter] = useState<string>('All');
    const [clientFilter, setClientFilter] = useState<string>('All');
    const [copiedClientId, setCopiedClientId] = useState<string | null>(null);
    
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    const summaryStats = useMemo(() => {
        const activeProjects = projects.filter(p => p.status === ProjectStatus.InProgress || p.status === ProjectStatus.Revisions).length;
        const totalEarnings = projects
            .filter(p => p.status === ProjectStatus.Completed)
            .reduce((sum, p) => sum + p.budget, 0);
        return {
            totalClients: clients.length,
            activeProjects,
            totalEarnings: totalEarnings.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }),
        };
    }, [clients, projects]);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const statusMatch = statusFilter === 'All' || project.status === statusFilter;
            const typeMatch = typeFilter === 'All' || project.type === typeFilter;
            const clientMatch = clientFilter === 'All' || project.clientId === clientFilter;
            return statusMatch && typeMatch && clientMatch;
        });
    }, [projects, statusFilter, typeFilter, clientFilter]);
    
    const clientObjectMap = useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);

    const handleSaveClient = useCallback((client: Client) => {
        setClients(prevClients => {
            const existing = prevClients.find(c => c.id === client.id);
            if (existing) {
                return prevClients.map(c => c.id === client.id ? client : c);
            }
            return [...prevClients, client];
        });
        setIsClientModalOpen(false);
        setClientToEdit(null);
    }, [setClients]);

    const requestDeletion = useCallback((type: 'client' | 'project', id: string) => {
        setDeletionTarget({ type, id });
    }, []);

    const handleConfirmDeletion = useCallback(() => {
        if (!deletionTarget) return;

        if (deletionTarget.type === 'client') {
            setClients(prev => prev.filter(c => c.id !== deletionTarget.id));
            setProjects(prev => prev.filter(p => p.clientId !== deletionTarget.id));
        } else if (deletionTarget.type === 'project') {
            setProjects(prev => prev.filter(p => p.id !== deletionTarget.id));
        }
        
        setDeletionTarget(null);
    }, [deletionTarget, setClients, setProjects]);

    const handleSaveProject = useCallback((project: Project) => {
        setProjects(prevProjects => {
            const existing = prevProjects.find(p => p.id === project.id);
            if (existing) {
                return prevProjects.map(p => p.id === project.id ? project : p);
            }
            return [...prevProjects, project];
        });
        setIsProjectModalOpen(false);
        setProjectToEdit(null);
    }, [setProjects]);

    const openClientModal = useCallback((client: Client | null) => {
        setClientToEdit(client);
        setIsClientModalOpen(true);
    }, []);

    const openProjectModal = useCallback((project: Project | null) => {
        setProjectToEdit(project);
        setIsProjectModalOpen(true);
    }, []);

    const handleClearFilters = useCallback(() => {
        setStatusFilter('All');
        setTypeFilter('All');
        setClientFilter('All');
    }, []);

    const handleCopyContact = useCallback((clientId: string) => {
        const client = clientObjectMap.get(clientId);
        if (client?.contact) {
            navigator.clipboard.writeText(client.contact).then(() => {
                setCopiedClientId(clientId);
                setTimeout(() => setCopiedClientId(null), 2000);
            }, (err) => {
                console.error('Could not copy text: ', err);
                alert('Failed to copy contact info.');
            });
        }
    }, [clientObjectMap]);

    const handleGenerateInvoice = useCallback((project: Project) => {
        const client = clientObjectMap.get(project.clientId);
        if (!client) {
            alert("Client not found for this project.");
            return;
        }

        const html = generateInvoiceHtmlClientSide(project, client);
        setInvoiceHtml(html);
        setIsInvoiceModalOpen(true);
    }, [clientObjectMap]);

    const tabs = [
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'projects', name: 'Projects' },
        { id: 'clients', name: 'Clients' },
        { id: 'calendar', name: 'Calendar' }
    ];

    return (
        <>
            <Header user={user} onAddClient={() => openClientModal(null)} onAddProject={() => openProjectModal(null)} onLogout={onLogout} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={`${
                                        activeTab === tab.id
                                            ? 'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-300'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none`}
                                    aria-current={activeTab === tab.id ? 'page' : undefined}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Summary Section */}
                            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SummaryCard title="Total Clients" value={String(summaryStats.totalClients)} icon={<UserGroupIcon className="w-6 h-6 text-primary-600" />} />
                                <SummaryCard title="Active Projects" value={String(summaryStats.activeProjects)} icon={<BriefcaseIcon className="w-6 h-6 text-primary-600" />} />
                                <SummaryCard title="Completed Revenue" value={summaryStats.totalEarnings} icon={<CurrencyDollarIcon className="w-6 h-6 text-primary-600" />} />
                            </section>

                            {/* Analytics & Calendar Section */}
                             <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                <div className="lg:col-span-2">
                                    <AnalyticsGraph projects={projects} clients={clients} />
                                </div>
                                <div className="lg:col-span-1">
                                    <MiniCalendar projects={projects} onNavigate={() => setActiveTab('calendar')} />
                                </div>
                            </section>
                        </div>
                    )}
                    {activeTab === 'projects' && (
                        <section className="animate-fade-in">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Projects</h2>
                            {/* Filters */}
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                                    <div>
                                        <label htmlFor="statusFilter" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            <TagIcon className="w-5 h-5 mr-1.5 text-gray-500 dark:text-gray-400" />
                                            Status
                                        </label>
                                        <select id="statusFilter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                                            <option>All</option>
                                            {/* FIX: Add explicit type assertion to fix 'unknown' type error. */}
                                            {(Object.values(ProjectStatus) as ProjectStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="typeFilter" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            <Squares2X2Icon className="w-5 h-5 mr-1.5 text-gray-500 dark:text-gray-400" />
                                            Type
                                        </label>
                                        <select id="typeFilter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                                            <option>All</option>
                                            {/* FIX: Add explicit type assertion to fix 'unknown' type error. */}
                                            {(Object.values(ProjectType) as ProjectType[]).map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="clientFilter" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                             <UserGroupIcon className="w-5 h-5 mr-1.5 text-gray-500 dark:text-gray-400" />
                                            Client
                                        </label>
                                        <select id="clientFilter" value={clientFilter} onChange={e => setClientFilter(e.target.value)} className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                                            <option>All</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium w-full sm:w-auto"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredProjects.length > 0 ? filteredProjects.map(project => (
                                        <li key={project.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <div className="grid grid-cols-12 gap-x-4 gap-y-2 items-center">
                                                <div className="col-span-12 sm:col-span-4">
                                                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate" title={project.name}>{project.name}</p>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                                       <span className="hover:text-primary-600 dark:hover:text-primary-400">
                                                          {clientObjectMap.get(project.clientId)?.name || 'Unknown Client'}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleCopyContact(project.clientId)} 
                                                            title={`Copy ${clientObjectMap.get(project.clientId)?.contact}`}
                                                            className="relative"
                                                        >
                                                            <ClipboardIcon className="w-4 h-4 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400" />
                                                             {copiedClientId === project.clientId && (
                                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white dark:bg-gray-600 dark:text-gray-100 text-xs px-2 py-1 rounded">
                                                                    Copied!
                                                                </span>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-span-12 sm:col-span-4 flex items-center gap-2">
                                                    <StatusBadge status={project.status} />
                                                    <ProjectTypeBadge type={project.type} />
                                                </div>
                                                <div className="col-span-6 sm:col-span-1 text-left">
                                                    <p className="font-semibold text-gray-800 dark:text-gray-100">${project.budget.toLocaleString()}</p>
                                                    
                                                </div>
                                                <div className="col-span-6 sm:col-span-3 flex items-center justify-start sm:justify-end space-x-2">
                                                     {project.status === ProjectStatus.Completed && (
                                                        <>
                                                            {project.outputUrl && (
                                                                <a href={project.outputUrl} target="_blank" rel="noopener noreferrer" title="View Project Output" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                                                                    <LinkIcon className="w-5 h-5" />
                                                                </a>
                                                            )}
                                                            <button onClick={() => handleGenerateInvoice(project)} title="Generate Invoice" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                                                                <DocumentTextIcon className="w-5 h-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button onClick={() => openProjectModal(project)} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"><PencilIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => requestDeletion('project', project.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                        </li>
                                    )) : <p className="p-4 text-center text-gray-500 dark:text-gray-400">{projects.length > 0 ? 'No projects match the current filters.' : 'No projects yet. Add one to get started!'}</p>}
                                </ul>
                            </div>
                        </section>
                    )}
                    {activeTab === 'clients' && (
                        <section className="animate-fade-in">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Clients</h2>
                             <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {clients.length > 0 ? clients.map(client => (
                                        <li key={client.id} id={`client-${client.id}`} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 scroll-mt-20">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{client.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{client.platform}</p>
                                                </div>
                                                 <div className="flex items-center space-x-2">
                                                    <button onClick={() => openClientModal(client)} className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"><PencilIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => requestDeletion('client', client.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                        </li>
                                    )) : <p className="p-4 text-center text-gray-500 dark:text-gray-400">No clients yet.</p>}
                                </ul>
                            </div>
                        </section>
                    )}
                    {activeTab === 'calendar' && (
                        <section className="animate-fade-in">
                            <CalendarView projects={projects} onProjectClick={openProjectModal} />
                        </section>
                    )}
                </div>
            </main>
            
            <ClientModal 
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                onSave={handleSaveClient}
                clientToEdit={clientToEdit}
            />

            <ProjectModal 
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onSave={handleSaveProject}
                projectToEdit={projectToEdit}
                clients={clients}
            />

            <ConfirmationModal 
                isOpen={!!deletionTarget}
                onClose={() => setDeletionTarget(null)}
                onConfirm={handleConfirmDeletion}
                title={deletionTarget?.type === 'client' ? 'Delete Client' : 'Delete Project'}
                message={
                    deletionTarget?.type === 'client' 
                    ? "Are you sure you want to delete this client and all associated projects? This action is irreversible and cannot be undone." 
                    : "Are you sure you want to delete this project? This action is irreversible and cannot be undone."
                }
            />

            <InvoiceModal
                isOpen={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
                invoiceHtml={invoiceHtml}
            />
        </>
    );
}