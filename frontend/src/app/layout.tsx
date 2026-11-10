import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export const metadata = {
  title: 'Real-Time Bengal Gram Foreign Object Detection | YOLOv8',
  description: 'AI-Powered Computer Vision System for Foreign Object Detection in Bengal Gram using YOLOv8',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <Sidebar />
        <div className="pl-64 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-8 bg-slate-950">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
