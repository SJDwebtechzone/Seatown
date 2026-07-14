// import Image from "next/image";

// interface PageProps {
//   params: {
//     slug: string;
//   };
// }

// export default async function BlogPost({ params }: PageProps) {
//   const res = await fetch(
//     `http://localhost:5000/api/public/blogs/${params.slug}`,
//     {
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     return <h1>Blog not found</h1>;
//   }

//   const data = await res.json();

//   const blog = data.blog;

//   return (
//     <main>
//       <h1>{blog.title}</h1>

//       <Image src={blog.featured_image} alt={blog.title} width={800} height={400} />

//       <p>{blog.author}</p>

//       <div>{blog.content}</div>
//     </main>
//   );
// }

import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

interface Blog {
  title: string;
  author: string;
  featured_image: string | null;
  content: string;
  category?: string;
  published_at?: string;
  created_at?: string;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/public/blogs/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json().catch(() => null);
    if (!data?.success || !data?.blog) return null;

    return data.blog as Blog;
  } catch (err) {
    console.error("Failed to fetch blog post:", err);
    return null;
  }
}

// Normalize image path the same way we did for review photos —
// bare relative paths (no leading slash, no protocol) crash next/image.
function normalizeImagePath(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `/${path}`;
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const imageSrc = normalizeImagePath(blog.featured_image);
  const dateLabel = blog.published_at || blog.created_at
    ? new Date(blog.published_at || blog.created_at || "").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {blog.category && (
        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-md mb-5">
          {blog.category}
        </span>
      )}

      <h1 className="text-3xl md:text-5xl font-black text-primary leading-tight mb-5">
        {blog.title}
      </h1>

      <div className="flex items-center gap-3 text-sm text-gray-500 font-semibold mb-10">
        {/* <span>{blog.author}{"Seatown"}</span> */}
  <span>{"Seatown"}</span>
        {dateLabel && (
          <>
            <span className="w-1 h-1 rounded-full bg-gray-400" />
            <span>{dateLabel}</span>
          </>
        )}
      </div>

      {imageSrc ? (
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg mb-10">
          <Image
            src={imageSrc}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      {/* FIX: blog.content is HTML from the CMS/editor, so it needs
          dangerouslySetInnerHTML to render as formatted content instead
          of showing raw tags as visible text. */}
      <article
        className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-primary prose-a:text-accent"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </main>
  );
}
