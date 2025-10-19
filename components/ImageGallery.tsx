"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"

interface ImageGalleryProps {
    images: string[]
    title: string
    className?: string
}

export function ImageGallery({ images, title, className = "" }: ImageGalleryProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const openGallery = (index: number) => {
        setCurrentIndex(index)
        setIsOpen(true)
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') nextImage()
        if (e.key === 'ArrowLeft') prevImage()
        if (e.key === 'Escape') setIsOpen(false)
    }

    // Add keyboard event listeners
    useEffect(() => {
        const handleKeyDownWrapper = (e: KeyboardEvent) => handleKeyDown(e)

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDownWrapper)
            document.body.style.overflow = 'hidden'
        } else {
            document.removeEventListener('keydown', handleKeyDownWrapper)
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDownWrapper)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!images || images.length === 0) {
        return (
            <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
                <span className="text-gray-500">لا توجد صور</span>
            </div>
        )
    }

    return (
        <>
            {/* Main Gallery Grid */}
            <div className={`grid gap-2 ${className}`}>
                {/* Main Image */}
                <div
                    className="relative cursor-pointer group overflow-hidden rounded-lg"
                    onClick={() => openGallery(0)}
                >
                    <Image
                        src={images[0]}
                        alt={`${title} - الصورة الرئيسية`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
                    </div>
                    {images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                            {images.length} صور
                        </div>
                    )}
                </div>

                {/* Thumbnail Grid */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                        {images.slice(1, 5).map((image, index) => (
                            <div
                                key={index + 1}
                                className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                                onClick={() => openGallery(index + 1)}
                            >
                                <Image
                                    src={image}
                                    alt={`${title} - صورة ${index + 2}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                            </div>
                        ))}
                        {images.length > 5 && (
                            <div
                                className="relative aspect-square cursor-pointer bg-black/80 hover:bg-black/70 transition-colors duration-300 flex items-center justify-center text-white font-semibold rounded-lg"
                                onClick={() => openGallery(5)}
                            >
                                +{images.length - 5}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Gallery */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
                >
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 hover:scale-110"
                            title="إغلاق (Esc)"
                        >
                            <X size={24} />
                        </button>

                        {/* Navigation Buttons */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 text-white hover:text-gray-300 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 hover:scale-110"
                                    title="الصورة السابقة (←)"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 text-white hover:text-gray-300 z-10 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 hover:scale-110"
                                    title="الصورة التالية (→)"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        {/* Current Image */}
                        <div className="relative max-w-6xl max-h-[85vh] w-full h-full flex items-center justify-center">
                            <Image
                                src={images[currentIndex]}
                                alt={`${title} - صورة ${currentIndex + 1}`}
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>

                        {/* Image Info */}
                        <div className="absolute top-4 left-4 text-white bg-black/60 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                            <span className="font-medium">{title}</span>
                        </div>

                        {/* Image Counter */}
                        {images.length > 1 && (
                            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white bg-black/60 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                                {currentIndex + 1} من {images.length}
                            </div>
                        )}

                        {/* Thumbnails Navigation */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-lg overflow-x-auto p-2 scrollbar-hide">
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`relative w-14 h-14 cursor-pointer rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 hover:scale-110 ${index === currentIndex ? 'border-white shadow-lg' : 'border-white/30 hover:border-white/60'
                                            }`}
                                        onClick={() => setCurrentIndex(index)}
                                    >
                                        <Image
                                            src={image}
                                            alt={`صورة مصغرة ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        {index === currentIndex && (
                                            <div className="absolute inset-0 bg-white/20"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}