'use client'

import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"

import { Space } from "@/components/spaceHeader" //not the general Space type
//the type space needs to be changed. It should come from spaceHeder but from types.ts. Here only four values needed

export default function SubmitTemp({ space }: { space: Space }) {

  const supabase = createClient()


  const [formData, setFormData] = useState({ name: '', url: '', isPaid: false, type_id: '', space_id: '97418bc9-d442-4ba0-9e34-d808a6acf4ef' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [types, setTypes] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    const fetchTypes = async () => {
      const { data: types, error } = await supabase.from('types').select()
      if (error) {
        console.log(error)
      } else {
        setTypes(types)
      }
    }
    fetchTypes()
  }, [supabase])

  console.log('New types', types)

  types?.map((type) => {
    console.log(type.name)
  })
  const selectTypes = types?.map((type) => (
    (<option key={type.id} value={type.id}>{type.name}</option>)

  ))

  console.log('selectTypes:', selectTypes)


  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    console.log('Values of Form, not inserted yet: ', formData)
    const { name, url, isPaid, type_id, space_id } = formData // Needed. this is assigning the values that are going to be inserted
    console.log('Name destructed: ', name)
    // console.log('Id destructured: ', user_id)
    console.log('Url destructured: ', url)
    console.log('isPaid destructured: ', isPaid)
    console.log('type_id destructured: ', type_id)


    //Passing a fictional user
    const { data: { user } } = await supabase.auth.getUser()
    console.log('User id:', user?.id)
    //Replace user_id from formData with user_id from getUser()
    // const user_id = user?.id
    // const user_id = '9698a2a2-62b6-464d-bca3-1edbbadb3cf4' //Fictional user
    // const space_id = space.id //space_id comming from props
    // console.log('space id:', space_id)


    const { data, error } = await supabase
      .from('resourcestest')
      .insert({ name, url, isPaid, type_id, space_id }) //not use formData but its value

    if (error) {
      setMessage(`Error: ${error.message}`)
      console.log('Not inserted, form data remained:', formData)
    } else {
      setMessage(`Form submitted successfully`)
      console.log('values submitted, will be reset:', formData)
      setFormData({ name: '', url: '', isPaid: false, type_id: '', space_id: space_id })
    }
    setLoading(false)

  }






  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="url">Url:</label>
        <input
          type="text"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
        />
        <label htmlFor="isPaid">Paid:</label>
        <select
          id="isPaid"
          name="isPaid"
          value={String(formData.isPaid)}
          onChange={handleChange}
          required
        >
          <option value="false">Free</option>
          <option value="true">Paid</option>
        </select>
        <label htmlFor="type_id">Type:</label>
        <select
          id="type_id"
          name="type_id"
          value={formData.type_id}
          onChange={handleChange}
          required
        >
          {selectTypes}

          {/* <option value="1">Book</option>
          <option value="2">Video</option>
          <option value="3">Article</option>
          <option value="4">Interactive Content</option>
          <option value="5">Practical Project</option> */}
        </select>


        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {message && <p>{message}</p>}

      </form>
    </>

  )

}