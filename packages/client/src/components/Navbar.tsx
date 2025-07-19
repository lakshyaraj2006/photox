import { AlbumIcon, ChevronsUpDown, HomeIcon, ImageIcon, LayoutDashboardIcon, LogInIcon, LogOutIcon, MenuIcon, Settings2Icon, XIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu';
import { Avatar, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import useLogout from '@/hooks/useLogout';

export default function Navbar() {
    const [mounted, setMounted] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { auth, profile } = useAuth();
    const logout = useLogout();

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleSidebar = () => {
        if (sidebarRef.current.classList.contains("-left-[120%]")) {
            sidebarRef.current.classList.remove("-left-[120%]");
            sidebarRef.current.classList.add("left-0");
        } else {
            sidebarRef.current.classList.remove("left-0");
            sidebarRef.current.classList.add("-left-[120%]");
        }
    }

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully!");

            setTimeout(() => {
                navigate("/auth/login");
            }, 2700);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error("Something went wrong");
            }
        }
    }

    return (
        <nav className='flex items-center justify-between h-16 sticky top-0 bg-background/60 backdrop-blur-md shadow px-6'>
            <div className='flex items-center gap-4'>
                {mounted && <MenuIcon
                    size={36}
                    className='cursor-pointer p-2 hover:bg-slate-200 rounded-full'
                    onClick={() => {
                        toggleSidebar();
                        setOpen(!open);
                    }}
                />}
                <a href="/" className='font-semibold text-lg'>PhotoX</a>
            </div>

            {mounted && open && <div
                className="min-h-screen bg-black/30 absolute px-3 py-2 top-0 left-0 z-10 w-full"
                onClick={() => {
                    toggleSidebar();
                    setOpen(!open);
                }}
            ></div>}

            {!auth.accessToken && <div className='flex items-center gap-4'>
                <Button className="cursor-pointer" onClick={() => navigate("/auth/login")}><LogInIcon /> Log in</Button>
                <Button className="cursor-pointer" variant='outline' onClick={() => navigate("/auth/signup")}><LogInIcon /> Sign up</Button>
            </div>}

            {auth.accessToken && <DropdownMenu>
                <DropdownMenuTrigger className='cursor-pointer rounded hover:bg-slate-200 w-1/5'>
                    <div className="flex items-center justify-between px-3 py-2">
                        <div className='flex items-center gap-2'>

                            <Avatar>
                                <AvatarImage src={profile?.image} className='rounded-full' />
                            </Avatar>

                            <div className="flex flex-col items-start">
                                <p>Welcome</p>
                                <p className='text-xs font-normal'>{profile?.name}</p>
                            </div>
                        </div>

                        <ChevronsUpDown size={16} />
                    </div>

                </DropdownMenuTrigger>
                <DropdownMenuContent className='p-3 mb-4 min-w-[var(--radix-dropdown-menu-trigger-width)]'>
                    <DropdownMenuLabel>
                        <div className='flex items-center gap-2'>

                            <Avatar>
                                <AvatarImage src={profile?.image} className='rounded-full' />
                            </Avatar>

                            <div className="flex flex-col items-start">
                                <p>Welcome</p>
                                <p className='text-xs font-normal'>{profile?.name}</p>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'><Settings2Icon size={16} /> My Account</DropdownMenuItem>
                    <DropdownMenuItem className='flex items-center gap-2 cursor-pointer' onClick={handleLogout}><LogOutIcon size={16} /> Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>}

            {/* Sidebar */}
            <div ref={sidebarRef} className='px-3 py-2 absolute bg-slate-200 top-0 -left-[120%] w-1/4 min-h-screen transition-all z-10 flex flex-col justify-between'>
                <XIcon
                    size={36}
                    className='cursor-pointer absolute top-4 right-4 p-2 hover:bg-slate-300 rounded-full'
                    onClick={() => {
                        toggleSidebar();
                        setOpen(!open);
                    }}
                />

                <ul className='flex flex-col gap-6 mt-16'>
                    <li>
                        <a href="/" className='font-semibold text-lg'>PhotoX</a>
                    </li>
                    <li>
                        <a href="/" className='flex items-center gap-4 text-sm'><HomeIcon size={24} /> Home</a>
                    </li>
                    <li>
                        <a href="/" className='flex items-center gap-4 text-sm'><LayoutDashboardIcon size={24} /> Dashboard</a>
                    </li>
                    <li>
                        <a href="/" className='flex items-center gap-4 text-sm'><ImageIcon size={24} /> My Images</a>
                    </li>
                    <li>
                        <a href="/" className='flex items-center gap-4 text-sm'><AlbumIcon size={24} /> My Albums</a>
                    </li>
                </ul>

                {!auth && <div className='grid grid-cols-2 gap-4'>
                    <Button className="cursor-pointer" onClick={() => navigate("/auth/login")}><LogInIcon /> Log in</Button>
                    <Button className="cursor-pointer" variant='outline' onClick={() => navigate("/auth/signup")}><LogInIcon /> Sign up</Button>
                </div>}

                {auth && <DropdownMenu>
                    <DropdownMenuTrigger className='cursor-pointer rounded hover:bg-slate-300'>
                        <div className="flex items-center justify-between px-3 py-2">
                            <div className='flex items-center gap-2'>

                                <Avatar>
                                    <AvatarImage src={profile?.image} className='rounded-full' />
                                </Avatar>

                                <div className="flex flex-col items-start">
                                    <p>Welcome</p>
                                    <p className='text-xs font-normal'>{profile?.name}</p>
                                </div>
                            </div>

                            <ChevronsUpDown size={16} />
                        </div>

                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='right' className='p-3 mb-4 min-w-[var(--radix-dropdown-menu-trigger-width)]'>
                        <DropdownMenuLabel>
                            <div className='flex items-center gap-2'>

                                <Avatar>
                                    <AvatarImage src={profile?.image} className='rounded-full' />
                                </Avatar>

                                <div className="flex flex-col items-start">
                                    <p>Welcome</p>
                                    <p className='text-xs font-normal'>{profile?.name}</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'><Settings2Icon size={16} /> My Account</DropdownMenuItem>
                        <DropdownMenuItem className='flex items-center gap-2 cursor-pointer' onClick={handleLogout}><LogOutIcon size={16} /> Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>}
            </div>
        </nav>
    )
}
