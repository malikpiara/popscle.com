import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default async function Nav() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <div className='w-full flex justify-between p-4'>
      <div className='flex'>
        <Link href={'/home'} className='hover:animate-pulse'>
          <Image
            className='-space-y-10'
            src={'/logo.svg'}
            alt='logo'
            width={50}
            height={50}
          />
        </Link>
      </div>

      <div className='flex'>
        {user && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className='border-2 border-background'>
                  <AvatarImage src='#' />
                  <AvatarFallback>
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-36'>
                <DropdownMenuItem className='text-muted-foreground'>
                  <Link className='w-full' href={`/account`}>
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <form action='/auth/signout' method='post'>
                    <Button
                      variant={'ghost'}
                      className='p-0 m-0 text-muted-foreground'
                      type='submit'
                    >
                      Sign out
                    </Button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
}
