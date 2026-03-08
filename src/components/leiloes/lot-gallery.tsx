'use client'

import { useState } from 'react'

interface LotGalleryProps {
    images: string[]
    title: string
}

export function LotGallery({ images, title }: LotGalleryProps) {
    const [mainImage, setMainImage] = useState(images[0] || '/placeholder-car.jpg')

    return (
        <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 relative group shadow-inner">
                <img
                    src={mainImage}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={`relative w-28 aspect-video rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${mainImage === img ? "border-[#c9a05b] scale-95 shadow-lg" : "border-transparent hover:border-gray-300"
                                }`}
                        >
                            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
