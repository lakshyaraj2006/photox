import { AlbumIcon, ChevronsUpDown, HomeIcon, ImageIcon, LayoutDashboardIcon, LogInIcon, LogOutIcon, MenuIcon, Settings2Icon } from 'lucide-react'
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu';
import { Avatar, AvatarImage } from './ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

interface SheetMenuProps {
    handleLogout: () => Promise<void>
}

export default function SheetMenu({ handleLogout }: SheetMenuProps) {
    const { auth, profile } = useAuth();
    const navigate = useNavigate();

    return (
        <Sheet>
            <SheetTrigger>
                <MenuIcon size={18} />
            </SheetTrigger>
            <SheetContent side='left'>
                <SheetHeader>
                    <SheetTitle>PhotoX</SheetTitle>
                    <SheetDescription hidden>Menu</SheetDescription>
                </SheetHeader>
                <ul className='flex flex-col gap-6 px-4'>
                    <li>
                        <Link to="/" className='flex items-center gap-4'><HomeIcon size={22} /> Home</Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className='flex items-center gap-4'><LayoutDashboardIcon size={22} /> Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/photos" className='flex items-center gap-4'><ImageIcon size={22} /> My Images</Link>
                    </li>
                    <li>
                        <Link to="/albums" className='flex items-center gap-4'><AlbumIcon size={22} /> My Albums</Link>
                    </li>
                </ul>
                <SheetFooter>
                    {!auth && <div className='grid grid-cols-2 gap-4'>
                        <Button className="cursor-pointer" onClick={() => navigate("/auth/login")}><LogInIcon /> Log in</Button>
                        <Button className="cursor-pointer" variant='outline' onClick={() => navigate("/auth/signup")}><LogInIcon /> Sign up</Button>
                    </div>}

                    {auth && <DropdownMenu>
                        <DropdownMenuTrigger className='cursor-pointer rounded hover:bg-slate-300 focus:outline-0 active:outline-0'>
                            <div className="flex items-center justify-between px-3 py-2">
                                <div className='flex items-center gap-2'>

                                    <Avatar>
                                        <AvatarImage src={profile?.image} className='rounded-full object-cover object-top' />
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
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}