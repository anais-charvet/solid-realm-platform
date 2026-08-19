'use client';

import { AssetType } from '@/lib/types/assets.types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { assetsService } from '@/lib/services/assets.service';

interface AssetUploadFormData {
  title: string;
  type: AssetType;
}

export default function AssetUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetUploadFormData>();

  const onSubmit = async (data: AssetUploadFormData) => {
    try {
      setLoading(true);
      setError('');

      if (!file) return;

      const { uploadUrl, fileKey } = await assetsService.getUploadUrl(
        file.type,
      );

      await assetsService.uploadFileToR2(uploadUrl, file);

      const asset = await assetsService.createAsset({
        title: data.title,
        type: data.type,
        fileKey,
      });

      router.push(`/assets/${asset.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <div className="card-container">
        <div className="text-center">
          <h1 className="heading-primary">Upload an item</h1>
        </div>

        <form className="form-spacing" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="alert-error">
              <p className="alert-error-text">{error}</p>
            </div>
          )}

          <div>
            <label className="label-base" htmlFor="title">
              Title
            </label>
            <input
              autoComplete="off"
              className="input-base"
              id="title"
              placeholder="Title"
              type="text"
              {...register('title')}
            />
            {errors.title && (
              <p className="error-message">{errors.title?.message}</p>
            )}
          </div>

          <div>
            <label className="label-base" htmlFor="type">
              Type
            </label>
            <select className="input-base" id="type" {...register('type')}>
              <option value="">Select type</option>
              <option value="AUDIO">Audio</option>
              <option value="VIDEO">Video</option>
            </select>
            {errors.type && (
              <p className="error-message">{errors.type?.message}</p>
            )}
          </div>

          <input
            type="file"
            accept="audio/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button className="btn-primary" disabled={loading} type="submit">
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </main>
  );
}
