import Link from 'next/link';
import MediaUploader from '@/components/media/media-uploader';

export default function CreatePage() {
  return <main className="min-h-screen bg-gray-50 p-4 md:p-8"><div className="mx-auto max-w-2xl"><Link href="/" className="text-sm font-semibold text-gray-600">← Back to VibeSphere</Link><div className="mt-5"><MediaUploader /></div><div className="mt-4 rounded-2xl border bg-white p-5 text-sm text-gray-600"><b>Upload limits:</b> images up to 10 MB and videos up to 100 MB. Files are stored in your Supabase <code>media</code> bucket.</div></div></main>;
}
