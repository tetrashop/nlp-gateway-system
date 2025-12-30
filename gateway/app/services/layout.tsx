import type { Metadata } from 'next';
import '../globals.css';
import ServicesHeader from '@/components/services/ServicesHeader';
import ServicesFooter from '@/components/services/ServicesFooter';

export const metadata: Metadata = {
  title: 'سرویس‌های پردازش زبان طبیعی | Tetrashop',
  description: '۲۸ سرویس تخصصی NLP برای پردازش متن فارسی و انگلیسی',
  keywords: ['NLP سرویس', 'API پردازش متن', 'هوش مصنوعی فارسی', 'سرویس‌های ابری'],
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ServicesHeader />
      <main className="flex-grow">
        {children}
      </main>
      <ServicesFooter />
    </div>
  );
}
