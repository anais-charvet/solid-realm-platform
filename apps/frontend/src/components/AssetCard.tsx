import { Asset } from '@/lib/types/assets.types';
import Link from 'next/link';

interface AssetCardProps {
  asset: Asset;
}

export default function AssetCard({ asset }: AssetCardProps) {
  return (
    <Link href={`/assets/${asset.id}`}>
      <div className="relative flex aspect-video w-full items-end justify-center bg-black"></div>
      <h3 className="heading-primary">{asset.title}</h3>
      <p className="label-base">{asset.type}</p>
    </Link>
  );
}
