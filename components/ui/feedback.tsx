"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"




const formSchema = z.object({
  feedback: z.string().min(10, {
    message: "Feedback must be at leat 10 characters."
  }).max(400, {
    message: "Feedback must be at most 400 characters."
  }),

})


export function FeedbackForm({ submit }: { submit: () => void }) {
  //1. Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: ""
    }
  })

  //2. Define submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    submit()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback</FormLabel>
              {/* <FormDescription>
                Thanks for taking the time to give us valuable feedback. This could be everything.
              </FormDescription> */}
              <FormControl>
                <Input
                  placeholder="Your thoughts here! 💖"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
  )
}

export default function FeedbackSheet() {

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleIsSubmitted = () => {
    setIsSubmitted(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setIsSubmitted(false) // Reset the submitted state when the sheet is closed
    }
  }

  return (

    <Sheet open={isOpen} onOpenChange={handleOpenChange} >
      <SheetTrigger asChild>
        <Button
          className="fixed right-0 top-1/2 origin-bottom-right -rotate-90"
        >Feedback</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Feedback Matters!</SheetTitle>
          <SheetDescription>Thanks for taking the time to give us valuable feedback. It means everything to us. ✨</SheetDescription>
        </SheetHeader>
        {isSubmitted ? (
          <div>
            <h1 className="text-center">Thank you!</h1>
            <p className="text-center">Your feedback has been received.</p>
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
  )
}