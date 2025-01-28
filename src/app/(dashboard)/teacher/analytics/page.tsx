 
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { getAnalytics } from "../../../../../actions/get-analytics";
import DataCard from "./_components/DataCard";
import Chart from "./_components/Chart";

async function page() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total revenue" value={totalRevenue} shouldFormat={true} />
        <DataCard label="Total Sales" value={totalSales} />
      </div>
      <Chart data={data}/>
    </div>
  );
}

export default page;
