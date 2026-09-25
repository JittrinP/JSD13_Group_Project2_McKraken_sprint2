"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, Pie, PieChart } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Link } from "react-router-dom";

import { useAdminOrders } from "../../../hooks/useAdminOrders"; // hook เดียวกับหน้า Orders ใช้ดึง Recent Order
import { api } from "../../../context/AuthContext"; // axios ที่แนบ cookie (token) ไปกับทุก request ให้อัตโนมัติ

// config ของ chart Sale Statistic
// เส้นเดียว: ยอดขายรายวัน (key "sales" ต้องตรงกับชื่อ field ที่ backend ส่งมา)
const SaleStatisticChartConfig = {
  sales: {
    label: "Sales (฿)",
    color: "var(--chart-1)",
  },
};

// config ของกราฟ Shipment Status: ชื่อ key ต้องตรงกับ order_status ใน order.model.js
const ShipmentStatusChartConfig = {
  orders: {
    label: "Orders",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-1)",
  },
  processing: {
    label: "Processing",
    color: "var(--chart-2)",
  },
  shipped: {
    label: "Shipped",
    color: "var(--chart-3)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-4)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--chart-5)",
  },
};


// config ของกราฟ Top 5 Flowers: ชื่อดอกไม้มาจาก backend (เปลี่ยนได้) เลยไม่ผูกสีกับชื่อ แต่ผูกสีกับอันดับแทน
const TopFlowersChartConfig = {
  quantity: {
    label: "Used",
  },
};

// สีของอันดับ 1-5 (อันดับ 1 ใช้สีแรก)
const TOP_FLOWER_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];


export default function Overview() {
  const [timeRange, setTimeRange] = React.useState("7d"); // ช่วงเวลาของกราฟ Sale Statistic เริ่มที่ 7 วัน

  // การ์ด 4 ใบบนสุด: ตัวเลขสรุป เริ่มเป็น 0 รอโหลดจาก backend
  const [summary, setSummary] = React.useState({
    totalSales: 0,
    totalCustomers: 0,
    flowerStock: 0,
    totalOrders: 0,
  });
  const [isSummaryLoading, setIsSummaryLoading] = React.useState(true); // true ระหว่างรอ backend ตอบ
  const [summaryError, setSummaryError] = React.useState(""); // ข้อความ error ถ้าโหลดไม่สำเร็จ

  // โหลดตัวเลขของการ์ด 4 ใบ ครั้งเดียวตอนเปิดหน้า
  React.useEffect(() => {
    async function fetchSummary() {
      setIsSummaryLoading(true);
      setSummaryError(""); // ล้าง error เก่าก่อนโหลดใหม่
      try {
        const res = await api.get("/dashboard/summary"); // ได้ { success, data: { totalSales, totalCustomers, flowerStock, totalOrders } }
        setSummary(res.data.data); // หน้าตาข้อมูลตรงกับ state อยู่แล้ว เก็บได้เลย
      } catch (err) {
        console.error(err);
        setSummaryError("Failed to load summary. Please try again."); // เอาไปแสดงใต้การ์ด
      } finally {
        setIsSummaryLoading(false); // สำเร็จหรือพังก็เลิกโหลด
      }
    }

    fetchSummary();
  }, []); // [] = ทำครั้งเดียวตอนเปิดหน้า

  // ยังไม่มีตัวเลขจริงให้แสดง (กำลังโหลด หรือโหลดไม่สำเร็จ) → การ์ดแสดง "-" แทน 0 จะได้ไม่เข้าใจผิดว่ายอดเป็น 0
  const showSummaryDash = isSummaryLoading || summaryError !== "";

  // Recent Order: ขอ order ใหม่สุด 10 รายการ (หน้า 1, ไม่กรอง) ส่ง limit เองเพื่อไม่ให้ผูกกับ PAGE_SIZE ของหน้า Orders
  const { orders: recentOrderList, isLoading, error } = useAdminOrders({
    page: 1,
    status: "all",
    search: "",
    limit: 10,
  });

  // Shipment Status: ข้อมูลกราฟวงกลม เริ่มเป็น array ว่าง รอโหลดจาก backend
  const [shipmentChartData, setShipmentChartData] = React.useState([]);
  const [isShipmentLoading, setIsShipmentLoading] = React.useState(true); // true ระหว่างรอ backend ตอบ
  const [shipmentError, setShipmentError] = React.useState(""); // ข้อความ error ถ้าโหลดไม่สำเร็จ

  // โหลดจำนวน order แยกตาม status ครั้งเดียวตอนเปิดหน้า
  React.useEffect(() => {
    async function fetchOrderStatusCount() {
      setIsShipmentLoading(true);
      setShipmentError(""); // ล้าง error เก่าก่อนโหลดใหม่
      try {
        const res = await api.get("/dashboard/order-status"); // ได้ { success, data: [{ status, count }, ...] }

        // แปลงเป็นหน้าตาที่กราฟใช้: orders = จำนวน, fill = สีตาม status จาก ShipmentStatusChartConfig
        const chartData = res.data.data.map((item) => {
          return {
            status: item.status,
            orders: item.count,
            fill: "var(--color-" + item.status + ")", // เช่น var(--color-pending)
          };
        });

        setShipmentChartData(chartData); // เก็บลง state แล้วกราฟจะวาดใหม่เอง
      } catch (err) {
        console.error(err);
        setShipmentError("Failed to load order status. Please try again."); // เอาไปแสดงในกล่องกราฟ
      } finally {
        setIsShipmentLoading(false); // สำเร็จหรือพังก็เลิกโหลด
      }
    }

    fetchOrderStatusCount();
  }, []); // [] = ทำครั้งเดียวตอนเปิดหน้า

  // รวมจำนวน order ทุก status ถ้าได้ 0 แปลว่ายังไม่มี order เลย (ใช้ตัดสินว่าจะแสดง "No orders")
  let totalShipmentOrders = 0;
  shipmentChartData.forEach((item) => {
    totalShipmentOrders = totalShipmentOrders + item.orders;
  });

  // Top 5 Flowers: ข้อมูลกราฟวงกลม เริ่มเป็น array ว่าง รอโหลดจาก backend
  const [topFlowersChartData, setTopFlowersChartData] = React.useState([]);
  const [isTopFlowersLoading, setIsTopFlowersLoading] = React.useState(true); // true ระหว่างรอ backend ตอบ
  const [topFlowersError, setTopFlowersError] = React.useState(""); // ข้อความ error ถ้าโหลดไม่สำเร็จ

  // โหลดดอกไม้ที่ถูกใช้มากที่สุด 5 อันดับ ครั้งเดียวตอนเปิดหน้า
  React.useEffect(() => {
    async function fetchTopFlowers() {
      setIsTopFlowersLoading(true);
      setTopFlowersError(""); // ล้าง error เก่าก่อนโหลดใหม่
      try {
        const res = await api.get("/dashboard/top-flowers"); // ได้ { success, data: [{ name, quantity }, ...] } เรียงมากไปน้อยแล้ว

        // แปลงเป็นหน้าตาที่กราฟใช้: เติม fill = สีตามอันดับ (index 0 = อันดับ 1)
        const chartData = res.data.data.map((item, index) => {
          return {
            name: item.name,
            quantity: item.quantity,
            fill: TOP_FLOWER_COLORS[index],
          };
        });

        setTopFlowersChartData(chartData); // เก็บลง state แล้วกราฟจะวาดใหม่เอง
      } catch (err) {
        console.error(err);
        setTopFlowersError("Failed to load top flowers. Please try again."); // เอาไปแสดงในกล่องกราฟ
      } finally {
        setIsTopFlowersLoading(false); // สำเร็จหรือพังก็เลิกโหลด
      }
    }

    fetchTopFlowers();
  }, []); // [] = ทำครั้งเดียวตอนเปิดหน้า

  // Sale Statistic: ยอดขายรายวัน เริ่มเป็น array ว่าง รอโหลดจาก backend
  const [salesChartData, setSalesChartData] = React.useState([]);
  const [isSalesLoading, setIsSalesLoading] = React.useState(true); // true ระหว่างรอ backend ตอบ
  const [salesError, setSalesError] = React.useState(""); // ข้อความ error ถ้าโหลดไม่สำเร็จ

  // โหลดยอดขายรายวันตามช่วงเวลาที่เลือก (backend กรองวันที่ให้ ไม่ต้องกรองในหน้าเว็บแล้ว)
  React.useEffect(() => {
    async function fetchSalesStatistic() {
      setIsSalesLoading(true);
      setSalesError(""); // ล้าง error เก่าก่อนโหลดใหม่
      try {
        // ส่ง range ไปใน URL เช่น /dashboard/sales?range=7d
        const res = await api.get("/dashboard/sales", { params: { range: timeRange } });
        setSalesChartData(res.data.data); // ได้ [{ date, sales, orders }, ...] หน้าตาตรงกับที่กราฟใช้ เก็บได้เลย
      } catch (err) {
        console.error(err);
        setSalesError("Failed to load sales. Please try again."); // เอาไปแสดงในกล่องกราฟ
      } finally {
        setIsSalesLoading(false); // สำเร็จหรือพังก็เลิกโหลด
      }
    }

    fetchSalesStatistic();
  }, [timeRange]); // [timeRange] = โหลดใหม่ทุกครั้งที่เปลี่ยน dropdown (ไม่ใช่แค่ครั้งเดียวแบบ [])

  // รวมยอดขายทุกวันในช่วงที่เลือก ถ้าได้ 0 แปลว่าช่วงนี้ไม่มียอดขายเลย (ใช้ตัดสินว่าจะแสดง "No sales")
  // ต้องรวมเอง เพราะ backend ส่งครบทุกวันเสมอ (วันที่ไม่มี order = 0) array จึงไม่เคยว่าง
  let totalSalesInRange = 0;
  salesChartData.forEach((day) => {
    totalSalesInRange = totalSalesInRange + day.sales;
  });

  return (
    <>
      <div className="font-display">
        <h1 className="text-4xl font-semibold">Overview</h1>
        <div className="bg-D-background p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-md border-neutral/20 justify-between  ">
            {/* Total Sales */}
            <Card className="bg-background shadow-md">
              <CardHeader>
                <CardTitle className="text-center font-heading text-lg">
                  Total Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* toLocaleString ใส่คอมมาให้ เช่น 25410 → 25,410 / maximumFractionDigits: 0 = ไม่แสดงทศนิยม */}
                <p className="text-center text-2xl font-semibold">
                  {showSummaryDash
                    ? "-"
                    : "฿" + summary.totalSales.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
              </CardContent>
            </Card>

            {/* Total Customer */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-center font-heading text-lg">
                  Total Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-2xl font-semibold">
                  {showSummaryDash ? "-" : summary.totalCustomers.toLocaleString("en-US")}
                </p>
              </CardContent>
            </Card>

            {/* Flower Stock (เดิม Total Products): สต๊อกดอกไม้รวมจาก inventory item */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-center font-heading text-lg">
                  Flower Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-2xl font-semibold">
                  {showSummaryDash ? "-" : summary.flowerStock.toLocaleString("en-US")}
                </p>
              </CardContent>
            </Card>

            {/* Total Orders */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-center font-heading text-lg">
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-2xl font-semibold">
                  {showSummaryDash ? "-" : summary.totalOrders.toLocaleString("en-US")}
                </p>
                {/* บอกให้ชัดว่านับ order ที่ถูกยกเลิกด้วย (ต่างจาก Total Sales ที่ไม่นับ) */}
                <p className="text-center text-xs text-[#8A91A0]">incl. cancelled orders</p>
              </CardContent>
            </Card>
          </div>

          {/* โหลดตัวเลขการ์ดไม่สำเร็จ (เช่น backend ล่ม หรือ session หมดอายุ) */}
          {summaryError && (
            <p className="mt-2 text-center text-sm text-[#9A4D4D]">{summaryError}</p>
          )}

          {/* Second row data */}
          <div className="flex flex-col md:flex-row gap-2">
            {/* Sale statistic graph */}
            <div className="mt-4 md:w-[70%] h-fit">
              <h2 className="text-2xl font-semibold">Sale Statistic</h2>
              <Card className="pt-0 mt-2 bg-background">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1">
                    <CardTitle>Daily Sales</CardTitle>
                    <CardDescription>
                      Paid orders, excluding cancelled
                    </CardDescription>
                  </div>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                      className="flex w-[80px] md:w-[160px] rounded-lg sm:ml-auto"
                      aria-label="Select a value"
                    >
                      <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="90d" className="rounded-lg">
                        Last 3 months
                      </SelectItem>
                      <SelectItem value="30d" className="rounded-lg">
                        Last 30 days
                      </SelectItem>
                      <SelectItem value="7d" className="rounded-lg">
                        Last 7 days
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                  {/* ข้อความทุกแบบสูง 250px เท่ากราฟ กล่องจะได้ไม่ยืด/หดตอนเปลี่ยน dropdown */}

                  {/* กำลังโหลด (ทุกครั้งที่เปลี่ยน dropdown) */}
                  {isSalesLoading && (
                    <p className="flex h-[250px] items-center justify-center text-sm text-[#8A91A0]">
                      Loading...
                    </p>
                  )}

                  {/* โหลดไม่สำเร็จ (เช่น backend ล่ม หรือ session หมดอายุ) */}
                  {!isSalesLoading && salesError && (
                    <p className="flex h-[250px] items-center justify-center text-sm text-[#9A4D4D]">
                      {salesError}
                    </p>
                  )}

                  {/* โหลดสำเร็จแต่ช่วงนี้ไม่มียอดขายเลย (ทุกวันเป็น 0) */}
                  {!isSalesLoading && !salesError && totalSalesInRange === 0 && (
                    <p className="flex h-[250px] items-center justify-center text-sm text-[#8A91A0]">
                      No sales in this period
                    </p>
                  )}

                  {/* มีข้อมูล: แสดงกราฟ */}
                  {!isSalesLoading && !salesError && totalSalesInRange > 0 && (
                  <ChartContainer
                    config={SaleStatisticChartConfig}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <AreaChart data={salesChartData}>
                      <defs>
                        {/* สีไล่ระดับใต้เส้นยอดขาย (เข้มด้านบน จางด้านล่าง) */}
                        <linearGradient
                          id="fillSales"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-sales)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-sales)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              );
                            }}
                            indicator="dot"
                          />
                        }
                      />
                      {/* type="monotone" = เส้นโค้งที่ไม่ล้นต่ำกว่า 0 (แบบ "natural" เดิมอาจโค้งติดลบระหว่างวันที่ยอด 0 กับวันที่ยอดสูง) */}
                      <Area
                        dataKey="sales"
                        type="monotone"
                        fill="url(#fillSales)"
                        stroke="var(--color-sales)"
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                  </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* shipment status chart */}
            <div className="mt-4 md:w-[30%] h-full">
              <h2 className="text-2xl font-semibold pb-2">Shipment Status</h2>
              <Card className="flex flex-col bg-background">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Orders by Status</CardTitle>
                  <CardDescription>Current shipment breakdown</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  {/* กำลังโหลด */}
                  {isShipmentLoading && (
                    <p className="py-16 text-center text-sm text-[#8A91A0]">Loading...</p>
                  )}

                  {/* โหลดไม่สำเร็จ (เช่น backend ล่ม หรือ session หมดอายุ) */}
                  {!isShipmentLoading && shipmentError && (
                    <p className="py-16 text-center text-sm text-[#9A4D4D]">{shipmentError}</p>
                  )}

                  {/* โหลดสำเร็จแต่ยังไม่มี order เลย (ทุก status เป็น 0) */}
                  {!isShipmentLoading && !shipmentError && totalShipmentOrders === 0 && (
                    <p className="py-16 text-center text-sm text-[#8A91A0]">No orders</p>
                  )}

                  {/* มีข้อมูล: แสดงกราฟ + legend */}
                  {!isShipmentLoading && !shipmentError && totalShipmentOrders > 0 && (
                    <>
                      <ChartContainer
                        config={ShipmentStatusChartConfig}
                        className="mx-auto aspect-square max-h-[300px]"
                      >
                        <PieChart>
                          <Pie data={shipmentChartData} dataKey="orders" />
                        </PieChart>
                      </ChartContainer>

                      {/* legend เขียนเอง: จุดสี + ชื่อ status + จำนวน order (ชิ้นเล็กในกราฟอ่านยาก เลยบอกตัวเลขตรงนี้) */}
                      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 pb-4 text-xs">
                        {shipmentChartData.map((item) => (
                          <li key={item.status} className="flex items-center gap-1.5">
                            {/* ใช้สีกับชื่อจาก config ตัวเดียวกับกราฟ สีจึงตรงกับชิ้นในวงกลม */}
                            <span
                              className="h-2 w-2 rounded-[2px]"
                              style={{ backgroundColor: ShipmentStatusChartConfig[item.status].color }}
                            />
                            <span>{ShipmentStatusChartConfig[item.status].label}</span>
                            <span className="font-semibold">{item.orders}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* third row graph */}
          <div className="flex flex-col md:flex-row gap-2">
            {/* Recent Order */}
            <div className="mt-4 md:w-[70%] flex flex-col">
              {/* แก้ status / ลบ order ทำที่หน้า Orders ที่เดียว หน้านี้แสดงอย่างเดียว (ลิงก์ View all อยู่แถวท้ายตาราง) */}
              <h2 className="text-2xl font-semibold pb-2">Recent Order</h2>

              {/* จอใหญ่: กล่องสูงเท่ากล่อง Sale Overview (absolute ไม่ดันความสูงแถว) แล้ว scroll ในกล่อง / จอเล็ก: สูงสุด 400px */}
              {/* py-0 ให้หัวตารางชิดขอบบน, ปิด overflow ของ div ที่ห่อ Table เพื่อให้ sticky อิงกับการ scroll ของ Card */}
              <div className="relative md:flex-1">
              <Card className="bg-background py-0 max-h-[400px] overflow-y-auto md:max-h-none md:absolute md:inset-0 [&_[data-slot=table-container]]:overflow-visible">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                      <TableRow>
                        <TableHead>OrderID</TableHead>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Products item</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* กำลังโหลดครั้งแรก (ตอน refetch หลังแก้/ลบยังมีข้อมูลเดิมอยู่ จึงไม่ต้องแสดง) */}
                      {isLoading && recentOrderList.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="py-10 text-center text-[#8A91A0]">
                            Loading orders...
                          </TableCell>
                        </TableRow>
                      )}

                      {/* โหลดไม่สำเร็จ (เช่น backend ล่ม หรือ session หมดอายุ) */}
                      {!isLoading && error && (
                        <TableRow>
                          <TableCell colSpan={4} className="py-10 text-center text-[#9A4D4D]">
                            {error}
                          </TableCell>
                        </TableRow>
                      )}

                      {/* โหลดเสร็จแล้วแต่ยังไม่มี order ในระบบ */}
                      {!isLoading && !error && recentOrderList.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="py-10 text-center text-[#8A91A0]">
                            No orders
                          </TableCell>
                        </TableRow>
                      )}

                      {recentOrderList.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.order_id}</TableCell>
                          <TableCell>{order.customer_id}</TableCell>
                          <TableCell>
                            <ul className="list-disc pl-4">
                              {order.items.map((item) => (
                                <li key={item.product_id}>
                                  {item.name} x{item.quantity}
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell>{order.status}</TableCell>
                        </TableRow>
                      ))}

                      {/* แถวสุดท้าย: เห็นเมื่อ scroll ถึงล่างสุด พาไปหน้า Orders (แสดงเฉพาะตอนมี order) */}
                      {recentOrderList.length > 0 && (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={4} className="py-4 text-center">
                            <Link
                              to="/admindashboard/order-list"
                              className="text-sm font-semibold text-[#475486] hover:underline"
                            >
                              View all orders
                            </Link>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              </div>
            </div>
            {/* Sale Overview: ดอกไม้ที่ถูกใช้มากที่สุด 5 อันดับ (all time, ไม่นับ order ที่ cancelled) */}
            <div className="mt-4 md:w-[30%] h-full">
              <h2 className="text-2xl font-semibold pb-2">Sale Overview</h2>
              <Card className="flex flex-col bg-background">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Most Used Flowers</CardTitle>
                  <CardDescription>All time (excluding cancelled orders)</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  {/* กำลังโหลด */}
                  {isTopFlowersLoading && (
                    <p className="py-16 text-center text-sm text-[#8A91A0]">Loading...</p>
                  )}

                  {/* โหลดไม่สำเร็จ (เช่น backend ล่ม หรือ session หมดอายุ) */}
                  {!isTopFlowersLoading && topFlowersError && (
                    <p className="py-16 text-center text-sm text-[#9A4D4D]">{topFlowersError}</p>
                  )}

                  {/* โหลดสำเร็จแต่ยังไม่มีดอกไม้ที่ถูกใช้เลย (backend ส่ง array ว่างมา) */}
                  {!isTopFlowersLoading && !topFlowersError && topFlowersChartData.length === 0 && (
                    <p className="py-16 text-center text-sm text-[#8A91A0]">No data</p>
                  )}

                  {/* มีข้อมูล: แสดงกราฟ + legend */}
                  {!isTopFlowersLoading && !topFlowersError && topFlowersChartData.length > 0 && (
                    <>
                      <ChartContainer
                        config={TopFlowersChartConfig}
                        className="mx-auto aspect-square max-h-[300px]"
                      >
                        <PieChart>
                          <Pie data={topFlowersChartData} dataKey="quantity" nameKey="name" />
                        </PieChart>
                      </ChartContainer>

                      {/* legend เขียนเองแบบเดียวกับ Shipment Status: จุดสี + ชื่อดอกไม้ + จำนวนที่ใช้ */}
                      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 pb-4 text-xs">
                        {topFlowersChartData.map((item) => (
                          <li key={item.name} className="flex items-center gap-1.5">
                            <span
                              className="h-2 w-2 rounded-[2px]"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span>{item.name}</span>
                            <span className="font-semibold">{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
