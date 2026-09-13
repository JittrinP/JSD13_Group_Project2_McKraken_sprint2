import CustomList from "../customer_dashboard/_components/CustomList";
export default function CustomerDashboardPage() {
  return (
    <>
      <div className="bg-amber-100">
        {/* Mock A-side คร่าวๆ แล้วไปทำ ด้านข้าง */}
        <div className="flex flex-row gap-2">
          {/* A-side desktop */}
          <div className="hidden md:flex md:w-80 border-2 rounded-xl m-2 p-2">
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
