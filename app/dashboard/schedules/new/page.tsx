import Link from 'next/link'
import { checkPermission } from '@/lib/permissions'
import ScheduleForm from '@/components/schedule-form'
import { createSchedule } from '../actions'

export default async function NewSchedulePage() {
  const canCreate = await checkPermission('schedules', 'create')

  if (!canCreate) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Tambah Jadwal</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Anda tidak punya izin untuk menambah jadwal.{' '}
          <Link href="/dashboard/schedules" className="underline">Kembali</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tambah Jadwal Latihan</h1>
      <ScheduleForm action={createSchedule} submitLabel="Simpan" />
    </div>
  )
}
