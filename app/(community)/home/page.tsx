import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

import { Space } from "@/types/types";
import Image from "next/image";
import carbyte from "@/public/spaces_icons/carbyte.svg"
import frontend from "@/public/spaces_icons/front-end.png"

// const spaces = ['React', 'NextJs', 'Automotive']

export default async function PrivatePage() {
  const supabase = createClient()
  // const { data: { user }, error } = await supabase.auth.getUser()
  const { data: spaces, error } = await supabase
    .from<Space>('spaces')
    .select()

  if (error) {
    console.error('Error fetching spaces:', error);
  }

  return (
    <div className=" w-full h-full flex flex-col items-center">


      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-xl">Spaces</p>
        {/* I need to create a table containing spaces that contain ressources */}

        {/* <div>
          {spaces.map(space => (
            <div key={``} className="border rounded-lg m-4 border-slate-200">
              <Link href={`/s/${space.toLocaleLowerCase()}`} >
                <p className="text-center p-2">{space}</p>
              </Link>
            </div>
          ))}
        </div> */}
        <div className="w-full md:max-w-[800px]">
          {spaces?.map((space: Space) => (
            <div key={space.id} className="flex flex-col border rounded-lg m-4 border-slate-200 hover:bg-primary/90" >
              <Link
                href={`/s/${space.title.toLocaleLowerCase()}`}
                className=" w-full flex items-center h-[100px] mx-4 "
              >
                {/* Image needs to be replace with storage api from supabase */}
                <Image
                  src={space.title === 'Frontend' ? frontend : carbyte}
                  alt={`${space.title} icon`}
                  width={100}
                  height={100}
                />
                <div className="flex-grow">
                  <p className="text-center p-2">{space.title}</p>
                </div>


              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}