import PopShopBlog from "../components/PopShopBlog";
import mockShopBlog from "../assets/mockData/mockShopBlog";
export default function ShopBlogPage() {
  function formatBlogDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
  //เอา heroBlog มาจาก date ล่าสุด 1 ตัวมาแสดง
  const heroBlogs = [...mockShopBlog]
    .filter((shopblog) => shopblog.status === "published")
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .slice(0, 4);

  return (
    <>
      <div className="bg-tertiary font-display p-6 text-primary">
        <section className="md:flex flex-row">
          {/*Hero ซ้ายตัวใหญ่*/}
          {heroBlogs[0] && (
            <div className="w-full  md:w-[60%] mb-12">
              <img
                src={heroBlogs[0].cover_image}
                className="w-95 h-37 shrink-0 object-cover rounded-2xl md:w-169 md:h-72"
              />
              <div className="font-body mt-2 mb-2">
                {heroBlogs[0].category} ·{" "}
                {formatBlogDate(heroBlogs[0].created_at)}
              </div>

              <div className="font-bold text-3xl mb-3">
                {heroBlogs[0].title}
              </div>
              <div className="text-base">{heroBlogs[0].description}</div>
            </div>
          )}

          {/* hero ด้านข้าง */}
          <div className="w-full flex flex-col md:w-[40%] m-2 md:pl-4">
            {heroBlogs.slice(1).map((blog) => (
              <div key={blog._id} className="flex flex-row justify-between
              mb-4 gap-2">
                <div className="">
                  <div className="font-body mt-2 mb-2">
                    {blog.category} · {formatBlogDate(blog.created_at)}
                  </div>
                  <div> {blog.title}</div>
                </div>
                <img
                  src={blog.cover_image}
                  className="w-40 h-40 shrink-0 object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        </section>

        {/* PopShopBlog */}
        <PopShopBlog />
        {/* AllBlog */}
        <section>AllBlog</section>
      </div>
    </>
  );
}
