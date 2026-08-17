import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { formatDateTime } from '@/lib/format'
import DeleteEventButton from '@/components/delete-event-button'

const STATUS_LABEL: Record<string, string> = {
  upcoming: 'Akan Datang',
  ongoing: 'Berlangsung',
  finished: 'Selesai',
}

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true })

  const canCreate = await checkPermission('events', 'create')
  const canEdit = await checkPermission('events', 'edit')
  const canDelete = await checkPermission('events', 'delete')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Jadwal Kegiatan</h1>
        {canCreate && (
          <Link
            href="/dashboard/events/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Tambah Kegiatan
          </Link>
        )}
      </div>

      {!events || events.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-8 text-center text-gray-500">
          Belum ada kegiatan.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Nama Kegiatan</th>
                <th className="px-4 py-3 font-medium">Tanggal Mulai</th>
                <th className="px-4 py-3 font-medium">Lokasi</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {(canEdit || canDelete) && (
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{ev.title}</td>
                  <td className="px-4 py-3">{formatDateTime(ev.start_date)}</td>
                  <td className="px-4 py-3">{ev.location ?? '-'}</td>
                  <td className="px-4 py-3">{STATUS_LABEL[ev.status] ?? ev.status}</td>
                  {(canEdit || canDelete) && (
                    <td className="px-4 py-3 text-right space-x-3">
                      {canEdit && (
                        <Link
                          href={`/dashboard/events/${ev.id}/edit`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                      )}
                      {canDelete && (
                        <DeleteEventButton id={ev.id} title={ev.title} />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
