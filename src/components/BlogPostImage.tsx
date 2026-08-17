"use client";

import { useState } from "react";
import type { BlogImage } from "@/data/blog";

type BlogPostImageProps = {
  image: BlogImage;
  /** Float right with text wrap in article body. */
  float?: boolean;
  /** Shown in the dashed slot before you add the file. */
  placeholderHint?: string;
  className?: string;
};

/**
 * Renders the post image when the file exists; otherwise a labeled drop-slot.
 * Drop WebP (or JPG) at the path in `image.src` under public/.
 */
export function BlogPostImage({
  image,
  float = false,
  placeholderHint,
  className = "",
}: BlogPostImageProps) {
  const [failed, setFailed] = useState(false);
  const [jpgFailed, setJpgFailed] = useState(false);

  const webpSrc = image.src.replace(/\.(jpe?g|png)$/i, ".webp");
  const jpgSrc = image.src.replace(/\.webp$/i, ".jpg");
  const activeSrc = failed ? (jpgFailed ? null : jpgSrc) : webpSrc;

  const shell = float
    ? "blog-float-image"
    : "blog-hero-image";

  if (!activeSrc) {
    return (
      <figure className={`${shell} ${className}`.trim()}>
        <div className="blog-image-slot" role="img" aria-label={image.alt}>
          <div className="blog-image-slot-label">Image slot</div>
          <div className="blog-image-slot-path">
            {placeholderHint ?? `Add ${webpSrc} (or .jpg)`}
          </div>
        </div>
        {image.caption ? (
          <figcaption className="blog-image-caption">{image.caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className={`${shell} ${className}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element -- intentional drop-in public assets with onError fallback */}
      <img
        src={activeSrc}
        alt={image.alt}
        className="blog-image-media"
        loading={float ? "lazy" : "eager"}
        onError={() => {
          if (!failed) setFailed(true);
          else setJpgFailed(true);
        }}
      />
      {image.caption ? (
        <figcaption className="blog-image-caption">{image.caption}</figcaption>
      ) : null}
    </figure>
  );
}
