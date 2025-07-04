'use client';

import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-bg text-txt">
            {/* Header */}
            <Header />

            {/* Page Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
