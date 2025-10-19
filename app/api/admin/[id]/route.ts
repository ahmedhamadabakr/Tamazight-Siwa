import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/admin/[id] - Get single admin by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if we're in build time - use multiple indicators
        const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
                           process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined;

        if (isBuildTime) {
            return NextResponse.json({
                success: false,
                error: 'API routes are not available during build time'
            }, { status: 503 });
        }

        // Only connect to DB if not in build time
        if (!process.env.MONGODB_URI) {
            return NextResponse.json({
                success: false,
                error: 'Database connection not configured'
            }, { status: 503 });
        }

        const db = await dbConnect();
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid admin ID'
            }, { status: 400 });
        }

        const admin = await db.collection('users').findOne({
            _id: new ObjectId(id),
            role: { $in: ['manager', 'admin'] }
        });

        if (!admin) {
            return NextResponse.json({
                success: false,
                error: 'Admin not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: admin
        });
    } catch (error) {
        console.error('Error fetching admin:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch admin data'
        }, { status: 500 });
    }
}

// PUT /api/admins/[id] - Update admin status
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if we're in build time - use multiple indicators
        const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
                           process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined;

        if (isBuildTime) {
            return NextResponse.json({
                success: false,
                error: 'API routes are not available during build time'
            }, { status: 503 });
        }

        // Only connect to DB if not in build time
        if (!process.env.MONGODB_URI) {
            return NextResponse.json({
                success: false,
                error: 'Database connection not configured'
            }, { status: 503 });
        }

        const db = await dbConnect();

        const { id } = params;
        const body = await request.json();
        const { status, role, permissions } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (role) updateData.role = role;
        if (permissions) updateData.permissions = permissions;
        updateData.updatedAt = new Date();

        const updatedAdmin = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!updatedAdmin || !updatedAdmin.value) {
            return NextResponse.json({
                success: false,
                error: 'Admin not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: updatedAdmin.value,
            message: 'Admin updated successfully'
        });
    } catch (error) {
        console.error('Error updating admin:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update admin'
        }, { status: 500 });
    }
}

// DELETE /api/admins/[id] - Delete admin
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if we're in build time - use multiple indicators
        const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' ||
                           process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined;

        if (isBuildTime) {
            return NextResponse.json({
                success: false,
                error: 'API routes are not available during build time'
            }, { status: 503 });
        }

        // Only connect to DB if not in build time
        if (!process.env.MONGODB_URI) {
            return NextResponse.json({
                success: false,
                error: 'Database connection not configured'
            }, { status: 503 });
        }

        const db = await dbConnect();

        const { id } = params;

        const deletedAdmin = await db.collection('users').findOneAndDelete({ _id: new ObjectId(id) });

        if (!deletedAdmin || !deletedAdmin.value) {
            return NextResponse.json({
                success: false,
                error: 'Admin not found'
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete admin'
        }, { status: 500 });
    }
}
