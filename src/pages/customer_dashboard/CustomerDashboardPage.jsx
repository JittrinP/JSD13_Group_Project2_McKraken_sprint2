import CustomList from "../customer_dashboard/_components/CustomList"
import CustomerAddress from "../customer_dashboard/_components/CustomerAddress"

export default function CustomerDashboardPage() {
  return (
    <>
      <div className="bg-amber-100">This is Customer Dashboard Page
        <CustomList />
        <CustomerAddress />
      </div>
    </>
  );
}
