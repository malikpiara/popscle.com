'use client'
//To dos
//1. Way to check if the url hasn't been already submited under another form. //consider tinyurls?.
//What if we have more routes /resourceX/view or resourceX/intro. How to manage that?
//prohibited urls? 
//2. We could think about. Once the form is submited. The resource has 0 votes or 1 vote (from the person who submitted)


import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'


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

interface ResourceType {
  id: number;
  name: string;
}


export function ResourceForm({ spaceId, userId }: { spaceId: string, userId: string }) {
  const supabase = createClient()
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([])

  useEffect(() => {
    const fetchResourceTypes = async () => {
      const { data, error: typesError } = await supabase
        .from('types')
        .select()
      console.log(data)
      if (typesError) {
        console.log('Fetching types error:', typesError)
      } else {
        setResourceTypes(data)
      }
    }

    fetchResourceTypes()
  }, [supabase])

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: userId, //Need to be passed from props 
      space_id: spaceId, //Need to be passed from props
    },
  })
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log('Form submitted: ', values)
    const { error: submitError } = await supabase
      .from('resources')
      .insert([values])
    if (submitError) {
      console.log('Error submiting form:', submitError)
    } else {
      console.log('Form submitted')
    }
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
              <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Resource type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {resourceTypes?.map(type => (
                    <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>

                  ))}
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

              {/* <FormMessage /> */}
              <FormDescription>Free</FormDescription>
              {/* </div> */}
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