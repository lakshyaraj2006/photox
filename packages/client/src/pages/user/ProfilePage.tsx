import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2Icon, Trash2Icon, UserCircle2Icon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

const profileSchema = z.object({
    name: z.string().nonempty({ error: "Name cannot be empty!" }),
    image: z.custom<File>().nullable(),
})

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const { profile, setProfile, auth } = useAuth();
    const form = useForm();
    const [deleteReason, setDeleteReason] = useState("");

    useEffect(() => {
        form.setValue("name", profile?.name);
    }, [profile]);

    const onSubmit = async (data: z.infer<typeof profileSchema>) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('image', data.image);

        try {
            const response = await axiosInstance.patch('/user/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });
            setLoading(false);

            const { success, message, data: profileData } = response.data;

            if (success) {
                toast.success(message);
                setProfile(profileData);
            } else {
                toast.error(message);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response.data.message) {
                    toast.error(error.response.data.message);
                    setLoading(false);
                } else {
                    toast.error(error.response.data);
                    setLoading(false);
                }
            } else {
                toast.error('Some error occurred');
                setLoading(false);
            }
        }
    }

    const handleDelete = () => {
        if (deleteReason.length === 0) {
            alert("Please enter valid deletion reason!")
        } else {
            if (!window.confirm("Are you sure about your delete action ?")) {
                return;
            } else {
                const url = `https://mail.google.com/mail?view=cm&fs=1&to=${import.meta.env.VITE_ADMIN_EMAIL}&su=Request%20for%20Account%20Deletion&body=Reason%20for%20deletion%3A%20${encodeURI(deleteReason)}%0A%0A--------%0AName%3A%20${profile?.name}%0AEmail%20Address%3A%20${profile?.email}%0AUser%20Id%3A%20${profile?._id}%0A--------`;
                window.open(url, '_blank');

                setDeleteReason("");
            }
        }
    }

    return (
        <div className="max-w-5xl w-full mx-auto my-3 p-4 grid sm:grid-cols-8 gap-6 rounded-xl">
            <div className="col-span-3 w-full">
                <Card className="flex flex-row lg:flex-col w-full px-3 items-center">
                    <div className="flex justify-center items-center lg:w-full p-4">
                        <img
                            src={profile?.image}
                            className="w-32 h-32 rounded-full object-cover"
                            alt="Profile"
                        />
                    </div>

                    <div className="flex-1">
                        <CardContent className="text-left lg:text-center space-y-3">
                            <p>{profile?.name}</p>
                            <p><strong>Last Updated:</strong> {new Date(profile?.updatedAt).toDateString()}</p>
                            <p><strong>Joined:</strong> {new Date(profile?.createdAt).toDateString()}</p>
                        </CardContent>
                    </div>
                </Card>

            </div>
            <div className="col-span-5 w-full">
                <Tabs defaultValue="account">
                    <TabsList className="w-full">
                        <TabsTrigger value="account"><UserCircle2Icon /> Account</TabsTrigger>
                        <TabsTrigger value="delete" className="text-red-500"><Trash2Icon /> Delete Account</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" className="space-y-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Account Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-2">
                                <div>
                                    <p>UserId:</p>
                                    <p className="bg-blue-100 px-3 py-2 rounded">{profile?._id}</p>
                                </div>
                                <div>
                                    <p>Name:</p>
                                    <p className="bg-blue-100 px-3 py-2 rounded">{profile?.name}</p>
                                </div>
                                <div>
                                    <p>Username:</p>
                                    <p className="bg-blue-100 px-3 py-2 rounded">{profile?.username}</p>
                                </div>
                                <div>
                                    <p>Email:</p>
                                    <p className="bg-blue-100 px-3 py-2 rounded">{profile?.email}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your name" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormLabel>Image</FormLabel>
                                            <FormControl>
                                                <Input type="file" placeholder="Upload your image" {...fieldProps} onChange={(e) => onChange(e.target.files && e.target.files[0])} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <Button className={loading && "cursor-not-allowed"} disabled={loading}>{loading && <Loader2Icon className="animate-spin" />} Update</Button>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="delete">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold text-red-600">Delete Your Account</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Deleting your account means everything will be deleted & this action cannot be reversed. All profile details, images & albums will removed within few days.</p>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2 items-start">
                                <Textarea
                                    placeholder="Enter your delete reason"
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                ></Textarea>
                                <Button
                                    disabled={deleteReason.length === 0}
                                    className="cursor-pointer"
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    <Trash2Icon /> Delete My Account
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
