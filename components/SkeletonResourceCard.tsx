import { Skeleton } from '@/components/ui/skeleton';
import { ChevronUp } from 'lucide-react';

export function SkeletonResourceCard() {
  return (
    <>
      <div className='rounded-md px-2 py-3 flex space-x-4 transition-all delay-100 justify-between'>
        <div className='flex'>
          <div className='flex self-center text-sm'>{1}.</div>
          <div className='p-3 hover:text-green-500 hover:animate-ping'>
            <ChevronUp />
          </div>
          <div className='flex flex-col'>
            <Skeleton className='w-[300px] h-[20px] rounded-full' />
            <div className='flex space-x-1'>
              <Skeleton className='w-[200px] h-[15px] rounded-full mt-2' />
            </div>
          </div>
        </div>
        <div className='justify-end mr-20'>
          <Skeleton className='w-[100px] h-[20px] rounded-full' />
        </div>
      </div>
    </>
  );
}
