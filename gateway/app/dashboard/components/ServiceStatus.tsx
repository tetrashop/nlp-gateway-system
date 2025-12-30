"use client";

import { useState, useEffect } from 'react';

export default function ServiceStatus() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/nlp')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setServices(data.services);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <div>
      <h2>وضعیت سرویس‌ها</h2>
      {services.length > 0 ? (
        <ul>
          {services.map(service => (
            <li key={service.id}>
              {service.name} - {service.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>سرویسی یافت نشد</p>
      )}
    </div>
  );
}
