import Navbar from '@/app/components/Navbar';

export default function LabsLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="pt-20">
                {children}
            </main>
        </>
    );
}
