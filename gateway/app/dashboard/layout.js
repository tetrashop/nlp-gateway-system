import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'داشبورد NLP Gateway',
  description: 'مدیریت مرکزی ۲۸ سرویس پردازش زبان طبیعی',
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  NLP Gateway
                </h1>
              </div>
              <div className="flex space-x-4 space-x-reverse">
                <a href="/dashboard" className="text-blue-600 hover:text-blue-800">
                  داشبورد
                </a>
                <a href="/services" className="text-gray-600 hover:text-gray-800 dark:text-gray-300">
                  سرویس‌ها
                </a>
                <a href="/nlp" className="text-gray-600 hover:text-gray-800 dark:text-gray-300">
                  پردازش متن
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
            <p>© ۲۰۲۴ NLP Gateway • تمامی حقوق محفوظ است</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
