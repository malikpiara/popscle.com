'use client';
import { createClient } from '@/utils/supabase/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  feedback: z
    .string()
    .min(10, {
      message: 'Feedback must be at leat 10 characters.',
    })
    .max(400, {
      message: 'Feedback must be at most 400 characters.',
    }),
});

export function FeedbackForm({ submit }: { submit: () => void }) {
  const supabase = createClient();

  //1. Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: '',
    },
  });

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the current user
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data && data.user) {
        setUserId(data.user.id);
      } else {
        console.log('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [supabase.auth]);

  //2. Define submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const feedbackData = {
      feedback: values.feedback,
      user_id: userId ? userId : 'db74a0c3-9fb9-4fa7-818a-1f1d507d7d42',
    };

    const { data, error } = await supabase
      .from('feedbacks')
      .insert([feedbackData]);

    if (error) {
      console.log('Error inserting feedback:', error);
    } else {
      console.log('Feedback inserted:', data);
      submit();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='feedback'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback</FormLabel>
              {/* <FormDescription>
                Thanks for taking the time to give us valuable feedback. This could be everything.
              </FormDescription> */}
              <FormControl>
                <Textarea
                  placeholder='Your thoughts here! 💖'
                  className='resize-none'
                  {...field}
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

export default function FeedbackSheet() {
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
        <Button className='fixed right-0 top-1/2 origin-bottom-right -rotate-90 bg-muted text-muted-foreground'>
          Feedback
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Feedback Matters!</SheetTitle>
          <SheetDescription>
            Thanks for taking the time to give us valuable feedback. It means
            everything to us. ✨
          </SheetDescription>
        </SheetHeader>
        {isSubmitted ? (
          <div>
            <h1 className='text-center'>Thank you!</h1>
            <p className='text-center'>Your feedback has been received.</p>
          </div>
        ) : (
          <FeedbackForm submit={handleIsSubmitted} />
        )}
        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Send..</Button>
          </SheetClose>

        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
