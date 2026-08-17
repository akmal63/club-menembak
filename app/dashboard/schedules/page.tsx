import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { formatDateTime } from '@/lib/format'
import DeleteScheduleButton from '@/components/delete-schedule-button'

const STATUS_LABEL: Record<string, string> = {
  scheduled: 'Terjadwal',
  done: 'Selesai',
  cancelled: 'Dibatalkan',
}

export default async function SchedulesPage() {
  const supabase = await createClient()
  const { data: schedules } = await supabase
    .from('training_schedules')
    .select('*')
    .order('start_time', { ascending: true })

  const canCreate = await checkPermission('schedules', 'create')
  const canEdit = await checkPermission('schedules', 'edit')
  const canDelete = await checkPermission('schedules', 'delete')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Jadwal Latihan</h1>
        {canCreate && (
          <Link
            href="/dashboard/schedules/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Tambah Jadwal
          </Link>
        )}
      </div>

      {!schedules || schedules.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-8 text-center text-gray-500">
          Belum ada jadwal latihan.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Waktu Mulai</th>
                <th className="px-4 py-3 font-medium">Lokasi</th>
                <th className="px-4 py-3 font-medium">Instruktur</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {(canEdit || canDelete) && (
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.title}</td>
                  <td className="px-4 py-3">{formatDateTime(s.start_time)}</td>
                  <td className="px-4 py-3">{s.location ?? '-'}</td>
                  <td className="px-4 py-3">{s.instructor ?? '-'}</td>
                  <td className="px-4 py-3">{STATUS_LABEL[s.status] ?? s.status}</td>
                  {(canEdit || canDelete) && (
                    <td className="px-4 py-3 text-right space-x-3">
                      {canEdit && (
                        <Link
                          href={`/dashboard/schedules/${s.id}/edit`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                      )}
                      {canDelete && (
                        <DeleteScheduleButton id={s.id} title={s.title} />
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
