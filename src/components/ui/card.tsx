import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

type ArticleCardProps = {
  title: string;
  slug: string;
  coverImage: string;
  createdAt: string; // ISO string
  content: string;
};

export default function ArticleCard({
  title,
  slug,
  coverImage,
  createdAt,
  content,
}: ArticleCardProps) {
  return (
    <Link href={`/kegiatan/${slug}`} className="block group">
      <article className="overflow-hidden rounded-lg shadow-sm transition hover:shadow-xl bg-white hover:scale-105">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500"
            priority
          />
        </div>

        <div className="p-4 sm:p-6">
          <time dateTime={createdAt} className="block text-xs text-gray-500">
            {format(new Date(createdAt), "dd MMM yyyy")}
          </time>

          <h3 className="mt-0.5 text-lg font-semibold text-gray-900 group-hover:underline">
            {title}
          </h3>

          {/* Render HTML content */}
          {/* <div className="mt-2 h-16">
            <div
              className="line-clamp-3 text-sm text-gray-600 prose prose-sm overflow-hidden"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div> */}
        </div>
      </article>
    </Link>
  );
}