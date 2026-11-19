import { NextResponse } from "next/server";
import { erpStore } from "@/lib/erpStore";
import { ExpenseCategory } from "@prisma/client";

export async function GET() {
  try {
    const expenses = erpStore.getExpenses();
    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("Expenses get error:", error);
    return NextResponse.json({ error: "Failed to load expenses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, amountEgp, incurredDate, notes, createdByName } = body;

    if (!category || !amountEgp || !incurredDate) {
      return NextResponse.json(
        { error: "category, amountEgp and incurredDate are required" },
        { status: 400 }
      );
    }

    if (!Object.values(ExpenseCategory).includes(category)) {
      return NextResponse.json(
        { error: "Invalid ExpenseCategory" },
        { status: 400 }
      );
    }

    const exp = erpStore.addExpense({
      category: category as ExpenseCategory,
      amountEgp: Number(amountEgp),
      incurredDate,
      notes,
      createdByName: createdByName || "Operations",
    });

    return NextResponse.json({ success: true, expense: exp });
  } catch (error) {
    console.error("Expenses post error:", error);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
