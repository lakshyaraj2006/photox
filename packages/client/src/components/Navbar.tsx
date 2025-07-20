import { ChevronsUpDown, LogInIcon, LogOutIcon, Settings2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu';
import { Avatar, AvatarImage } from './ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import useLogout from '@/hooks/useLogout';
import SheetMenu from './SheetMenu';

export default function Navbar() {
    const [mounted, setMounted] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const { auth, profile } = useAuth();
    const logout = useLogout();

    useEffect(() => {
        setMounted(true);
    }, []);

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
                <SheetMenu handleLogout={handleLogout} />
                <Link to="/" className='font-semibold text-lg'>PhotoX</Link>
            </div>

            {!auth.accessToken && <div className='hidden md:flex items-center gap-4'>
                <Button className="cursor-pointer" onClick={() => navigate("/auth/login")}><LogInIcon /> Log in</Button>
                <Button className="cursor-pointer" variant='outline' onClick={() => navigate("/auth/signup")}><LogInIcon /> Sign up</Button>
            </div>}

            {auth.accessToken && <DropdownMenu>
                <DropdownMenuTrigger className='cursor-pointer rounded hover:bg-slate-200 w-0 lg:w-1/5 focus:outline-0 active:outline-0'>
                    <div className="flex items-center justify-end lg:justify-between px-3 py-2">
                        <div className='flex items-center gap-0 lg:gap-2'>

                            <Avatar>
                                <AvatarImage src={profile?.image} className='rounded-full object-cover object-top' />
                            </Avatar>

                            <div className="hidden lg:flex flex-col items-start">
                                <p>Welcome</p>
                                <p className='text-xs font-normal'>{profile?.name}</p>
                            </div>
                        </div>

                        <ChevronsUpDown size={16} className='hidden lg:block' />
                    </div>

                </DropdownMenuTrigger>
                <DropdownMenuContent className='hidden md:block p-3 mb-4 min-w-[var(--radix-dropdown-menu-trigger-width)]'>
                    <DropdownMenuLabel>
                        <div className='flex items-center gap-2'>

                            <Avatar>
                                <AvatarImage src={profile?.image} className='rounded-full object-cover object-top' />
                            </Avatar>

                            <div className="flex flex-col items-start">
                                <p>Welcome</p>
                                <p className='text-xs font-normal'>{profile?.name}</p>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='flex items-center gap-2 cursor-pointer' onClick={() => navigate("/user/profile")}><Settings2Icon size={16} /> My Account</DropdownMenuItem>
                    <DropdownMenuItem className='flex items-center gap-2 cursor-pointer' onClick={handleLogout}><LogOutIcon size={16} /> Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>}
        </nav>
    )
}
