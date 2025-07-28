
import { UploadImage } from "@/components/UploadImage";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { EyeIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export interface Photo {
    _id: string;
    filename: string;
    mimetype: string;
    url: string;
    publicId: string;
    user: {
        _id: string;
        name: string;
        username: string;
        image: string
    },
    albums?: [
        {
            _id: string,
            title: string,
            description: string,
            user: {
                _id: string;
                name: string;
                username: string;
                image: string
            }
        }
    ],
    updatedAt: Date,
    createdAt: Date,
    __v: number
}

export default function PhotoListings() {
    const [photos, setPhotos] = useState<Photo[] | null>(null);
    const { auth, setProfile } = useAuth();
    const [overlayIndex, setOverlayIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchAllUserPhotos();
    });

    const fetchAllUserPhotos = async () => {
        const response = await axiosInstance.get('/photos/user', {
            headers: {
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });

        setPhotos(response.data.data);
    }

    const handleImageUpload = async (file: File) => {
        try {
            const formData = new FormData();
        formData.append('image', file);
        const response = await axiosInstance.post('/photos/add', formData, {
            headers: {
                'Content-Type': 'multipart/formData',
                'Authorization': `Bearer ${auth.accessToken}`
            }
        });

        const {success, message} = response.data;

        if (success) {
            toast.success(message);
            await fetchAllUserPhotos();
        } else {
            toast.error(message);
        }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    return (
        <main className="my-6 flex flex-col justify-center overflow-hidden max-w-8xl w-full px-24 space-y-6">
            <UploadImage onFileAccepted={handleImageUpload} />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
                {
                    photos?.map((photo, index) => (
                        <div
                            className="relative cursor-pointer"
                            onMouseOver={() => setOverlayIndex(index)}
                            onMouseLeave={() => setOverlayIndex(null)}
                            key={photo?._id}
                        >
                            <img className="w-full rounded object-cover cursor-pointer" src={photo?.url} width="232" height="290" alt={`Image ${photo?.filename}`} />

                            <div
                                className={cn(
                                    "absolute p-6 bg-black/40 backdrop-blur-md bottom-0 h-full w-full transition-all flex flex-col items-center justify-center space-y-4 rounded",
                                    overlayIndex === index ? "opacity-100" : "opacity-0"
                                )}
                                onMouseLeave={() => setOverlayIndex(null)}
                            >
                                <Link to={`/photos/${photo?._id}`} className="text-white flex items-center justify-center space-x-2 border border-white rounded w-20 py-1 transition-all hover:bg-white hover:text-black">
                                    <EyeIcon size={16} />
                                    <span>View</span>
                                </Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </main>
    )
}