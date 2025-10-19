"use client"

import { useState } from "react"
import { ImageGallery } from "./ImageGallery"

interface ImageGalleryDebugProps {
    images: string[]
    title: string
    className?: string
}

export function ImageGalleryDebug({ images, title, className = "" }: ImageGalleryDebugProps) {
    const [showDebug, setShowDebug] = useState(false)

    console.log('ImageGallery Debug:', {
        images,
        imagesLength: images?.length,
        imagesType: typeof images,
        title,
        firstImage: images?.[0],
        allImages: images
    })

    return (
        <div className="space-y-4">
            {/* Debug Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <button 
                    onClick={() => setShowDebug(!showDebug)}
                    className="text-yellow-800 font-medium hover:underline"
                >
                    🐛 Debug Info {showDebug ? '(إخفاء)' : '(عرض)'}
                </button>
                
                {showDebug && (
                    <div className="mt-3 text-sm text-yellow-700 space-y-2">
                        <div><strong>عدد الصور:</strong> {images?.length || 0}</div>
                        <div><strong>نوع البيانات:</strong> {typeof images}</div>
                        <div><strong>هل هو مصفوفة:</strong> {Array.isArray(images) ? 'نعم' : 'لا'}</div>
                        <div><strong>العنوان:</strong> {title}</div>
                        
                        {images && images.length > 0 && (
                            <div>
                                <strong>الصور:</strong>
                                <ul className="mt-1 space-y-1">
                                    {images.map((img, index) => (
                                        <li key={index} className="break-all">
                                            {index + 1}. {img}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {(!images || images.length === 0) && (
                            <div className="text-red-600">
                                <strong>⚠️ لا توجد صور!</strong>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Original Gallery */}
            <ImageGallery 
                images={images} 
                title={title} 
                className={className}
            />
        </div>
    )
}