import CustomList from "../customer_dashboard/_components/CustomList";
export default function CustomerDashboardPage() {
  return (
    <>
      <div className="bg-tertiary min-h-screen">
        {/* Mock A-side คร่าวๆ แล้วไปทำ ด้านข้าง */}
        <div className="flex flex-row gap-2 p-6">
          {/* A-side desktop */}
          <div className="hidden md:flex md:w-80 border border-neutral/10 rounded-xl p-2">
            A-side customer dashboard
          </div>
          {/* A-side mobile ค่อยว่ากัน น่าจะต้องสอดเข้าไปใน component แต่ละอันมั้ย */}


          {/* รอ AsideCustomer dashboard */}
          {/* <AsideCustomer /> */}
          <CustomList />
        </div>
      </div>
    </>
  );
}
