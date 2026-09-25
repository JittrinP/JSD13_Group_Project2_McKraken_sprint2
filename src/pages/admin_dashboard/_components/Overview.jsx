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

// สีป้าย status ในตาราง Recent Order (ชุดเดียวกับ statusStyles ใน OrderList.jsx ถ้าแก้สี ให้แก้ทั้ง 2 ไฟล์)
const STATUS_BADGE_STYLES = {
  pending: "bg-[#FFF4D6] text-[#916D18]",
  processing: "bg-[#E9EAFE] text-[#545C9E]",
  shipped: "bg-[#E5F1F0] text-[#3D7770]",
  completed: "bg-[#E5F4E9] text-[#3B7B4D]",
  cancelled: "bg-[#F8E6E6] text-[#9A4D4D]",
};

// ชื่อที่แสดงของแต่ละช่วงเวลาใน dropdown ของ Sale Statistic
const TIME_RANGE_LABELS = {
  "90d": "Last 3 months",
  "30d": "Last 30 days",
  "7d": "Last 7 days",
};

// หน้าตาของตัวเลือกใน dropdown ให้เข้ากับธีม admin (สีกรมท่า #475486, ชี้แล้วพื้นฟ้าอ่อน #E8F4F4 เหมือนเมนูด้านข้าง)
const TIME_RANGE_ITEM_CLASS =
  "rounded-lg text-[#475486] focus:bg-[#E8F4F4] focus:text-[#475486] data-highlighted:bg-[#E8F4F4] data-selected:font-semibold";

// config ของ chart Sale Statistic
// เส้นเดียว: ยอดขายรายวัน (key "sales" ต้องตรงกับชื่อ field ที่ backend ส่งมา)
// สีกรมท่าม่วงของธีม admin (กราฟมีเส้นเดียว ใช้สีหลักได้เลย)
const SaleStatisticChartConfig = {
  sales: {
    label: "Sales (฿)",
    color: "#475486",
  },
};

// config ของกราฟ Shipment Status: ชื่อ key ต้องตรงกับ order_status ใน order.model.js
// สีตามความหมายของ status ตระกูลเดียวกับป้ายสีในตาราง Recent Order
// (ผ่านการตรวจสีแล้ว: คนตาบอดสีแยกได้ทุกคู่ / สีป้ายตรงๆ ใช้ไม่ได้เพราะ shipped กับ completed ใกล้กันเกินไป)
const ShipmentStatusChartConfig = {
  orders: {
    label: "Orders",
  },
  pending: {
    label: "Pending",
    color: "#C08412", // เหลืองทอง
  },
  processing: {
    label: "Processing",
    color: "#9A7BE0", // ม่วง
  },
  shipped: {
    label: "Shipped",
    color: "#1F68A8", // น้ำเงิน
  },
  completed: {
    label: "Completed",
    color: "#56B27A", // เขียว
  },
  cancelled: {
    label: "Cancelled",
    color: "#B03A48", // แดง
  },
};

// config ของกราฟ Top 5 Flowers: ชื่อดอกไม้มาจาก backend (เปลี่ยนได้) เลยไม่ผูกสีกับชื่อ แต่ผูกสีกับอันดับแทน
const TopFlowersChartConfig = {
  quantity: {
    label: "Used",
  },
};

// สีของอันดับ 1-5: กรมท่าม่วงโทนเดียว ไล่จากเข้ม (อันดับ 1) ไปอ่อน (อันดับ 5)
// สีบอก "อันดับ" ส่วนชื่อดอกไม้ดูจาก legend (ถ้าใช้คนละสี คนดูจะคิดว่าสีบอกชนิดดอกไม้ แต่อันดับสลับได้ทุกวัน)
const TOP_FLOWER_COLORS = [
  "#26305C",
  "#3A4679",
  "#515E96",
  "#6C79B2",
  "#8C97CA",
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
            <Card className="bg-background shadow-md">
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
            <Card className="bg-background shadow-md">
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
            <Card className="bg-background shadow-md">
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
            {/* flex flex-col + การ์ด flex-1 (ทั้งกล่องนี้และ Shipment Status) = การ์ดยืดให้สูงเท่ากับกล่องที่สูงกว่าในแถวเดียวกัน */}
            <div className="mt-4 md:w-[70%] flex flex-col">
              <h2 className="text-2xl font-semibold pb-2">Sale Statistic</h2>
              <Card className="pt-0 bg-background flex-1">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1">
                    <CardTitle>Daily Sales</CardTitle>
                    <CardDescription>
                      Paid orders, excluding cancelled
                    </CardDescription>
                  </div>
                  {/* items = บอก Select ว่าแต่ละค่าชื่ออะไร ช่องที่เลือกไว้จะแสดง "Last 7 days" แทน "7d" */}
                  <Select value={timeRange} onValueChange={setTimeRange} items={TIME_RANGE_LABELS}>
                    <SelectTrigger
                      className="flex w-[140px] md:w-[160px] sm:ml-auto rounded-xl border-neutral-200/50 bg-white font-medium text-[#475486] shadow-none focus-visible:ring-[#475486]/30"
                      aria-label="Select time range"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    {/* alignItemWithTrigger={false} = เปิดรายการใต้ช่อง ไม่ให้เด้งขึ้นมาทับช่องที่เลือกไว้ */}
                    <SelectContent
                      alignItemWithTrigger={false}
                      className="rounded-xl border border-neutral-200/50 bg-white p-1 shadow-lg"
                    >
                      <SelectItem value="90d" className={TIME_RANGE_ITEM_CLASS}>
                        Last 3 months
                      </SelectItem>
                      <SelectItem value="30d" className={TIME_RANGE_ITEM_CLASS}>
                        Last 30 days
                      </SelectItem>
                      <SelectItem value="7d" className={TIME_RANGE_ITEM_CLASS}>
                        Last 7 days
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col px-2 pt-4 sm:px-6 sm:pt-6">
                  {/* กราฟและข้อความทุกแบบ:
                      - มือถือ: สูงตายตัว 250px (กราฟต้องรู้ความสูงแน่นอน ถ้าให้ยืดเองจะได้ความสูง 0 แล้วกราฟหาย)
                      - จอ md ขึ้นไป: อย่างน้อย 250px และยืดเต็มกรอบ (flex-1) ให้เท่ากล่อง Shipment Status */}

                  {/* กำลังโหลด (ทุกครั้งที่เปลี่ยน dropdown) */}
                  {isSalesLoading && (
                    <p className="flex h-[250px] md:h-auto md:min-h-[250px] md:flex-1 items-center justify-center text-sm text-[#8A91A0]">
                      Loading...
                    </p>
                  )}

                  {/* โหลดไม่สำเร็จ (เช่น backend ล่ม หรือ session หมดอายุ) */}
                  {!isSalesLoading && salesError && (
                    <p className="flex h-[250px] md:h-auto md:min-h-[250px] md:flex-1 items-center justify-center text-sm text-[#9A4D4D]">
                      {salesError}
                    </p>
                  )}

                  {/* โหลดสำเร็จแต่ช่วงนี้ไม่มียอดขายเลย (ทุกวันเป็น 0) */}
                  {!isSalesLoading && !salesError && totalSalesInRange === 0 && (
                    <p className="flex h-[250px] md:h-auto md:min-h-[250px] md:flex-1 items-center justify-center text-sm text-[#8A91A0]">
                      No sales in this period
                    </p>
                  )}

                  {/* มีข้อมูล: แสดงกราฟ */}
                  {!isSalesLoading && !salesError && totalSalesInRange > 0 && (
                  <ChartContainer
                    config={SaleStatisticChartConfig}
                    className="aspect-auto h-[250px] w-full md:h-auto md:min-h-[250px] md:flex-1"
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
            <div className="mt-4 md:w-[30%] flex flex-col">
              <h2 className="text-2xl font-semibold pb-2">Shipment Status</h2>
              <Card className="flex flex-col bg-background flex-1">
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
              {/* overflow-auto = scroll ได้ทั้งแนวตั้งและแนวนอน (เดิม overflow-y-auto ทำให้เลื่อนขวาไม่ได้ ตารางถูกตัด) */}
              <div className="relative md:flex-1">
              <Card className="bg-white py-0 max-h-[400px] overflow-auto md:max-h-none md:absolute md:inset-0 [&_[data-slot=table-container]]:overflow-visible">
                <CardContent className="p-0">
                  {/* min-w = ตารางกว้างอย่างน้อย 640px ถ้าจอแคบกว่านี้ให้เลื่อนขวาดูแทนการบีบข้อความ (แบบเดียวกับหน้า Orders) */}
                  <Table className="min-w-[640px] text-[#475486]">
                    {/* หัวตาราง: สีเดียวกับหน้า Orders / ใส่สีพื้นที่ th ทุกช่อง เพื่อไม่ให้แถวที่เลื่อนผ่านโผล่ทะลุตอน sticky */}
                    <TableHeader className="sticky top-0 z-10 [&_th]:bg-[#F4F7F8] [&_th]:shadow-[inset_0_-1px_0_#E1E3E7]">
                      <TableRow className="border-0 hover:bg-transparent">
                        <TableHead className="px-5 text-xs font-semibold uppercase tracking-wide text-[#667092]">Order ID</TableHead>
                        <TableHead className="px-5 text-xs font-semibold uppercase tracking-wide text-[#667092]">Customer ID</TableHead>
                        <TableHead className="px-5 text-xs font-semibold uppercase tracking-wide text-[#667092]">Products</TableHead>
                        <TableHead className="px-5 text-xs font-semibold uppercase tracking-wide text-[#667092]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* กำลังโหลดครั้งแรก (ตอน refetch หลังแก้/ลบยังมีข้อมูลเดิมอยู่ จึงไม่ต้องแสดง) */}
                      {isLoading && recentOrderList.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="py-10 text-center text-[#8A91A0]">
                            Loading...
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

                      {/* แถว order: เส้นคั่นบาง + พื้นจางตอนชี้เมาส์ แบบเดียวกับหน้า Orders */}
                      {recentOrderList.map((order) => (
                        <TableRow key={order.id} className="border-b border-[#ECEDEF] hover:bg-[#FCFDFD]">
                          <TableCell className="px-5 py-4 font-semibold">{order.order_id}</TableCell>
                          <TableCell className="px-5 py-4 text-[#667092]">{order.customer_id}</TableCell>
                          <TableCell className="px-5 py-4">
                            <ul className="list-disc space-y-0.5 pl-4">
                              {order.items.map((item) => (
                                <li key={item.product_id}>
                                  {item.name} <span className="text-[#667092]">x{item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell className="px-5 py-4">
                            {/* ป้ายสีตาม status ชื่อที่แสดง (เช่น "Pending") ใช้จาก config ของกราฟ Shipment Status */}
                            <span
                              className={
                                "inline-flex rounded-full px-3 py-1 text-xs font-semibold " +
                                STATUS_BADGE_STYLES[order.status]
                              }
                            >
                              {ShipmentStatusChartConfig[order.status].label}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* แถวสุดท้าย: เห็นเมื่อ scroll ถึงล่างสุด พาไปหน้า Orders (แสดงเฉพาะตอนมี order) */}
                      {recentOrderList.length > 0 && (
                        <TableRow className="border-0 hover:bg-transparent">
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
