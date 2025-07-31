import React, { useEffect, useState } from 'react'
import type { Album } from './AlbumListings'
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '@/lib/axios';
import { Edit2Icon, EyeIcon, PlusCircle, Share2Icon, Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

interface AlbumWithPhotos extends Album {
  photos?: [
    {
      _id: string,
      filename: string,
      mimetype: string,
      url: string,
      user: {
        _id: string,
        name: string,
        username: string,
        image: string
      }
    }
  ],
  collaborators?: [
    {
      _id: string,
      name: string,
      username: string,
      image: string
    }
  ]
}

function AlbumView() {
  const [overlayIndex, setOverlayIndex] = useState<number | null>(null);
  const [album, setAlbum] = useState<AlbumWithPhotos | null>(null);
  const { id } = useParams();
  const { auth } = useAuth();

  useEffect(() => {
    fetchAlbumDetails();
  }, [])

  const fetchAlbumDetails = async () => {
    try {
      const response = await axiosInstance.get(`/albums/${id}`);

      setAlbum(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="my-6 flex flex-col justify-center overflow-hidden max-w-8xl w-full px-24 space-y-6">
      <div className="flex items-center justify-end gap-4">
        <Button className="cursor-pointer" onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboad!")
        }}><Share2Icon /></Button>
        {
          auth.accessToken
          && (album?.user?._id === auth?.userId || album?.collaborators?.some(e => e._id === auth?.userId))
          && <>
            <Button variant='outline' className='cursor-pointer'><PlusCircle /></Button>
            <Button className='cursor-pointer'><Edit2Icon /></Button>
          </>
        }
        {
          auth.accessToken && album?.user?._id === auth?.userId
          && <Button variant='destructive' className='cursor-pointer'><Trash2Icon /></Button>
        }
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl text-center font-bold'>{album?.title}</CardTitle>
          <CardDescription>{album?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full justify-between">
            <div className='flex items-center gap-4'>
              <Avatar className='cursor-pointer'>
                <AvatarImage src={album?.user?.image} className='rounded-full object-cover object-top' />
                <AvatarFallback>Author Avatar</AvatarFallback>
              </Avatar>
              <span className='text-muted-foreground text-sm'>{album?.user?.name}</span>
            </div>

            {
              album?.collaborators && <div className='flex items-center gap-4'>
                <p className='text-muted-foreground text-sm'>Collaborators:</p>
                <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2'>
                  {album?.collaborators?.map((collaborator) => (
                    <Tooltip>
                      <TooltipTrigger className='cursor-pointer' asChild>
                        <Avatar key={collaborator?._id}>
                          <AvatarImage src={collaborator?.image} alt="@shadcn" />
                          <AvatarFallback>{collaborator?.name}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{collaborator?.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            }
          </div>
        </CardContent>
      </Card>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 items-baseline">
        {
          album?.photos?.map((photo, index) => (
            <div
              className="relative cursor-pointer"
              onMouseOver={() => setOverlayIndex(index)}
              onMouseLeave={() => setOverlayIndex(null)}
              key={photo?._id}
            >
              <img className="w-full rounded-lg object-cover cursor-pointer" src={photo?.url} width="232" height="290" alt={`Image ${photo?.filename}`} />

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
    </div>
  )
}

export default AlbumView