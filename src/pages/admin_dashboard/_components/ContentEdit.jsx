import React, { useState, useMemo, useCallback, memo } from "react";
import mockShopBlog from "../../../assets/mockData/mockShopBlog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ImageIcon,
  Search,
  Star,
  ChevronDown,
} from "lucide-react";

const CATEGORY_STYLES = {
  guide: "bg-[#FFF6ED] text-[#C25E00]",
  behind_the_scenes: "bg-[#F3F4F6] text-[#4B5563]",
  inspiration: "bg-[#FEFCE8] text-[#854D0E]",
};

const EMPTY_FORM = {
  _id: "",
  title: "",
  category: "guide",
  status: "published",
  is_popular: false,
  cover_image: "",
  description: "",
  content: "",
};

// ==========================================
// 1. DATA HOOK
// ==========================================
function useBlogData() {
  const [blogs, setBlogs] = useState(mockShopBlog);

  const addBlog = useCallback((data) => {
    setBlogs((prev) => [{ ...data, _id: `shb${Date.now()}` }, ...prev]);
  }, []);

  const updateBlog = useCallback((data) => {
    setBlogs((prev) =>
      prev.map((b) =>
        b._id === data._id
          ? { ...data, updated_at: new Date().toISOString() }
          : b,
      ),
    );
  }, []);

  const deleteBlog = useCallback((id) => {
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  }, []);

  return { blogs, addBlog, updateBlog, deleteBlog };
}

const SelectInput = memo(({ value, onChange, options, className = "" }) => (
  <div className={`relative w-full ${className}`}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-white border border-neutral-200/50 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#475486] focus:outline-none focus:ring-1 focus:ring-[#475486]/30 cursor-pointer pr-9 shadow-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-3.5 text-neutral-400 pointer-events-none" />
  </div>
));
SelectInput.displayName = "SelectInput";

// ==========================================
// 2. FORM MODAL COMPONENT (Soft Borders)
// ==========================================
const ArticleFormModal = memo(({ isOpen, onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData);

  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  const isEditing = Boolean(formData._id);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData, isEditing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-6 sm:p-8 relative my-8 border border-neutral-200/40 shadow-xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 text-neutral-400"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="mb-6">
          <span className="text-[11px] font-bold text-neutral-400 uppercase">
            {isEditing ? "EDIT PUBLICATION" : "NEW PUBLICATION"}
          </span>
          <h2 className="font-serif text-3xl text-[#475486] mt-1">
            {isEditing ? "Edit Article" : "Create New Article"}
          </h2>
        </div>

        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <Label className="text-[11px] font-bold text-neutral-500 uppercase">
              Article Title *
            </Label>
            <Input
              required
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="bg-[#FBF9F6] border-neutral-200/40 focus:border-neutral-300 rounded-xl h-11 text-[#475486] shadow-none focus-visible:ring-1 focus-visible:ring-[#475486]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-bold text-neutral-500 uppercase">
                Cover Image URL
              </Label>
              <Input
                value={formData.cover_image}
                onChange={(e) => handleChange("cover_image", e.target.value)}
                className="bg-[#FBF9F6] border-neutral-200/40 focus:border-neutral-300 rounded-xl h-11 text-[#475486] shadow-none focus-visible:ring-1 focus-visible:ring-[#475486]/20"
              />
            </div>
            <div>
              <Label className="text-[11px] font-bold text-neutral-500 uppercase">
                Category
              </Label>
              <SelectInput
                value={formData.category}
                onChange={(val) => handleChange("category", val)}
                options={[
                  { value: "guide", label: "Guide" },
                  { value: "behind_the_scenes", label: "Behind The Scenes" },
                  { value: "inspiration", label: "Inspiration" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] font-bold text-neutral-500 uppercase">
                Publish Status
              </Label>
              <SelectInput
                value={formData.status}
                onChange={(val) => handleChange("status", val)}
                options={[
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                ]}
              />
            </div>
            <div className="flex items-center space-x-3 rounded-xl border border-neutral-200/40 p-3 bg-[#FBF9F6] mt-auto h-11">
              <Checkbox
                id="is_popular"
                checked={formData.is_popular}
                onCheckedChange={(checked) =>
                  handleChange("is_popular", checked)
                }
                className="border-neutral-200 rounded-md data-[state=checked]:bg-[#475486] data-[state=checked]:border-[#475486]"
              />
              <Label
                htmlFor="is_popular"
                className="text-xs font-semibold text-[#475486] cursor-pointer"
              >
                Featured in Popular Blog{" "}
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
              </Label>
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-bold text-neutral-500 uppercase">
              Short Description
            </Label>
            <Input
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="bg-[#FBF9F6] border-neutral-200/40 focus:border-neutral-300 rounded-xl h-11 shadow-none focus-visible:ring-1 focus-visible:ring-[#475486]/20"
            />
          </div>

          <div>
            <Label className="text-[11px] font-bold text-neutral-500 uppercase">
              Main Content
            </Label>
            <Textarea
              rows={4}
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              className="bg-[#FBF9F6] border-neutral-200/40 focus:border-neutral-300 rounded-xl shadow-none focus-visible:ring-1 focus-visible:ring-[#475486]/20"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-neutral-200/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#475486] hover:bg-[#38436c] text-white rounded-xl px-6"
            >
              {isEditing ? "Save Changes" : "+ Publish Article"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});
ArticleFormModal.displayName = "ArticleFormModal";

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function ContentEdit() {
  const { blogs, addBlog, updateBlog, deleteBlog } = useBlogData();
  const [activeBlog, setActiveBlog] = useState(EMPTY_FORM);
  const [isOpen, setIsOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredBlogs = useMemo(() => {
    const query = search.toLowerCase().trim();
    return blogs.filter((b) => {
      const matchSearch =
        !query ||
        b.title?.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query);
      const matchCat = category === "all" || b.category === category;
      const matchStatus = status === "all" || b.status === status;
      return matchSearch && matchCat && matchStatus;
    });
  }, [blogs, search, category, status]);

  const stats = useMemo(
    () => ({
      total: blogs.length,
      published: blogs.filter((b) => b.status === "published").length,
      draft: blogs.filter((b) => b.status === "draft").length,
      popular: blogs.filter((b) => b.is_popular).length,
    }),
    [blogs],
  );

  const handleOpenModal = useCallback((blog = EMPTY_FORM) => {
    setActiveBlog(blog);
    setIsOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmitModal = useCallback(
    (data, isEditing) => {
      isEditing ? updateBlog(data) : addBlog(data);
    },
    [addBlog, updateBlog],
  );

  const handleDelete = useCallback(
    (id) => {
      if (confirm("Are you sure you want to delete this article?")) {
        deleteBlog(id);
      }
    },
    [deleteBlog],
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-4 sm:p-8 text-neutral-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-neutral-200/40 shadow-none">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl text-[#475486]">
                Articles & Stories
              </h1>
              <Badge className="bg-[#475486]/10 text-[#475486] border-0">
                {stats.total} Total
              </Badge>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Manage, curate, and publish botanical stories and workshop guides.
            </p>
            <div className="flex gap-4 text-xs text-neutral-500 mt-2 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                {stats.published} Published
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                {stats.draft} Draft
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {stats.popular} Featured
              </span>
            </div>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-[#475486] hover:bg-[#38436c] text-white rounded-xl px-5 py-2.5 shadow-none"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create Article
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
            <Input
              placeholder="Search title..."
              className="pl-9 bg-white border border-neutral-200/50 rounded-xl text-sm h-10 text-[#475486] shadow-none focus-visible:ring-1 focus-visible:ring-[#475486]/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <SelectInput
            value={category}
            onChange={setCategory}
            options={[
              { value: "all", label: "All Categories" },
              { value: "guide", label: "Guide" },
              { value: "behind_the_scenes", label: "Behind The Scenes" },
              { value: "inspiration", label: "Inspiration" },
            ]}
          />
          <SelectInput
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
          <SelectInput
            value="newest"
            onChange={() => {}}
            options={[{ value: "newest", label: "Newest First" }]}
          />
        </div>

        {/* Table Container - Ultralight Soft Border */}
        <Card className="border border-neutral-200/40 shadow-none bg-white rounded-3xl ring-0 ring-transparent overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-neutral-50/40 border-b border-neutral-100">
                <TableRow className="border-b border-neutral-100/70 hover:bg-transparent">
                  <TableHead className="w-12 pl-6">
                    <Checkbox className="rounded-md border-neutral-200" />
                  </TableHead>
                  <TableHead className="w-16 text-[11px] font-bold text-neutral-400">
                    COVER
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-neutral-400">
                    TITLE & STORY DETAIL
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-neutral-400">
                    CATEGORY
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-neutral-400">
                    STATUS
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-neutral-400">
                    EDITORIAL PICK
                  </TableHead>
                  <TableHead className="text-right pr-6 text-[11px] font-bold text-neutral-400">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlogs.map((b) => (
                  <TableRow
                    key={b._id}
                    className="hover:bg-neutral-50/30 border-b border-neutral-100/60"
                  >
                    <TableCell className="pl-6">
                      <Checkbox className="rounded-md border-neutral-200" />
                    </TableCell>
                    <TableCell>
                      {b.cover_image ? (
                        <img
                          src={b.cover_image}
                          alt={b.title}
                          className="w-10 h-10 object-cover rounded-xl border border-neutral-100"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-neutral-100/60 rounded-xl flex items-center justify-center text-neutral-400">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-serif font-medium text-[#475486] line-clamp-1">
                        {b.title}
                      </div>
                      <div className="text-xs text-neutral-400 line-clamp-1">
                        {b.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize rounded-lg px-2.5 py-1 text-xs font-normal border-0 ${
                          CATEGORY_STYLES[b.category] || "bg-neutral-100"
                        }`}
                      >
                        {b.category?.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium capitalize">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.status === "published"
                              ? "bg-emerald-600"
                              : "bg-neutral-400"
                          }`}
                        />
                        {b.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      {b.is_popular ? (
                        <div className="inline-flex items-center gap-1 bg-[#FFFBEB] text-[#B45309] rounded-md px-2 py-0.5 text-xs">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />{" "}
                          Popular
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-300">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6 space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenModal(b)}
                        className="h-8 w-8 text-neutral-400 hover:text-[#475486]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(b._id)}
                        className="h-8 w-8 text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Standalone Memoized Form Modal */}
      <ArticleFormModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        initialData={activeBlog}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}
