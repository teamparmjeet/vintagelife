
import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import MonthlyClosingHistoryModel from '@/model/MonthleClosingHistory';

export async function PATCH(request) {
  try {
    const body = await request.json();

    const { id, updateData } = body;

    if (!id || !updateData) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database (implement your own connectToDB function)
    await dbConnect();

    const updated = await MonthlyClosingHistoryModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Pair not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Closing pair updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('PATCH /api/closing/updatepair error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
