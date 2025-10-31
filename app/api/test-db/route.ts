import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    // Test database connection
    const testResult = await database.getInstance().getDb();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      dbName: testResult.databaseName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}