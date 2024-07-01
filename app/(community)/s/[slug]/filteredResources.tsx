'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';

import { createClient } from '@/utils/supabase/client';
import { Resource } from '@/types/types';
import { SkeletonResourceCard } from '@/components/SkeletonResourceCard';
import { ResourceCard } from '@/components/ResourceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';



export default function Resources({ spaceId }: { spaceId: string }) {
  const [data, setData] = useState<Resource[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [typeFilters, setTypeFilters] = useState<number[]>([]);
  const [types, setTypes] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Adding a loading state.

  const supabase = createClient();
  const getTypes = useCallback(async () => {
    const { data, error } = await supabase.from('types').select();
    if (error) {
      console.log(error);
    } else {
      setTypes(data);
    }
  }, [supabase]);
  console.log(types);

  const getData = useCallback(async () => {
    let query = supabase
      .from('resources')
      .select(`*, profiles (username)`)
      .eq('space_id', spaceId);

    // let query = supabase.from('resources').select().eq('space_id', spaceId);

    if (filter === 'FREE') {
      query = query.eq('isPaid', false);
    } else if (filter === 'PAID') {
      query = query.eq('isPaid', true);
    }

    if (typeFilters.length > 0) {
      query = query.in('type_id', typeFilters);
    }

    const { data, error } = await query;
    if (error) {
      console.log('Error fetching resources:', error);
    } else {
      setData(data);
    }
  }, [spaceId, supabase, filter, typeFilters]);

  useEffect(() => {
    setIsLoading(true);
    getData();
    getTypes();
  }, [getData, getTypes]);

  // This updates the loading state when the data fetching is complete.
  // There might be more efficient ways of implementing data fetching that work asynchronously and use Suspense.
  useEffect(() => {
    if (data && types) {
      setIsLoading(false);
    }
  }, [data, types]);

  const toogleTypeFilter = (typeId: number) => {
    setTypeFilters((prev) => {
      if (prev.includes(typeId)) {
        return prev.filter((id) => id != typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const handleUpvote = async (resourceId: string) => {
    const { error } = await supabase.rpc('increment_votes', {
      resource_id: resourceId,
    });
    if (error) {
      console.log('Error updating vote', error);
    } else {
      setData((prevData) =>
        prevData.map((resource) =>
          resource.id === resourceId
            ? { ...resource, votes: resource.votes + 1 }
            : resource
        )
      );
    }
  };

  const handleTabChange = (newValue: string) => {
    console.log('Active tab changed to:', newValue);
    setFilter(newValue);
  };

  console.log(data)

  const groupedResources = types.map(type => {
    return {
      type: type.name,
      resources: data.filter(resource => resource.type_id === type.id)
    }
  })

  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  return (
    <div className='md:w-max-[800px] mx-4'>
      <div className='w-[850px] p-4 border-b'>
        <Tabs defaultValue='ALL' onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value='ALL'>All</TabsTrigger>
            <TabsTrigger value='FREE'>Free</TabsTrigger>
            <TabsTrigger value='PAID'>Paid</TabsTrigger>
          </TabsList>
          <TabsContent value='ALL'>
            {/* <Resources spaceId={spaceId} /> */}
          </TabsContent>
          <TabsContent value='FREE'>
            {/* <Resources spaceId={spaceId} /> */}
          </TabsContent>
          <TabsContent value='PAID'>
            {/* <Resources spaceId={spaceId} /> */}
          </TabsContent>
        </Tabs>
      </div>
      <div>
        {/* Filtering by type */}
        {/* <div className=' flex justify-between'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setTypeFilters([])}
          >
            {' '}
            All types
          </Button>
          {types?.map((type) => (
            <Button
              key={type.id}
              variant='outline'
              size='sm'
              onClick={() => toogleTypeFilter(type.id)}
              className={clsx({
                'bg-accent text-accent-foreground': typeFilters.includes(
                  type.id
                ),
              })}
            >
              {type.name}
            </Button>
          ))}
        </div> */}

        {isLoading ? (
          <>
            {types.map(type => (

              <div key={type.id} className='w-[850px] p-4 border-b'>
                <p className='pb-2 text-xl font-semibold tracking-tight first:mt-0 mb-2'>{capitalizeFirstLetter(type.name)}</p>
                <SkeletonResourceCard />
                <SkeletonResourceCard />
                <SkeletonResourceCard />
                <SkeletonResourceCard />
              </div>
            ))}
          </>
        ) : (
          groupedResources.map(group => (
            <div key={group.type} className='w-[850px] p-4 border-b'>
              <p className='pb-2 text-xl font-semibold tracking-tight first:mt-0 mb-2'>{capitalizeFirstLetter(group.type)}</p>
              {
                group.resources.length > 0 ? (
                  group.resources.map(resource => (
                    <ResourceCard
                      key={resource.id}
                      id={resource.id}
                      name={resource.title}
                      score={resource.votes}
                      author={resource.profiles.username}
                      url={resource.url}
                      upvotedBy=''
                      votes={resource.votes}
                      onUpvote={handleUpvote}
                    />
                  ))
                ) : (
                  <p>No resources available.</p>
                )}
            </div>
          ))
        )}
      </div>

      <div></div>
    </div>
  );
}

//Separate in two components. Filter by free/paid. and by resources type.
