import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import EventForm from '@/components/event-form'
import { updateEvent } from '../../actions'

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const canEdit = await checkPermission('events', 'edit')

  if (!canEdit) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Edit Kegiatan</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin untuk mengubah kegiatan.{' '}
          <Link href="/dashboard/events" className="underline">Kembali</Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) notFound()

  const updateWithId = updateEvent.bind(null, id)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Kegiatan</h1>
      <EventForm
        action={updateWithId}
        initial={event}
        submitLabel="Simpan Perubahan"
      />
    </div>
  )
}
