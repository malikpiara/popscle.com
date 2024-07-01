import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AvatarStack() {
  const users = [
    {
      name: 'Adonis Almagro',
      initials: 'AA',
    },
    {
      name: 'Malik Piara',
      initials: 'MP',
    },
    {
      name: 'Erhan Evin',
      initials: 'EE',
    },
  ];

  return (
    <>
      <div className='flex -space-x-3 rtl:space-x-reverse'>
        {users.map((user, i) => {
          return (
            <Avatar className='border-2 border-background' key={i}>
              <AvatarImage src='#' />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
          );
        })}
        <div className='flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-gray-800 rounded-full hover:bg-gray-600'>
          +22
        </div>
      </div>
    </>
  );
}
