import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NLP Gateway - مدیریت ۲۸ سرویس',
  description: 'Gateway مرکزی برای مسیریابی هوشمند به ۲۸ سرویس مختلف',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
