import { createClient } from '@/utils/supabase/server';
import { Resource } from '@/types/types';
import { redirect } from 'next/navigation';
import Resources from './filteredResources';
import { SpaceHeader } from '@/components/spaceHeader';
import { Space } from '@/components/spaceHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkeletonResourceCard } from '@/components/SkeletonResourceCard';


export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  console.log('Params: ', params)
  console.log('Params slug', params.slug)

  const { data: spaces, error: spaceError } = await supabase
    .from('spaces')
    .select('id, title, description, created_at')
    .ilike('title', params.slug);

  // If there is no space with the id redirect to /home
  if (!spaces || spaces.length === 0) {
    console.log('spaceError;:', spaceError);
    redirect('/home');
  }
  const spaceId = spaces[0]?.id;
  const spaceTitle = spaces[0]?.title;
  const spaceDescription = spaces[0]?.description;
  const spaceCreatedAt = spaces[0]?.created_at

  //Fetch resources matching the space_id
  const { data: resources, error: resourcesError } = await supabase
    .from('resources')
    .select()
    .eq('space_id', spaceId);

  if (!resources) {
    return <div>No resources available for the space</div>;
    console.log(resourcesError);
  }


  const space: Space = {
    title: spaceTitle,
    description: spaceDescription,
    id: spaceId,
    created_at: spaceCreatedAt,
  };

  return (
    <div className='flex flex-col items-center'>
      <SpaceHeader space={space} slug={params.slug} />

      <Resources spaceId={spaceId} />
    </div>
  );
}
