import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { optimizeImage } from "../lib/utils";

const PAGE_SIZE = 6;

const api_url = import.meta.env.VITE_API_URL;

export default function PopShopBlog({ 
  formatBlogDate = (date) => date || "", 
  formatCategory = (category) => category || "" 
}) {

  const [blogs, setBlogs] = useState([]);
  
    useEffect(() => {
      async function fetchBlogs() {
        try {
          const response = await fetch(`${api_url}/api/v1/blog`);
          const data = await response.json();
          setBlogs(data);
        } catch (err) {
          setError("โหลดข้อมูลไม่สำเร็จ ลองเช็คว่า server รันอยู่หรือเปล่า");
        }
      }
      fetchBlogs();
    }, []);

  const publishedBlogs = [...blogs]
    .filter((blog) => blog.status === "published")
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

  const popBlogs = useMemo(
    () => publishedBlogs.filter((blog) => blog.is_popular).slice(0, 3),
    [publishedBlogs]
  );
  const allBlogs = publishedBlogs;

  const pageCount = Math.max(1, Math.ceil(allBlogs.length / PAGE_SIZE));
  const [page, setPage] = useState(0);
  const goTo = (n) => setPage(Math.min(pageCount - 1, Math.max(0, n)));
  const pageBlogs = allBlogs.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  // All Blog จะโผล่ออกมาเมื่อกด "View all blog"
  const [isAllBlog, setIsAllBlog] = useState(false);
  function viewAllBlog() {
    setIsAllBlog((prev) => !prev);
  }

  const meta = (blog) =>
    `${formatCategory(blog.category)} · ${formatBlogDate(blog.published_at)}`;

  return (
    <>
      {/* Popular Blog */}
      <section className="bg-tertiary">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 md:py-14">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Popular Blog
            </h2>
            <button
              type="button"
              onClick={viewAllBlog}
              className="shrink-0 font-body text-sm text-neutral/80 hover:text-primary"
            >
              {isAllBlog ? "Hide all blog" : "View all blog"}
            </button>
          </div>

          {/* จอเล็ก: ลิสต์แนวนอน */}
          <div className="mt-4 flex flex-col gap-5 md:hidden">
            {popBlogs.map((blog) => (
              <BlogListItem key={blog._id} blog={blog} meta={meta} />
            ))}
          </div>

          {/* จอใหญ่: การ์ด 3 ใบ */}
          <div className="mt-6 hidden gap-6 md:grid md:grid-cols-3">
            {popBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} meta={meta} />
            ))}
          </div>
        </div>
      </section>

      {/* All Blog — โชว์เมื่อกด View all blog */}
      {isAllBlog && (
        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 md:py-14">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              All Blog
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 md:gap-y-10">
              {pageBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} meta={meta} />
              ))}
            </div>

            {pageCount > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => goTo(page - 1)}
                  disabled={page === 0}
                  aria-label="Previous page"
                  className="text-primary transition hover:opacity-60 disabled:opacity-30"
                >
                  <ChevronLeft className="size-5" />
                </button>

                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Page ${i + 1}`}
                    aria-current={i === page}
                    className={`size-3 rounded-full transition-colors ${
                      i === page
                        ? "bg-primary"
                        : "bg-neutral/25 hover:bg-neutral/40"
                    }`}
                  />
                ))}

                <button
                  type="button"
                  onClick={() => goTo(page + 1)}
                  disabled={page === pageCount - 1}
                  aria-label="Next page"
                  className="text-primary transition hover:opacity-60 disabled:opacity-30"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

// การ์ดบทความ: รูปอยู่บน (Popular จอใหญ่ + All Blog)
function BlogCard({ blog, meta }) {
  return (
    <article className="flex flex-col gap-3">
      <img
        src={optimizeImage(blog.cover_image, 480)}
        alt={blog.title}
        loading="lazy"
        className="aspect-368/230 w-full rounded-2xl bg-accent object-cover"
      />
      <div>
        <p className="text-xs tracking-wide text-neutral/70">{meta(blog)}</p>
        <h3 className="mt-1 font-display text-lg leading-snug">{blog.title}</h3>
      </div>
    </article>
  );
}

// รายการบทความ: ข้อความซ้าย รูปสี่เหลี่ยมขวา (Popular จอเล็ก)
function BlogListItem({ blog, meta }) {
  return (
    <article className="flex flex-row justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs tracking-wide text-neutral/70">{meta(blog)}</p>
        <h3 className="mt-1 line-clamp-3 font-display text-base leading-snug">
          {blog.title}
        </h3>
      </div>
      <img
        src={optimizeImage(blog.cover_image, 320)}
        alt={blog.title}
        loading="lazy"
        className="size-28 shrink-0 rounded-xl bg-accent object-cover"
      />
    </article>
  );
}
