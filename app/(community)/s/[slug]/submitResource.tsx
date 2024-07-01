'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select'; //neeeds to be implemented

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { createClient } from '@/utils/supabase/client';

// Define the schema for the resource form
const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  url: z.string().url({ message: 'Invalid URL.' }),
  votes: z.number().nullable().default(0),
  user_id: z.string().uuid({ message: 'Invalid UUID.' }),
  space_id: z.string().uuid({ message: 'Invalid UUID.' }),
  created_at: z.string().default(new Date().toISOString()),
  updated_at: z.string().default(new Date().toISOString()),
  type_id: z.number().int(),
  paid: z.boolean(),
});

export function ResourceForm({ submit }: { submit: () => void }) {
  const supabase = createClient();

  const [types, setTypes] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      const { data, error } = await supabase.from('types').select('id, name');
      if (error) {
        console.error(error);
      } else {
        setTypes(data);
      }
    };

    fetchTypes();
  }, [supabase]); // Added 'supabase' to the dependency array

  // 1. Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      url: '',
      type_id: 1,
      paid: false,
    },
  });

  // 2. Define submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const formData = {
      ...values,
      votes: 0,
      user_id: '1ae71fe5-5097-4672-bcfb-6d2e5e514915',
      space_id: '8f79f14e-e33e-470d-b4d9-3e639a9e09b8',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log(values);
    submit();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Resource title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='Resource description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder='Resource URL' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='type_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type ID</FormLabel>
              <FormControl>
                <Input
                  placeholder='Type'
                  type='number'
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))} // Convert to number
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name='type_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type ID</FormLabel>
              <FormControl>
                <Input placeholder='Type' type='number' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* <FormField
          control={form.control}
          name='paid'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paid</FormLabel>
              <FormControl>
                <input placeholder='Paid' type='checkbox' {...field} checked={field.value || false} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name='paid'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paid</FormLabel>
              <FormControl>
                {/* Ensure checkbox input is handled properly */}
                <input
                  type='checkbox'
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)} // Handle checkbox change
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full'>
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default function ResourceSheet() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleIsSubmitted = () => {
    setIsSubmitted(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsSubmitted(false); // Reset the submitted state when the sheet is closed
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className=''>
          <Plus className='mr-2 h-4 w-4' />
          Add Resource
        </Button>
      </SheetTrigger>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Submit a New Resource</SheetTitle>
          <SheetDescription>
            Fill in the details below to submit a new resource.
          </SheetDescription>
        </SheetHeader>
        {isSubmitted ? (
          <div>
            <h1 className='text-center'>Thank you!</h1>
            <p className='text-center'>Your resource has been submitted.</p>
          </div>
        ) : (
          <ResourceForm submit={handleIsSubmitted} />
        )}
      </SheetContent>
    </Sheet>
  );
}
