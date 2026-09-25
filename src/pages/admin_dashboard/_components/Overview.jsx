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

//  data สำหรับ graph Sale Statistic
const SaleStatisticChartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

// config ของ chart Sale Statistic

const SaleStatisticChartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
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


//Sale overview Chart
const SaleChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
};

const SalePieChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];


export default function Overview() {
  const [timeRange, setTimeRange] = React.useState("90d");

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

  const filteredData = SaleStatisticChartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
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
                <p className="text-center text-2xl font-semibold">฿2000.10</p>
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
                <p className="text-center text-2xl font-semibold">20.1 k</p>
              </CardContent>
            </Card>

            {/* Total Products */}
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-center font-heading text-lg">
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-2xl font-semibold">2.4 k</p>
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
                <p className="text-center text-2xl font-semibold">1.6 k</p>
              </CardContent>
            </Card>
          </div>

          {/* Second row data */}
          <div className="flex flex-col md:flex-row gap-2">
            {/* Sale statistic graph */}
            <div className="mt-4 md:w-[70%] h-fit">
              <h2 className="text-2xl font-semibold">Sale Statistic</h2>
              <Card className="pt-0 mt-2 bg-background">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1">
                    <CardTitle>Area Chart - Interactive</CardTitle>
                    <CardDescription>
                      Showing total visitors for the last 3 months
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
                  <ChartContainer
                    config={SaleStatisticChartConfig}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <AreaChart data={filteredData}>
                      <defs>
                        <linearGradient
                          id="fillDesktop"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-desktop)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-desktop)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="fillMobile"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-mobile)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-mobile)"
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
                      <Area
                        dataKey="mobile"
                        type="natural"
                        fill="url(#fillMobile)"
                        stroke="var(--color-mobile)"
                        stackId="a"
                      />
                      <Area
                        dataKey="desktop"
                        type="natural"
                        fill="url(#fillDesktop)"
                        stroke="var(--color-desktop)"
                        stackId="a"
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                  </ChartContainer>
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
            {/* Sale Overview */}
            <div className="mt-4 md:w-[30%] h-full">
              <h2 className="text-2xl font-semibold pb-2">Sale Overview</h2>
              <Card className="flex flex-col bg-background">
                <CardHeader className="items-center pb-0">
                  <CardTitle>Pie Chart - Legend</CardTitle>
                  <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={SaleChartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                  >
                    <PieChart>
                      <Pie data={SalePieChartData} dataKey="visitors" />
                      <ChartLegend
                        content={<ChartLegendContent nameKey="browser" />}
                        className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
