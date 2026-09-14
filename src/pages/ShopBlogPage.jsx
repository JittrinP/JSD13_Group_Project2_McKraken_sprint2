import PopShopBlog from "../components/PopShopBlog";
import mockShopBlog from "../assets/mockData/mockShopBlog";

// "Oct 12"
function formatBlogDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// guide -> "GUIDE", behind_the_scenes -> "BEHIND THE SCENES"
const CATEGORY_LABELS = {
  guide: "GUIDE",
  behind_the_scenes: "BEHIND THE SCENES",
  inspiration: "INSPIRATION",
};
function formatCategory(category) {
  return CATEGORY_LABELS[category] ?? String(category ?? "").toUpperCase();
}

export default function ShopBlogPage() {
  // เอาเฉพาะบทความที่เผยแพร่แล้ว เรียงจากใหม่ไปเก่า
  const publishedBlogs = [...mockShopBlog]
    .filter((shopblog) => shopblog.status === "published")
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

  // hero = ตัวล่าสุด 1 ตัว + ลิสต์ด้านข้าง 3 ตัว
  const [heroBlog, ...sideBlogs] = publishedBlogs.slice(0, 4);

  return (
    <div className="bg-background font-body text-primary">
      {/* Hero */}
      <section className="bg-accent">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 md:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:gap-10">
            {/* Hero ซ้ายตัวใหญ่ */}
            {heroBlog && (
              <article className="md:w-3/5">
                <img
                  src={heroBlog.cover_image}
                  alt={heroBlog.title}
                  className="aspect-7/3 w-full rounded-2xl bg-accent object-cover"
                />
                <p className="mt-4 text-xs tracking-wide text-neutral/70">
                  {formatCategory(heroBlog.category)} ·{" "}
                  {formatBlogDate(heroBlog.published_at)}
                </p>
                <h1 className="mt-2 font-display text-2xl font-bold leading-snug md:text-4xl">
                  {heroBlog.title}
                </h1>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-neutral/80 md:text-base">
                  {heroBlog.description}
                </p>
              </article>
            )}

            {/* Hero ด้านข้าง 3 ตัว */}
            {sideBlogs.length > 0 && (
              <div className="flex flex-col gap-5 md:w-2/5">
                {sideBlogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="flex flex-row justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-xs tracking-wide text-neutral/70">
                        {formatCategory(blog.category)} ·{" "}
                        {formatBlogDate(blog.published_at)}
                      </p>
                      <h2 className="mt-1 line-clamp-3 font-display text-base leading-snug md:text-lg">
                        {blog.title}
                      </h2>
                    </div>
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="size-28 shrink-0 rounded-xl bg-accent object-cover md:size-40"
                    />
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Blog + All Blog */}
      <PopShopBlog
        formatBlogDate={formatBlogDate}
        formatCategory={formatCategory}
      />
    </div>
  );
}
