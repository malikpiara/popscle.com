'use client'
//To dos
//1. Way to check if the url hasn't been already submited under another form. //consider tinyurls?.
//What if we have more routes /resourceX/view or resourceX/intro. How to manage that?
//prohibited urls? 


import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"


const formSchema = z.object({
  title: z.string({
    required_error: "Resource title is required",
    invalid_type_error: "Name must be a string",
  }).min(2).max(50).toLowerCase(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(255, {
    message: "Description must not be longer than 255 characters.",
  }),
  url: z.string().url(),
  user_id: z.string().uuid(),
  space_id: z.string().uuid(),
  type_id: z.coerce.number().int(),
  isPaid: z.boolean().default(false)
})



export function ResourceForm() {
  const user_id = '8698a2a2-62b6-464d-bca3-1edbbadb3cf4'
  const space_id = '47418bc9-d442-4ba0-9e34-d808a6acf4ef'

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: user_id, //Need to be passed from props 
      space_id: space_id, //Need to be passed from props
    },
  })
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log('Form submitted: ', values)

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Resource title' {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
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
                {/* <Input placeholder='Resource description' {...field} /> */}
                <Textarea
                  placeholder='Short resource description to help others recognize its value '
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Short resource description. Max 255 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='url'
          render={({ field }) => (
            <FormItem>

              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input {...field} />

              </FormControl>
              <FormDescription>Original resource url</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='type_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Resource type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Book</SelectItem>
                  <SelectItem value="2">Video</SelectItem>
                  <SelectItem value="3">Practical</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='isPaid'
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between" >
              {/* <div> */}

              <FormDescription>Free</FormDescription>
              {/* </div> */}
              {/* <FormMessage /> */}
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Paid</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}