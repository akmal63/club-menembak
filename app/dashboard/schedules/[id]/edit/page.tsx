import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import ScheduleForm from '@/components/schedule-form'
import { updateSchedule } from '../../actions'

export default async function EditSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const canEdit = await checkPermission('schedules', 'edit')

  if (!canEdit) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Edit Jadwal</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin untuk mengubah jadwal.{' '}
          <Link href="/dashboard/schedules" className="underline">Kembali</Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: schedule } = await supabase
    .from('training_schedules')
    .select('*')
    .eq('id', id)
    .single()

  if (!schedule) notFound()

  const updateWithId = updateSchedule.bind(null, id)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Jadwal Latihan</h1>
      <ScheduleForm
        action={updateWithId}
        initial={schedule}
        submitLabel="Simpan Perubahan"
      />
    </div>
  )
}
