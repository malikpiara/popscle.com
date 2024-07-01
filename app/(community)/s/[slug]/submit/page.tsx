import { createClient } from '@/utils/supabase/server';
import SpaceNotFound from './spaceNotFound';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { ResourceForm } from './submitResourceForm';

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: spaces, error: spaceError } = await supabase
    .from('spaces')
    .select('id, title, description, created_at')
    .ilike('title', params.slug); //replace with .eq() when making sure that all titles are lowercae

  // If there is no space with the id redirect to /home
  if (spaceError) {
    console.log('Error fetching space:', spaceError);
    redirect('/home');
  }
  if (!spaces || spaces.length === 0) {
    // return <SpaceNotFound />  //Use to redirect to home within 3 seconds
    redirect('/home');
  }

  //Get user id
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    console.log('Error fetching user:', userError); // Improved error logging
    redirect('/login');
  }
  if (!user) {
    redirect('/login');
  }

  const spaceId = spaces[0]?.id;
  const spaceTitle = spaces[0]?.title;
  const userId = user?.id;

  // Function to convert a string to title case
  function toTitleCase(str: string): string {
    return str
      .toLowerCase() // Convert the entire string to lowercase
      .split(/[\s\-]+/) // Split the string by spaces or hyphens
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back together with a space
  }

  return (
    <div>
      <p className='text-center'>
        Submit new resource for {toTitleCase(spaceTitle)}
      </p>
      <ResourceForm spaceId={spaceId} userId={userId} />
    </div>
  );
}

//Client Component:

// 'use client'
// //this could be a server component. I would need to pass the spaceid to a client component.
// import { createClient } from "@/utils/supabase/client"
// import { ResourceForm } from "./submitResourceForm"
// import { useEffect, useState, useCallback } from "react"
// import { useRouter } from "next/navigation"

// export default function SubmitPage({ params }: { params: { slug: string } }) {
//   const supabase = createClient()
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [spaceId, setSpaceId] = useState<string | null>(null)

//   const fetchSpace = useCallback(async () => {
//     try {
//       const { data: spaces, error: spaceError } = await supabase
//         .from('spaces')
//         .select('id, title')
//         .ilike('title', params.slug) // Ensure titles in the database are lowercase

//       if (!spaces || spaces.length === 0) {
//         console.log('Error fetching Space:', spaceError)
//         setError('Space not found. Redirecting to home...')
//         setTimeout(() => {
//           router.push('/home')
//         }, 3000) // Wait for 3 seconds before redirecting
//       } else {
//         setSpaceId(spaces[0]?.id)
//         setLoading(false)
//       }
//     } catch (error) {
//       console.error('Unexpected error:', error)
//       setError('An unexpected error occurred. Please try again later.')
//     }
//   }, [params.slug, router, supabase])

//   useEffect(() => {
//     fetchSpace()
//   }, [fetchSpace])

//   if (error) {
//     return (
//       <div>
//         <p>{error}</p>
//       </div>
//     )
//   }
//   if (loading) {
//     return (
//       <div>
//         <p>Loading...</p>
//       </div>
//     )
//   }
//   // Function to convert a string to title case
//   function toTitleCase(str: string): string {
//     return str
//       .toLowerCase() // Convert the entire string to lowercase
//       .split(/[\s\-]+/) // Split the string by spaces or hyphens
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
//       .join(' '); // Join the words back together with a space
//   }

//   return (
//     <div>
//       <p>Submit a new resource  for {toTitleCase(params.slug)}</p>
//       <ResourceForm spaceId={spaceId} />
//     </div>
//   )
// }
