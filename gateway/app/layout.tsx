import type { Metadata } from 'next';
import './globals.css'; // تغییر مسیر از '../globals.css' به './globals.css'

export const metadata: Metadata = {
  title: 'پلتفرم TetraSaaS v3.0 - 256 پروژه NLP',
  description: 'کامل‌ترین مجموعه پروژه‌های پردازش زبان طبیعی فارسی با ۲۵۶ پروژه و ۲۸ سرویس',
  keywords: ['NLP', 'هوش مصنوعی فارسی', 'پردازش متن', 'پروژه‌های هوش مصنوعی', 'API فارسی'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col">
          {/* محتوای هدر و فوتر شما... */}
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
