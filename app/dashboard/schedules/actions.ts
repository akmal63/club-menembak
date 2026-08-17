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
  const num = (k: string) => {
    const v = get(k)
    return v ? Number(v) : null
  }
  return {
    title: get('title'),
    description: get('description'),
    location: get('location'),
    start_time: get('start_time'),
    end_time: get('end_time'),
    instructor: get('instructor'),
    max_participants: num('max_participants'),
    status: get('status') ?? 'scheduled',
  }
}

export async function createSchedule(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const allowed = await checkPermission('schedules', 'create')
  if (!allowed) return { error: 'Anda tidak punya izin menambah jadwal.' }

  const data = parseForm(formData)
  if (!data.title) return { error: 'Judul latihan wajib diisi.' }
  if (!data.start_time) return { error: 'Waktu mulai wajib diisi.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('training_schedules')
    .insert({ ...data, created_by: user?.id })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/schedules')
  redirect('/dashboard/schedules')
}

export async function updateSchedule(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const allowed = await checkPermission('schedules', 'edit')
  if (!allowed) return { error: 'Anda tidak punya izin mengubah jadwal.' }

  const data = parseForm(formData)
  if (!data.title) return { error: 'Judul latihan wajib diisi.' }
  if (!data.start_time) return { error: 'Waktu mulai wajib diisi.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('training_schedules')
    .update(data)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/schedules')
  redirect('/dashboard/schedules')
}

export async function deleteSchedule(id: string): Promise<void> {
  const allowed = await checkPermission('schedules', 'delete')
  if (!allowed) throw new Error('Anda tidak punya izin menghapus jadwal.')

  const supabase = await createClient()
  const { error } = await supabase
    .from('training_schedules')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/schedules')
}
