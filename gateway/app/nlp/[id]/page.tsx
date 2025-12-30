import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import NLPService from '../../../components/NLPService';
import { nlpServices } from '../../../nlpData';
import Loading from '../../../components/Loading';

interface PageProps {
  params: Promise<{ id?: string }>;
}

async function NLPPageContent({ params }: { params: { id?: string } }) {
  const projectId = params.id ? Number(params.id) : null;
  
  if (projectId === null || isNaN(projectId) || projectId < 1 || projectId > nlpServices.length) {
    notFound();
  }

  const service = nlpServices[projectId - 1];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{service.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">{service.description}</p>
      
      <NLPService 
        serviceId={service.id}
        endpoint={service.endpoint}
        name={service.name}
        description={service.description}
      />
    </div>
  );
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={<Loading />}>
      <NLPPageContent params={resolvedParams} />
    </Suspense>
  );
}

export function generateStaticParams() {
  return nlpServices.map((service, index) => ({
    id: (index + 1).toString(),
  }));
}
