import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import axiosInstance from '@/lib/axios';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Album, EyeIcon, PlusCircleIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import AddAlbum from '@/pages/albums/AddAlbum';

dayjs.extend(relativeTime);

export interface Album {
  _id: string,
  title: string,
  description: string,
  user: {
    _id: string;
    name: string;
    username: string;
    image: string
  },
  thumbnail?: {
    _id: string,
    filename: string,
    mimetype: string,
    url: string
  },
  updatedAt: Date,
  createdAt: Date
}

export default function AlbumListings() {
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const { auth } = useAuth();

  useEffect(() => {
    fetchUserAlbums();
  }, [])

  const fetchUserAlbums = async () => {
    const response = await axiosInstance.get('/albums/user', {
      headers: {
        'Authorization': `Bearer ${auth.accessToken}`
      }
    });

    setAlbums(response.data ? response.data.data : null);
  }

  return (
    <main className="my-6 flex flex-col justify-center overflow-hidden max-w-8xl w-full px-24 space-y-6">
      <Link
        to={"/albums/add"}
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-colors border-blue-500 bg-blue-50 h-40"
      >
        <PlusCircleIcon className="w-10 h-10 text-blue-500 mb-2" />
        <p className="text-blue-500 text-sm">Add Album</p>
      </Link>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 items-baseline">
        {
          albums?.map((album, index) => (
            <Link to={`/albums/${album?._id}`} key={album?._id}>
              <Card>
                <CardHeader>
                  <img src={album?.thumbnail?.url ?? album?.user?.image} className='rounded-2xl' alt={`${album?.title} thumbnail`} />
                  <CardTitle className='text-lg md:text-xl'>{album?.title}</CardTitle>
                  <CardDescription className='space-y-4 w-full'>
                    <div className='flex items-center gap-2'>
                      <Avatar>
                        <AvatarImage src={album?.user?.image} className='object-cover object-top' />
                        <AvatarFallback>User Avatar</AvatarFallback>
                      </Avatar>
                      <p>{album?.user?.name}</p>
                      <span>&bull;</span>
                      <p>{dayjs(album?.createdAt).fromNow()}</p>
                    </div>
                    <div className='w-full max-h-[160px] overflow-hidden line-clamp-3'>
                      {album?.description}
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))
        }
      </div>
    </main>
  )
}
