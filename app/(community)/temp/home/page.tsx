import { createClient } from '@/utils/supabase/server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpaceHeader } from '@/components/spaceHeader';
import { Space } from '@/components/spaceHeader';
import { ResourceCard } from '@/components/ResourceCard';

export default async function PrivatePage() {
  const spaceTitle = 'Frontend';
  const spaceDescription =
    'For front end web developers who want to move the web forward.';

  const space: Space = {
    title: spaceTitle,
    description: spaceDescription,
    id: '',
    created_at: '',
  };

  const postData = [
    {
      name: 'MDN Web Docs',
      score: 87,
      author: 'Adonis',
      url: 'https://developer.mozilla.org/',
      isFree: true,
      upvotedBy: [],
    },
    {
      name: 'MDN Web Docs',
      score: 32,
      author: 'Malik',
      url: 'https://developer.mozilla.org/',
      isFree: true,
      upvotedBy: [],
    },
    {
      name: 'MDN Web Docs',
      score: 87,
      author: 'Adonis',
      url: 'https://developer.mozilla.org/',
      isFree: false,
      upvotedBy: [],
    },
    {
      name: 'React Reference Overview',
      score: 22,
      author: 'Adonis',
      url: 'https://react.dev/reference/react',
      isFree: true,
      upvotedBy: [],
    },
    {
      name: 'MDN Web Docs',
      score: 87,
      author: 'Adonis',
      url: 'https://developer.mozilla.org/',
      isFree: true,
      upvotedBy: [],
    },
    {
      name: 'React Reference Overview',
      score: 22,
      author: 'Adonis',
      url: 'https://react.dev/reference/react',
      isFree: false,
      upvotedBy: [],
    },
  ];

  const supabase = createClient();
  // const { data: { user }, error } = await supabase.auth.getUser()
  const { data: spaces, error } = await supabase.from('spaces').select();

  if (error) {
    console.error('Error fetching spaces:', error);
  }
  if (spaces) {
    return (
      <>
        {/* <div className='mt-5'>
          <SpaceHeader space={space} />
        </div>

        <div className='w-[850px] p-4 border-b'>
          <Tabs defaultValue='free'>
            <TabsList>
              <TabsTrigger value='free'>Free</TabsTrigger>
              <TabsTrigger value='paid'>Paid</TabsTrigger>
            </TabsList>
            <TabsContent value='free'>
              {postData
                .filter((item) => item.isFree)
                .map((item, i) => {
                  return (
                    <>
                      <ResourceCard
                        key={i + 1}
                        name={item.name}
                        score={item.score}
                        author={item.author}
                        url={item.url}
                        upvotedBy=''
                      />
                    </>
                  );
                })}
            </TabsContent>
            <TabsContent value='paid'>
              {postData
                .filter((item) => !item.isFree)
                .map((item, i) => {
                  return (
                    <>
                      <ResourceCard
                        key={i + 1}
                        name={item.name}
                        score={item.score}
                        author={item.author}
                        url={item.url}
                        upvotedBy=''
                      />
                    </>
                  );
                })}
            </TabsContent>
          </Tabs>
        </div> */}
      </>
    );
  }
}
