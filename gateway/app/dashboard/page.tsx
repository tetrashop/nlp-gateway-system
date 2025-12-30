import ServiceStatus from './components/ServiceStatus';

export const metadata = {
  title: 'داشبورد مدیریت NLP',
  description: 'مدیریت سرویس‌های پردازش زبان طبیعی',
};

export default function DashboardPage() {
  return (
    <div>
      <h1>داشبورد مدیریت NLP Gateway</h1>
      <ServiceStatus />
    </div>
  );
}
