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

interface AssetUploadFormProps {
  onCreated?: () => void | Promise<void>;
}

const ALLOWED_FILES = /\.(mp3|m4a|wav|ogg|mp4|webm)$/i;

export default function AssetUploadForm({ onCreated }: AssetUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssetUploadFormData>();

  const onSubmit = async (data: AssetUploadFormData) => {
    try {
      setLoading(true);
      setError('');

      if (!file) {
        setError('Please select a file.');
        return;
      }

      const { uploadUrl, fileKey } = await assetsService.getUploadUrl(
        file.type,
      );

      await assetsService.uploadFileToR2(uploadUrl, file);

      const asset = await assetsService.createAsset({
        title: data.title,
        type: data.type,
        fileKey,
      });

      if (onCreated) {
        await onCreated();
        reset();
        setFile(null);
        setFileInputKey((k) => k + 1);
      } else {
        router.push(`/assets/${asset.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-container">
      <div className="text-center">
        <h2 className="heading-primary">Upload an item</h2>
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
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="error-message">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="label-base" htmlFor="type">
            Type
          </label>
          <select
            className="input-base"
            id="type"
            {...register('type', { required: 'Type is required' })}
          >
            <option value="">Select type</option>
            <option value="AUDIO">Audio</option>
            <option value="VIDEO">Video</option>
          </select>
          {errors.type && (
            <p className="error-message">{errors.type.message}</p>
          )}
        </div>

        <input
          key={fileInputKey}
          type="file"
          accept=".mp3,.m4a,.wav,.ogg,.mp4,.webm"
          onChange={(e) => {
            const selected = e.target.files?.[0] || null;
            if (selected && !ALLOWED_FILES.test(selected.name)) {
              setError(
                'Unsupported format. Use MP3, M4A, WAV, OGG, MP4 or WebM.',
              );
              setFile(null);
              e.target.value = '';
              return;
            }
            setError('');
            setFile(selected);
          }}
        />

        <button className="btn-primary" disabled={loading} type="submit">
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
