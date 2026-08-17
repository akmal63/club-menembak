'use server'

import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type ActionState = { error: string } | null

function parseForm(formData: FormData) {
  const get = (k: string) => {
    const v = formData.get(k)
    return typeof v === 'string' && v.trim() !== '' ? v.trim() : null
  }
  return {
    title: get('title'),
    description: get('description'),
    location: get('location'),
    start_date: get('start_date'),
    end_date: get('end_date'),
    status: get('status') ?? 'upcoming',
  }
}

export async function createEvent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const allowed = await checkPermission('events', 'create')
  if (!allowed) return { error: 'Anda tidak punya izin menambah kegiatan.' }

  const data = parseForm(formData)
  if (!data.title) return { error: 'Nama kegiatan wajib diisi.' }
  if (!data.start_date) return { error: 'Tanggal mulai wajib diisi.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('events')
    .insert({ ...data, created_by: user?.id })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/events')
  redirect('/dashboard/events')
}

export async function updateEvent(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const allowed = await checkPermission('events', 'edit')
  if (!allowed) return { error: 'Anda tidak punya izin mengubah kegiatan.' }

  const data = parseForm(formData)
  if (!data.title) return { error: 'Nama kegiatan wajib diisi.' }
  if (!data.start_date) return { error: 'Tanggal mulai wajib diisi.' }

  const supabase = await createClient()
  const { error } = await supabase.from('events').update(data).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/events')
  redirect('/dashboard/events')
}

export async function deleteEvent(id: string): Promise<void> {
  const allowed = await checkPermission('events', 'delete')
  if (!allowed) throw new Error('Anda tidak punya izin menghapus kegiatan.')

  const supabase = await createClient()
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/events')
}
