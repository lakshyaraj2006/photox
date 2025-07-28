import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import type { Photo } from "./PhotoListings";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlbumIcon, Share2Icon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function PhotoView() {
    const { id } = useParams();
    const [photo, setPhoto] = useState<Photo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { auth } = useAuth();

    useEffect(() => {
        fetchPhotoDetails();
    }, [])


    const fetchPhotoDetails = async () => {
        try {
            const response = await axiosInstance.get(`/photos/${id}`);
            setPhoto(response.data.data);
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(
                    error.response.data.message
                        ? error.response.data.message
                        : error.response.data
                )
            } else {
                setError("Something went wrong!")
            }
        }
    }

    const handlePhotoDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!window.confirm("Do you want to delete this photo ? This action is irreversible!")) return;
        try {
            const response = await axiosInstance.delete(`/photos/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });

            const { success, message } = response.data;

            if (success) {
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(
                    error.response.data.message
                        ? error.response.data.message
                        : error.response.data
                )
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    return (
        <div className="max-w-8xl w-full px-6 my-6 grid sm:grid-cols-8 gap-4">
            {
                error && <div className="border border-red-500 rounded-lg col-span-8 p-6 bg-red-200">
                    <h2 className="text-lg text-center text-red-500 font-bold">{error}</h2>
                </div>
            }
            {
                !error && (
                    <>
                        <div className="col-span-4 sm:col-span-5 space-y-2">
                            <div className="flex items-center space-x-4 justify-end">
                                <Button className="cursor-pointer" onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Link copied to clipboad!")
                                }}><Share2Icon /></Button>
                                {
                                    auth.accessToken
                                    && (photo?.user?._id === auth.userId)
                                    && <Button variant="destructive" className="cursor-pointer" onClick={handlePhotoDelete}>
                                        <Trash2Icon />
                                    </Button>
                                }
                            </div>

                            <a href={photo?.url} target="_blank">
                                <img src={photo?.url} className="w-full h-96 object-cover object-top rounded-lg cursor-pointer" alt="" />
                            </a>
                        </div>
                        <div className="col-span-4 sm:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-center text-xl font-bold">Uploaded by:</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-row space-x-4 items-center">
                                    <div>
                                        <img src={photo?.user?.image} className="w-28 h-28 object-cover object-top rounded-lg" alt="" />
                                    </div>

                                    <div className="space-y-2">
                                        <p><strong>Name:</strong> {photo?.user?.name}</p>
                                        <p><strong>Uploaded On:</strong> {new Date(photo?.createdAt).toDateString()}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="col-span-4 sm:col-span-5">
                            {
                                !(photo?.albums?.length > 0)
                                    ?
                                    <div className="border border-gray-400 bg-gray-200 rounded-lg px-3 py-2">
                                        <h2 className="text-lg text-gray-600 font-semibold text-center">This photo is not associated with any albums!</h2>
                                    </div>
                                    :
                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {
                                            photo?.albums?.map((album) => (
                                                <Link key={album._id} to={`/albums/${album?._id}`} className="flex items-center gap-4 justify-center border border-gray-500 rounded-lg px-3 py-6 transition-all hover:bg-black hover:text-white">
                                                    <AlbumIcon />
                                                    {album?.title}
                                                    <span>&raquo;</span>
                                                </Link>
                                            ))
                                        }
                                    </div>
                            }
                        </div>
                    </>
                )
            }
        </div>
    )
}