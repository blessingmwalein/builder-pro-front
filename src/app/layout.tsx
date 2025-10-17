import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { Poppins, Lato } from 'next/font/google';
import { AuthProvider } from '@/components/providers/AuthProvider';

const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-poppins' });
const lato = Lato({ subsets: ['latin'], weight: ['300','400','700','900'], variable: '--font-lato' });

export const metadata: Metadata = {
  title: "Builder Pro",
  description: "Professional project management solution for construction and development teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${lato.variable}`}>
      <body className="antialiased">
        <Providers>
          <AuthProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
