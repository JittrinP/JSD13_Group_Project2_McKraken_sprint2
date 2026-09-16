import { useMemo, useState } from "react";
import { Camera } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

const inputClass =
  "w-full rounded-[8px] border border-[#E0E0E0] bg-[#F7F7F7] px-[14px] py-[10px] " +
  "font-['Plus_Jakarta_Sans',sans-serif] text-[14px] text-[#3A3A3A] outline-none transition " +
  "focus:border-[#3F4B3B] disabled:cursor-not-allowed disabled:bg-[#F7F7F7] disabled:opacity-70";

function Field({ label, className = "", children }) {
  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      <label className="font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-semibold text-[#3A3A3A]">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CustomerAccount() {
  const { user: currentUser } = useAuth();

  const currentUserData = useMemo(() => currentUser, [currentUser]);

  const defaultAddress = currentUserData?.shipping_addresses?.find(
    (address) => address.is_default,
  );

  const buildFormFromUser = (u, addr) => ({
    firstName: u.profile.first_name ?? "",
    lastName: u.profile.last_name ?? "",
    address: addr?.address ?? "",
    city: addr?.district ?? "",
    // ps: ยังไม่มี field วันเกิดใน ER diagram / mockUser
    // ถ้าจะเก็บจริง ต้องเพิ่ม date_of_birth เข้าไปใน USERS entity 
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    gender: u.profile.gender ?? "",
    contacts: u.phone_number ?? "",
    email: u.email ?? "",
    password: "",
    confirmPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(() =>
    buildFormFromUser(currentUserData, defaultAddress),
  );

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setForm(buildFormFromUser(currentUserData, defaultAddress));
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: ต่อ API จริง / เรียก context เพื่ออัปเดตข้อมูล user ตรงนี้
    console.log("Saving profile:", form);
    setIsEditing(false);
  };

  return (
    <div className="w-full rounded-[12px] border border-[rgba(219,217,217,0.5)] bg-white p-[20px] lg:p-[32px]">
      <h1 className="mb-[24px] font-['Playfair_Display',serif] text-[22px] font-semibold text-[#3A3A3A] lg:text-[26px]">
        My Account
      </h1>

      <form onSubmit={handleSave} className="flex flex-col gap-[28px]">
        {/* Avatar */}
        <div className="flex items-center gap-[16px]">
          <div className="relative size-[64px] shrink-0 overflow-hidden rounded-full bg-[#EDEDED]">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-[#B0B0B0]">
                <Camera size={22} />
              </div>
            )}
          </div>
          <div>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[16px] font-semibold text-[#3A3A3A]">
              {currentUser.profile.first_name} {currentUser.profile.last_name}
            </p>
            <label
              htmlFor="avatar-upload"
              className={`text-[13px] underline underline-offset-2 ${
                isEditing
                  ? "cursor-pointer text-[#8A8A8A] hover:text-[#3F4B3B]"
                  : "cursor-not-allowed text-[#C7C7C7]"
              }`}
            >
              Edit display image
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={!isEditing}
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 gap-x-[40px] gap-y-[20px] lg:grid-cols-2">
          <Field label="First Name">
            <input
              className={inputClass}
              value={form.firstName}
              onChange={handleChange("firstName")}
              disabled={!isEditing}
            />
          </Field>

          <Field label="Last Name">
            <input
              className={inputClass}
              value={form.lastName}
              onChange={handleChange("lastName")}
              disabled={!isEditing}
            />
          </Field>

          <Field label="Address">
            <input
              className={inputClass}
              value={form.address}
              onChange={handleChange("address")}
              disabled={!isEditing}
            />
          </Field>

          <Field label="City">
            <input
              className={inputClass}
              value={form.city}
              onChange={handleChange("city")}
              disabled={!isEditing}
            />
          </Field>

          <div className="flex gap-[12px]">
            <Field label="Date of Birth" className="flex-[2]">
              <div className="flex gap-[8px]">
                <input
                  className={inputClass}
                  placeholder="DD"
                  value={form.dobDay}
                  onChange={handleChange("dobDay")}
                  disabled={!isEditing}
                />
                <input
                  className={inputClass}
                  placeholder="MM"
                  value={form.dobMonth}
                  onChange={handleChange("dobMonth")}
                  disabled={!isEditing}
                />
                <input
                  className={inputClass}
                  placeholder="YYYY"
                  value={form.dobYear}
                  onChange={handleChange("dobYear")}
                  disabled={!isEditing}
                />
              </div>
            </Field>

            <Field label="Gender" className="flex-1">
              <select
                className={inputClass}
                value={form.gender}
                onChange={handleChange("gender")}
                disabled={!isEditing}
              >
                <option value="">-</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>

          <Field label="Contacts">
            <input
              className={inputClass}
              value={form.contacts}
              onChange={handleChange("contacts")}
              disabled={!isEditing}
            />
          </Field>

          <Field label="E-mail">
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={handleChange("email")}
              disabled={!isEditing}
            />
          </Field>
          <div className="hidden lg:block" />

          <Field label="Password">
            <input
              type="password"
              className={inputClass}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange("password")}
              disabled={!isEditing}
            />
          </Field>
          <div className="hidden lg:block" />

          <Field label="Re-Enter Password">
            <input
              type="password"
              className={inputClass}
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              disabled={!isEditing}
            />
          </Field>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-[12px]">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-[8px] border border-[#E0E0E0] px-[24px] py-[10px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-semibold text-[#4A4A4A] transition hover:bg-[#F2F2F2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-[8px] bg-[#3F4B3B] px-[24px] py-[10px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-semibold text-white transition hover:opacity-90"
              >
                Save
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-[8px] bg-[#3F4B3B] px-[24px] py-[10px] font-['Plus_Jakarta_Sans',sans-serif] text-[14px] font-semibold text-white transition hover:opacity-90"
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}