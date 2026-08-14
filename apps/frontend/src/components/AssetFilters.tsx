'use client';

import type { AssetType } from '@/lib/types/assets.types';

interface AssetFiltersProps {
  selected: AssetType | undefined;
  onSelect: (type: AssetType | undefined) => void;
}

export default function AssetFilters({
  selected,
  onSelect,
}: AssetFiltersProps) {
  return (
    <div>
      <button onClick={() => onSelect(undefined)}>All</button>
      <button onClick={() => onSelect('AUDIO')}>Audio</button>
      <button onClick={() => onSelect('VIDEO')}>Video</button>
    </div>
  );
}
