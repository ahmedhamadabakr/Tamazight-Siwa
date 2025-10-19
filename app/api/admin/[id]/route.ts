import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/admin/[id] - Get single admin by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const db = await dbConnect();
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                error: 'معرف المدير غير صالح'
            }, { status: 400 });
        }

        const admin = await db.collection('users').findOne({
            _id: new ObjectId(id),
            role: { $in: ['manager', 'admin'] }
        });

        if (!admin) {
            return NextResponse.json({
                success: false,
                error: 'المدير غير موجود'
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
            error: 'فشل في جلب بيانات المدير'
        }, { status: 500 });
    }
}

// PUT /api/admins/[id] - Update admin status
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
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
                error: 'المدير غير موجود'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: updatedAdmin.value,
            message: 'تم تحديث المدير بنجاح'
        });
    } catch (error) {
        console.error('Error updating admin:', error);
        return NextResponse.json({
            success: false,
            error: 'فشل في تحديث المدير'
        }, { status: 500 });
    }
}

// DELETE /api/admins/[id] - Delete admin
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const db = await dbConnect();

        const { id } = params;

        const deletedAdmin = await db.collection('users').findOneAndDelete({ _id: new ObjectId(id) });

        if (!deletedAdmin || !deletedAdmin.value) {
            return NextResponse.json({
                success: false,
                error: 'المدير غير موجود'
            }, { status: 404 });
        }
        return NextResponse.json({
            success: true,
            message: 'تم حذف المدير بنجاح'
        });
    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json({
            success: false,
            error: 'فشل في حذف المدير'
        }, { status: 500 });
    }
}
