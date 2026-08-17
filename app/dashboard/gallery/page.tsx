import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { checkPermission } from '@/lib/permissions'
import { formatDate } from '@/lib/format'
import GalleryUpload from '@/components/gallery-upload'
import DeletePhotoButton from '@/components/delete-photo-button'

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data: photos } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  const canCreate = await checkPermission('gallery', 'create')
  const canDelete = await checkPermission('gallery', 'delete')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Galeri Foto</h1>

      {canCreate && <GalleryUpload />}

      {!photos || photos.length === 0 ? (
        <div className="bg-white rounded-xl shadow border p-8 text-center text-gray-500">
          Belum ada foto.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative bg-white rounded-xl shadow border overflow-hidden group"
            >
              <div className="relative aspect-square">
                <Image
                  src={photo.image_url}
                  alt={photo.title ?? 'Foto galeri'}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              {canDelete && (
                <DeletePhotoButton id={photo.id} imageUrl={photo.image_url} />
              )}
              <div className="p-2">
                <p className="text-sm font-medium truncate">
                  {photo.title ?? 'Tanpa judul'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(photo.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
