export const metadata = {
  title: 'NLP Gateway API',
  description: 'Gateway مرکزی برای مدیریت ۲۸ سرویس',
};

export default function ApiLayout({ children }) {
  return (
    <div className="api-layout">
      {children}
    </div>
  );
}
