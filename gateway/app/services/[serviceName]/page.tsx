import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import GatewayMonitor from '../../../components/GatewayMonitor';
import { services } from '../../../servicesData';
import Loading from '../../../components/Loading';

interface PageProps {
  params: Promise<{ serviceName?: string }>;
}

async function ServicePageContent({ params }: { params: { serviceName?: string } }) {
  const serviceName = params.serviceName as string;
  
  const service = services.find(s => s.id === serviceName);
  
  if (!service) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{service.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">{service.description}</p>
      
      <GatewayMonitor 
        initialService={service.id}
        title={`مانیتورینگ ${service.name}`}
      />
    </div>
  );
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={<Loading />}>
      <ServicePageContent params={resolvedParams} />
    </Suspense>
  );
}

export function generateStaticParams() {
  return services.map((service) => ({
    serviceName: service.id,
  }));
}
