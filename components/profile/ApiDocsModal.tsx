import React from 'react';
import Modal from '../ui/Modal';

interface ApiDocsModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string;
}

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-3 rounded-md text-xs overflow-x-auto">
        <code>{children}</code>
    </pre>
)

const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose, apiKey }) => {

    const endpoints = [
        {
            title: "Get All Issue Reports",
            method: "GET",
            path: "/api/issues",
            description: "Fetches a list of all issue reports.",
            curl: `curl -X GET "https://community-sentinel-api.example.com/api/issues" \\\n  -H "Authorization: Bearer ${apiKey}"`
        },
        {
            title: "Submit a New Report",
            method: "POST",
            path: "/api/issues",
            description: "Creates a new issue report. The body should be a JSON object.",
            curl: `curl -X POST "https://community-sentinel-api.example.com/api/issues" \\\n  -H "Authorization: Bearer ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "text": "There is a broken swing at the park.",\n    "isAnonymous": false,\n    "tags": ["#park", "#safety"]\n  }'`
        },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="API Documentation">
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Use the following endpoints to interact with the Community Sentinel platform programmatically.
                    Include your API key in the `Authorization` header as a Bearer token.
                </p>

                {endpoints.map(endpoint => (
                    <div key={endpoint.title} className="space-y-2">
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{endpoint.title}</h4>
                        <p className="text-sm">
                            <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md text-indigo-600 dark:text-indigo-400">{endpoint.method}</span>
                            <span className="ml-2 font-mono">{endpoint.path}</span>
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{endpoint.description}</p>
                        <CodeBlock>{endpoint.curl}</CodeBlock>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default ApiDocsModal;