import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">About Community Sentinel</h2>
            <div className="prose dark:prose-invert mt-4">
                 <p>
                    Community Sentinel is an AI-powered, action-driven platform designed to empower citizens.
                    Our mission is to provide a seamless way for you to report, track, and resolve community issues.
                </p>
                <p>
                    Whether it's a pothole on your street, a traffic violation, an infrastructure problem, or a safety hazard,
                    this platform connects you with the right people to get things done. By fostering a collaborative environment,
                    we aim to build safer, more responsive, and better-maintained public spaces for everyone.
                </p>
                 <p>
                    This is a demonstration application showcasing modern web technologies and AI integration.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;