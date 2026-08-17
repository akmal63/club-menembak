import Link from 'next/link'
import { checkPermission } from '@/lib/permissions'
import EventForm from '@/components/event-form'
import { createEvent } from '../actions'

export default async function NewEventPage() {
  const canCreate = await checkPermission('events', 'create')

  if (!canCreate) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Tambah Kegiatan</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin untuk menambah kegiatan.{' '}
          <Link href="/dashboard/events" className="underline">Kembali</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tambah Kegiatan</h1>
      <EventForm action={createEvent} submitLabel="Simpan" />
    </div>
  )
}
